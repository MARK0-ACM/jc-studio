import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom'; // <-- BÓRRALO SI ESTÁ
import './index.css'; // (O cualquier CSS que tengas)
import App from './App';

// Fix para iOS/Android: 100vh no coincide con el viewport real en vertical
const setVhVar = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setVhVar();
window.addEventListener('resize', setVhVar);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter>  <--- BÓRRALO SI ESTÁ */}
      <App />
    {/* </BrowserRouter> <--- BÓRRALO SI ESTÁ */}
  </React.StrictMode>
);
