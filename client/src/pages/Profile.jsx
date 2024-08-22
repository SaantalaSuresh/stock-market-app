

import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
      localStorage.removeItem('userId');
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
      localStorage.removeItem('userId');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='min-h-screen flex bg-gray-100'>
      <aside className='bg-blue-800 text-white w-64 p-6 flex flex-col justify-between'>
        <div>
          <h2 className='text-2xl font-semibold mb-8'>Account Settings</h2>
          <nav className='space-y-4'>
            <button 
              onClick={() => fileRef.current.click()}
              className='text-left text-white hover:bg-blue-600 rounded-lg p-3'
            >
              Upload Profile Picture
            </button>
            <button
              onClick={handleSubmit}
              className='text-left text-white hover:bg-blue-600 rounded-lg p-3'
            >
              Update Profile
            </button>
          </nav>
        </div>
        <div>
          <button
            onClick={handleDeleteAccount}
            className='w-full text-left text-red-600 hover:bg-red-500 hover:text-white rounded-lg p-3 mb-4'
          >
            Delete Account
          </button>
          <button
            onClick={handleSignOut}
            className='w-full text-left text-white hover:bg-blue-600 rounded-lg p-3'
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className='flex-grow p-6'>
        <h1 className='text-3xl font-semibold mb-8'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <input
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className='flex items-center gap-6'>
            <img
              src={formData.profilePicture || currentUser.profilePicture}
              alt='profile'
              className='h-24 w-24 cursor-pointer rounded-full object-cover'
              onClick={() => fileRef.current.click()}
            />
            <div className='flex flex-col'>
              <p className='text-sm'>
                {imageError ? (
                  <span className='text-red-600'>
                    Error uploading image (file size must be less than 2 MB)
                  </span>
                ) : imagePercent > 0 && imagePercent < 100 ? (
                  <span className='text-blue-600'>{`Uploading: ${imagePercent}%`}</span>
                ) : imagePercent === 100 ? (
                  <span className='text-green-600'>Image uploaded successfully</span>
                ) : (
                  ''
                )}
              </p>
              <p className='text-gray-600 mt-1'>Click the image to upload a new profile picture</p>
            </div>
          </div>
          <input
            defaultValue={currentUser.username}
            type='text'
            id='username'
            placeholder='Username'
            className='bg-white p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600'
            onChange={handleChange}
          />
          <input
            defaultValue={currentUser.email}
            type='email'
            id='email'
            placeholder='Email'
            className='bg-white p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600'
            onChange={handleChange}
          />
          <input
            type='password'
            id='password'
            placeholder='Password'
            className='bg-white p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600'
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className='bg-blue-600 text-white p-4 rounded-lg uppercase hover:bg-blue-700 transition-colors duration-300 disabled:opacity-70'
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
        <p className='text-red-600 mt-6'>{error && 'Something went wrong!'}</p>
        <p className='text-green-600 mt-6'>{updateSuccess && 'Profile updated successfully!'}</p>
      </main>
    </div>
  );
}



// import { useSelector } from 'react-redux';
// import { useRef, useState, useEffect } from 'react';
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from 'firebase/storage';
// import { app } from '../firebase';
// import { useDispatch } from 'react-redux';
// import {
//   updateUserStart,
//   updateUserSuccess,
//   updateUserFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   deleteUserFailure,
//   signOut,
// } from '../redux/user/userSlice';

// export default function Profile() {
//   const dispatch = useDispatch();
//   const fileRef = useRef(null);
//   const [image, setImage] = useState(undefined);
//   const [imagePercent, setImagePercent] = useState(0);
//   const [imageError, setImageError] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [updateSuccess, setUpdateSuccess] = useState(false);

//   const { currentUser, loading, error } = useSelector((state) => state.user);
//   useEffect(() => {
//     if (image) {
//       handleFileUpload(image);
//     }
//   }, [image]);
//   const handleFileUpload = async (image) => {
//     const storage = getStorage(app);
//     const fileName = new Date().getTime() + image.name;
//     const storageRef = ref(storage, fileName);
//     const uploadTask = uploadBytesResumable(storageRef, image);
//     uploadTask.on(
//       'state_changed',
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         setImagePercent(Math.round(progress));
//       },
//       (error) => {
//         setImageError(true);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
//           setFormData({ ...formData, profilePicture: downloadURL })
//         );
//       }
//     );
//   };
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch(updateUserStart());
//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         dispatch(updateUserFailure(data));
//         return;
//       }
//       dispatch(updateUserSuccess(data));
//       setUpdateSuccess(true);
//     } catch (error) {
//       dispatch(updateUserFailure(error));
//     }
//   };

//   const handleDeleteAccount = async () => {
//     try {
//       dispatch(deleteUserStart());
//       const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//         method: 'DELETE',
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         dispatch(deleteUserFailure(data));
//         return;
//       }
//       dispatch(deleteUserSuccess(data));
//     } catch (error) {
//       dispatch(deleteUserFailure(error));
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await fetch('/api/auth/signout');
//       dispatch(signOut())
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <div className='p-3 max-w-lg mx-auto'>
//       <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
//         <input
//           type='file'
//           ref={fileRef}
//           hidden
//           accept='image/*'
//           onChange={(e) => setImage(e.target.files[0])}
//         />
//         {/* 
//       firebase storage rules:  
//       allow read;
//       allow write: if
//       request.resource.size < 2 * 1024 * 1024 &&
//       request.resource.contentType.matches('image/.*') */}
//         <img
//           src={formData.profilePicture || currentUser.profilePicture}
//           alt='profile'
//           className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
//           onClick={() => fileRef.current.click()}
//         />
//         <p className='text-sm self-center'>
//           {imageError ? (
//             <span className='text-red-700'>
//               Error uploading image (file size must be less than 2 MB)
//             </span>
//           ) : imagePercent > 0 && imagePercent < 100 ? (
//             <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
//           ) : imagePercent === 100 ? (
//             <span className='text-green-700'>Image uploaded successfully</span>
//           ) : (
//             ''
//           )}
//         </p>
//         <input
//           defaultValue={currentUser.username}
//           type='text'
//           id='username'
//           placeholder='Username'
//           className='bg-slate-100 rounded-lg p-3'
//           onChange={handleChange}
//         />
//         <input
//           defaultValue={currentUser.email}
//           type='email'
//           id='email'
//           placeholder='Email'
//           className='bg-slate-100 rounded-lg p-3'
//           onChange={handleChange}
//         />
//         <input
//           type='password'
//           id='password'
//           placeholder='Password'
//           className='bg-slate-100 rounded-lg p-3'
//           onChange={handleChange}
//         />
//         <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
//           {loading ? 'Loading...' : 'Update'}
//         </button>
//       </form>
//       <div className='flex justify-between mt-5'>
//         <span
//           onClick={handleDeleteAccount}
//           className='text-red-700 cursor-pointer'
//         >
//           Delete Account
//         </span>
//         <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
//           Sign out
//         </span>
//       </div>
//       <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
//       <p className='text-green-700 mt-5'>
//         {updateSuccess && 'User is updated successfully!'}
//       </p>
//     </div>
//   );
// }