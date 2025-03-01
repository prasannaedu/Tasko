import React, { useState } from 'react';
import { FaHeart, FaComment, FaBookmark, FaShare } from 'react-icons/fa';
import api from '../api/api';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [isSaved, setIsSaved] = useState(post.is_saved);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState('');

  

  const handleLike = async () => {
    try {
      await api.post(`/posts/${post.id}/like/`);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSave = async () => {
    try {
      await api.post(`/posts/${post.id}/save/`);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `http://localhost:3000/posts/${post.id}`
      );
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Sharing failed:', err);
    }
  };
  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/posts/${post.id}/comment/`, { text: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
      {/* {fetchProfile()} */}
      {/* Header */}
      <div className="flex items-center mb-4">
        <img 
          src={post.user.profile.avatar||'https://placehold.co/40'} 
          className="w-10 h-10 rounded-full mr-3"
          alt="Profile"
        />
        {/* {console.log(post.user)} */}
        <div>
          <h3 className="font-semibold text-gray-200">{post.user.username}</h3>
          <p className="text-gray-400 text-sm">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-300 mb-4">{post.content}</p>
      
      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="mt-2 rounded-md w-full max-h-96 object-cover"
        />
      )}

      {/* Actions */}
      <div className="flex items-center mt-4 gap-4 border-t border-gray-700 pt-4">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
        >
          <FaHeart />
          <span>{likesCount}</span>
        </button>
        
        <button className="text-gray-400 flex items-center gap-2">
          <FaComment />
          <span>{comments.length}</span>
        </button>
        
        <button 
          onClick={handleSave}
          className={`ml-auto ${isSaved ? 'text-blue-500' : 'text-gray-400'}`}
        >
          <FaBookmark />
        </button>
        
        <button onClick={handleShare} className="text-gray-400">
          <FaShare />
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-4">
        <form onSubmit={handleComment} className="mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-gray-700 text-white rounded-md p-2"
          />
        </form>
        
        {comments.map(comment => (
          <div key={comment.id} className="flex items-start mb-3">
            <img
              src={comment.user.profile.avatar||'https://placehold.co/30'}
              className="w-6 h-6 rounded-full mr-2"
              alt="Profile"
            />
            {/* {console.log(comment)} */}
            <div className="bg-gray-700 p-2 rounded-lg flex-1">
              <p className="text-gray-200 text-sm font-medium">
                {comment.user.profile.username}
              </p>
              <p className="text-gray-300 text-sm">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;