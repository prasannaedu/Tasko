import React, { useState, useEffect } from 'react';
import api from '../api/api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Explore = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPublicPosts();
  }, []);

  const fetchPublicPosts = async () => {
    try {
      const response = await api.get('/posts/public/');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching public posts:', error);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white max-w-2xl mx-auto">
      {/* <h1 className="text-2xl font-bold mb-4">Feed</h1> */}
        <CreatePost onPostCreated={fetchPublicPosts} />
      {posts.map((post) => (
        // <div key={post.id} className="bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
        //   <p className="text-gray-300">{post.content}</p>
        //   {console.log('this is', `${post.image}`)}
        //   {post.image && (
        //     <img
        //       src={`${post.image}`}
        //       alt="Post"
        //       className="mt-2 rounded-md"
        //     />
        //   )}
        //   <p className="text-gray-400 text-sm mt-2">
        //     Posted by {post.user} on {new Date(post.created_at).toLocaleString()}
        //   </p>
        // </div>
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Explore;