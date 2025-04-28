import { Routes, Route } from 'react-router-dom';
import App from './App.jsx'; // Meme Maker App
import Login from './Login.jsx'; 
import Register from './Register.jsx'; 

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default MainRoutes;
