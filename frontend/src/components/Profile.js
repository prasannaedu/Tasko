import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaMobileRetro} from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import PostCard from './PostCard';




const Profile = () => {
  const [profile, setProfile] = useState({
    bio: '',
    avatar: null,
    cover_image: null,
    mobile_number: '',
    joined_date: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
    fetchSavedPosts();
  }, []);

  
   
const fetchSavedPosts = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/profile/saved_posts/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSavedPosts(response.data);
  } catch (error) {
    console.error('Error fetching saved posts:', error);
  }
};
  
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setProfile(response.data);
      // console.log(response.data);
      setProfile({
        ...response.data,
        avatar: response.data.avatar || null, // Ensure avatar is not undefined
        cover_image: response.data.cover_image || null, // Ensure cover_image is not undefined
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, [e.target.name]: file });
    }
  };
  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/profile/posts/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data.filter(post => post.post_type === 'public'));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('bio', profile.bio);
      formData.append('mobile_number', profile.mobile_number);
      if (profile.avatar instanceof File) {
        formData.append('avatar', profile.avatar);
      }
      // if (profile.cover_image) formData.append('cover_image', profile.cover_image);
      if (profile.cover_image instanceof File) {
        formData.append('cover_image', profile.cover_image);
      }
      for(let[key,value] of formData.entries()){
        console.log(key,value);
      }

      await api.patch('/profile/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setEditMode(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Response data:', error.response.data);
    }
  };

  return (
  <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white">
    {/* <h1 className="text-2xl font-bold mb-4">Profile</h1> */}

    {editMode ? (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Mobile Number</label>
          <input
            type="text"
            name="mobile_number"
            value={profile.mobile_number}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Profile Picture</label>
          <input
            type="file"
            name="avatar"
            onChange={handleFileChange}
            className="w-full p-2 bg-gray-700 text-white rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Cover Image</label>
          <input
            type="file"
            name="cover_image"
            onChange={handleFileChange}
            className="w-full p-2 bg-gray-700 text-white rounded-md"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditMode(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
        >
          Cancel
        </button>
      </form>
    ) : (
      <div>
        {/* Cover Image Section */}
        <div className="relative w-full h-56 lg:h-64 md:h-44 pb-5 rounded-md overflow-hidden">
          <img
            src={profile.cover_image || 'https://placehold.co/800x200'}
            alt="Cover"
            className="w-full h-full object-cover"
          />

          {/* Profile Image at Bottom-Left of Cover */}
          <div className="absolute bottom-[-0px] left-6 ">
            <img
              src={profile.avatar || 'https://placehold.co/150'}
              alt="Profile"
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-full outline outline-8  outline-gray-900 shadow-lg bg-gray-900"
            />
          </div>
        </div>

        {/* Profile Details (Aligned with Profile Image) */}
        <div className="mt-5 ml-3"> {/* Adjust margin to align text with profile image */}
          <h2 className="text-2xl font-bold text-gray-200 mb-4">{profile.username}</h2>
          <p className="text-gray-300 italic ml-0 font-mono mb-4 border-l-4 border-blue-500 pl-4 ">{profile.bio}</p>
          <p className="text-gray-300 font-mono mb-4 flex items-center"><FaMobileRetro size={24}/><span className="ml-2">{profile.mobile_number || 'Not provided'}</span></p>
          <p className="text-gray-400 font-sans flex items-center mb-4 pl-0"><MdDateRange size={24}/> <span className="ml-2">Joined: {new Date(profile.joined_date).toLocaleDateString()}</span></p>

          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-4 py-2 mt-3 rounded-md"
          >
            Edit Profile
          </button>
        </div>
        <div className="mt-8 bg-gray-900  rounded-lg shadow-md text-white max-w-2xl mx-auto  ">
          <h2 className="text-xl font-bold mb-4">My Posts</h2>
          {posts.map((post) => (
          <PostCard key={post.id} post={post} />
          ))}   
        </div>
        <div className="mt-4 bg-gray-900  rounded-lg shadow-md text-white max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Saved Posts</h2>
          <div className="">
          {savedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default Profile;