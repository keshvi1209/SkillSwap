import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom';

function Entrypage() {
   const isAuthenticated = !!localStorage.getItem('token');
   return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default Entrypage 