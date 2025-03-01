import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import PostCard from './PostCard';

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${postId}/`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [postId]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white max-w-2xl mx-auto">
      {post ? (
        // Render your post content here
        <div>
          {/* <h1>{post.content}</h1> */}
          {/* Add other post details */}
          <PostCard key={post.id} post={post} />
        </div>
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
};

export default PostDetailPage;