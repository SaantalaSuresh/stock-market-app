


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      console.log(data._id);
      localStorage.setItem('userId', data._id);
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-5'>
      <div className='bg-white p-8 rounded-lg shadow-xl w-full max-w-md'>
        <h1 className='text-3xl text-center font-semibold text-gray-800 mb-6'>Sign In</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input
            type='email'
            placeholder='Email'
            id='email'
            className='bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={handleChange}
            required
          />
          <input
            type='password'
            placeholder='Password'
            id='password'
            className='bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={handleChange}
            required
          />
          <button
            disabled={loading}
            className='bg-blue-300 text-white p-3 rounded-lg uppercase font-semibold tracking-wide hover:bg-blue-400 transition-colors duration-300 disabled:opacity-70'
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
         <center> <p className='font-semibold text-gray-800'>Or</p></center>
          <OAuth />
        </form>
        <div className='flex gap-2 mt-6 justify-center'>
          <p className='text-gray-600'>Don't have an account?</p>
          <Link to='/sign-up'>
            <span className='text-blue-600 hover:underline'>Sign up</span>
          </Link>
        </div>
        {error && (
          <p className='text-red-600 mt-5 text-center'>
            {error.message || 'Something went wrong!'}
          </p>
        )}
      </div>
    </div>
  );
}
