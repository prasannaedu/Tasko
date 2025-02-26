import React, { useState } from 'react';
import api from '../api/api';

const CreatePost = ({ onPostCreated, communityId }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [postType, setPostType] = useState('public');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    formData.append('post_type', postType);
    if (image) formData.append('image', image);
    if (communityId) formData.append('community_id', communityId);

    try {
      const token = localStorage.getItem('token');
      const endpoint = communityId ? `/communities/${communityId}/posts/` : '/posts/public/';
      await api.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setContent('');
      setImage(null);
      onPostCreated(); // Refresh posts
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl text-white font-bold mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 bg-gray-700 text-white rounded-md"
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 bg-gray-700 text-white rounded-md"
        />
        {!communityId && (
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-md"
          >
            <option value="public">Public</option>
            <option value="community">Community</option>
          </select>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;