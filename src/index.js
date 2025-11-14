import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom'; // <-- BÓRRALO SI ESTÁ
import './index.css'; // (O cualquier CSS que tengas)
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter>  <--- BÓRRALO SI ESTÁ */}
      <App />
    {/* </BrowserRouter> <--- BÓRRALO SI ESTÁ */}
  </React.StrictMode>
);