import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from '../context/AuthContext';



const Navbar = () => {

    const {isAuthenticated,logout}=useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const navigate=useNavigate();

    const handleLogout=()=>{
        logout();
        navigate('/');
    };
    return(
        <nav className="bg-gray-800 p-6 ">
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center'>
                    <Link to='/' className='text-white text-2xl font-bold'>Tasko</Link>
                    <div className='flex space-x-4'>
                        {isAuthenticated ?(
                            <>
                                <div className='hidden md:flex'>
                                <Link to='/explore' className='text-gray-300 hover:text-white px-3 py-2'>Explore</Link>
                                <Link to='/profile' className='text-gray-300 hover:text-white px-3 py-2'>Profile</Link>
                                <Link to='/dashboard' className='text-gray-300 hover:text-white px-3 py-2'>Dashboard</Link>
                                <Link to='/communities' className='text-gray-300 hover:text-white px-3 py-2'>Communities</Link>
                                <button onClick={handleLogout} className='text-gray-300 hover:text-white px-3 py-2'>Logout</button>
                                </div>
                                <button className='md:hidden text-gray-300 hover:text-white' onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    <svg className='h-6 w-6' fill="none" viewBox='0 0 24 24' stroke="currentColor">
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16m-7 6h7'/>
                                    </svg>
                                </button>
                                
                                
                            </>
                        ):(
                            <Link to='/login' className='text-gray-300 hover:text-white px-3 py-2'>Login</Link>
                        )}
                    </div>
                </div>
                {isMenuOpen&&isAuthenticated&&(
                    <div className='md:hidden mt-2 space-y-2'>
                        <Link to='/explore' className='block text-gray-300 hover:text-white px-3 py-2'>Explore</Link>
                        <Link to="/profile" className="block text-gray-300 hover:text-white px-3 py-2">Profile</Link>
                        <Link to="/dashboard" className="block text-gray-300 hover:text-white px-3 py-2">Dashboard</Link>
                        <Link to="/communities" className="block text-gray-300 hover:text-white px-3 py-2">Communities</Link>
                        <button onClick={handleLogout} className='text-gray-300 hover:text-white px-3 py-2'>Logout</button>
                    </div>
                )}

            </div>
        </nav>
    )
}








// const Navbar = () => {
//     const [isMenuOpen, setIsMenuOpen] = React.useState(false);
//     return(
//         <nav className="bg-gray-800 p-6 ">
//             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center">

//                     <Link to="/" className="text-white text-2xl font-bold">Tasko</Link>
//                     <div className='hidden md:flex space-x-4'>
//                         <Link to="/profile" className="text-gray-300 hover:text-white px-3 py-2">Profile</Link>
//                         <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2">Dashboard</Link>
//                         <Link to="/communities" className="text-gray-300 hover:text-white px-3 py-2">Communities</Link>
//                     </div>
//                     <button className='md:hidden text-gray-300 hover:text-white' onClick={() => setIsMenuOpen(!isMenuOpen)}>
//                         <svg className='h-6 w-6' fill="none" viewBox='0 0 24 24' stroke="currentColor">
//                             <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16m-7 6h7'/>
//                         </svg>
//                     </button>
//                 </div>
//                 {isMenuOpen&&(
//                     <div className='md:hidden mt-2 space-y-2'>
//                         <Link to="/profile" className="block text-gray-300 hover:text-white px-3 py-2">Profile</Link>
//                         <Link to="/dashboard" className="block text-gray-300 hover:text-white px-3 py-2">Dashboard</Link>
//                         <Link to="/communities" className="block text-gray-300 hover:text-white px-3 py-2">Communities</Link>
//                     </div>
//                 )}


//             </div>
//         </nav>
//     )

// };

export default Navbar;