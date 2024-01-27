import React, { useEffect } from "react";
import MerchantNav from "../../Components/MerchantComponents/MerchantNav";
import MerchantFooter from "../../Components/MerchantComponents/MerchantFooter";
import YourRecentProducts from "../../Components/MerchantComponents/YourRecentProducts";
import AddProduct from "../../Components/MerchantComponents/AddProduct";
import { useNavigate } from "react-router-dom";
import { useJwt } from 'react-jwt'

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
    if (!token) {
      navigate("/merchant/login"); // Redirect to login page if not authenticated
      return;
    }

    const userName = decodedToken ? decodedToken.name : "No Name Found";

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        // No token found, redirect to login page
        navigate("/merchant/login");
      } else {
        const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds
  
        if (tokenExpiration && tokenExpiration < Date.now()) {
          // Token expired, remove from local storage and redirect to login page
          localStorage.removeItem("token");
          navigate("/merchant/login");
        }
      }
    }, [decodedToken])
  return (
    <div class="bg-indigo-100 relative pb-6 sm:pb-8 lg:pb-12">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <MerchantNav />
        <h2 className="my-8 text-5xl text-gray-800 font-bold">Welcome back, <span className="text-blue-950">{userName}</span></h2>
        <YourRecentProducts />
        <AddProduct />
        <MerchantFooter />
      </div>
    </div>
  );
};

export default MerchantDashboard;
