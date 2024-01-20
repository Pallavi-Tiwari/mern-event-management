import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home'
import About from './pages/About';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp'
import Header from './components/Header';
import CreateEventListing from './pages/CreateEventListing';
import PrivateRoute from './components/PrivateRoute';
import UpdateEventListing from './pages/updateEventListing';
import Listing from './pages/Listing';
import Search from './pages/Search';


export default function App() {
  return (<BrowserRouter>
    <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/home' element={<Home />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/search' element={<Search />} />
        <Route path='/listing/:listingId' element={<Listing />}/>
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/create-event' element={<CreateEventListing />} />
          <Route path='/update-event/:listingId' element={<UpdateEventListing />} />
        </Route>
        <Route path='/sign-in' element={<SignIn />}/>
        <Route path='/sign-up' element={<SignUp />}/>
      </Routes>
  </BrowserRouter>
  )
}
