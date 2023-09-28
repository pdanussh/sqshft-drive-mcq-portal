
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isUserLoggedIn } from "../../utils/helpers";


const ProtectedRoute = () => {
    const auth = isUserLoggedIn(); 
    return auth ? <Outlet /> : <Navigate to="/" />;
};


export default ProtectedRoute;