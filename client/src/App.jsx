// // import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // import Home from './pages/Home';
// // import About from './pages/About';
// // import SignIn from './pages/SignIn';
// // import SignUp from './pages/SignUp';
// // import Profile from './pages/Profile';
// // import Header from './components/Header';
// // import PrivateRoute from './components/PrivateRoute';
// // import Watchlist from './pages/Watchlist';

// // export default function App() {
// //   return (
// //     <BrowserRouter>
// //       {/* header */}
// //       <Header />
// //       <Routes>
// //         <Route path='/' element={<Home />} />
// //         <Route path='/about' element={<About />} />
// //         <Route path='/sign-in' element={<SignIn />} />
// //         <Route path='/sign-up' element={<SignUp />} />
// //         <Route path='/watchlist' element={<Watchlist />} />
// //         <Route element={<PrivateRoute />}>
// //           <Route path='/profile' element={<Profile />} />
// //         </Route>
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }



// import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// import Home from './pages/Home';
// import About from './pages/About';
// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
// import Profile from './pages/Profile';
// import Header from './components/Header';
// import PrivateRoute from './components/PrivateRoute';
// import Watchlist from './pages/Watchlist';

// function App() {
//   const location = useLocation();
//   const shouldShowHeader = !['/sign-in', '/sign-up'].includes(location.pathname);

//   return (
//     <>
//       {shouldShowHeader && <Header />}
//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/about' element={<About />} />
//         <Route path='/sign-in' element={<SignIn />} />
//         <Route path='/sign-up' element={<SignUp />} />
//         <Route path='/watchlist' element={<Watchlist />} />
//         <Route element={<PrivateRoute />}>
//           <Route path='/profile' element={<Profile />} />
//         </Route>
//       </Routes>
//     </>
//   );
// }

// export default function AppWrapper() {
//   return (
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   );
// }



import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import WatchList from './pages/WatchList';

export default function App() {
  return (
    <BrowserRouter>
      {/* header */}
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/watchlist' element={<WatchList />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
