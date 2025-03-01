import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import PostCard from './PostCard';

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${postId}/`);
        setPost(response.data);
        console.log(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching post:', error);
        if (error.response?.status === 404) {
          setError('Post not found');
        } else {
          setError('Failed to load post');
        }
      }
    };
    fetchPost();
  }, [postId]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white max-w-2xl mx-auto">
      
      {error ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error 404</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Go Back
          </button>
        </div>
      ) : post ? (
        <PostCard post={post} /> 
      ) : (
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/2 mb-4 mx-auto"></div>
            <div className="h-4 bg-gray-800 rounded w-3/4 mb-2 mx-auto"></div>
            <div className="h-4 bg-gray-800 rounded w-3/4 mb-2 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;