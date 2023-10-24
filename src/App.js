import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Faq from './pages/Faq';
import Login from './pages/Login';
import MatchingSystem from './pages/Matching';
import Resources from './pages/Resources';
import UserProfile from './pages/UserProfile';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

// note React requires that the first letter of components are capitalized - otherwise WILL cause errors

function App() {
  return (
    <BrowserRouter>
      <NavigationBar/>
      <Routes>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Faq' element={<Faq/>}/>
        <Route path='/Matching' element={<MatchingSystem/>}/>
        <Route path='/Resources' element={<Resources/>}/>
        <Route path='/UserProfile' element={<UserProfile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
