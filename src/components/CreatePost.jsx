import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CreatePost = () => {
    const { user } = useAuth();
    const [text, setText] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Helper: Convert File to Base64 String
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text && !imageFile) return;

        // 1. Validation: Check if image is too large for Firestore (Limit: ~700KB safe zone)
        if (imageFile && imageFile.size > 700000) {
            toast.error("Image is too large! Please use an image under 700KB.");
            return;
        }

        setLoading(true);

        try {
            let imageBase64 = null;

            // 2. Convert Image to String if exists
            if (imageFile) {
                imageBase64 = await convertToBase64(imageFile);
            }

            // 3. Save directly to Database
            await addDoc(collection(db, "posts"), {
                uid: user.uid,
                username: user.displayName,
                userPhoto: user.photoURL,
                text: text,
                imageUrl: imageBase64, // Storing the huge string here
                likes: [],
                createdAt: serverTimestamp(),
            });

            setText('');
            setImageFile(null);
            // Reset the file input visually
            document.getElementById("fileInput").value = "";
            toast.success('Post created!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to post');
        }
        setLoading(false);
    };

    return (
        <div className="create-post card">
            <textarea
                placeholder={`What's on your mind, ${user.displayName}?`}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="actions">
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </div>
        </div>
    );
};

export default CreatePost;