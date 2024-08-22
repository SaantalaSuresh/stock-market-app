


import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='bg-slate-100 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        <Link to='/'>
          <h1 className='text-2xl font-extrabold text-blue-600 tracking-wide'>Stock </h1>
        </Link>
        <ul className='flex gap-6 items-center'>
          <li>
            <Link
              to='/'
              className='text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200'
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to='/watchlist'
              className='text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200'
            >
              WatchList
            </Link>
          </li>
          <li>
            <Link
              to='/about'
              className='text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200'
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to='/profile'
              className='text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2'
            >
              {currentUser ? (
                <div className='flex items-center gap-2'>
                  <img
                    src={currentUser.profilePicture}
                    alt='profile'
                    className='h-8 w-8 rounded-full object-cover border-2 border-blue-600'
                  />
                  <span className='text-sm font-semibold text-gray-900'>
                    {currentUser.name}
                  </span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
