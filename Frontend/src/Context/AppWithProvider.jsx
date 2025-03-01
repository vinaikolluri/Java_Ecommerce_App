import React from 'react';
import { AuthProvider } from './AuthContext';
// import { CartProvider } from './Context/CartContext';
import App from '../App';
import { CartProvider } from './CartContext';

const AppWithProvider = () => (
  <AuthProvider>
   <CartProvider>
   
   <App />
   
   </CartProvider>
  </AuthProvider>
);

export default AppWithProvider;
