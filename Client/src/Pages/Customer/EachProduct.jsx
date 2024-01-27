import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import CustomerNav from "../../Components/CustomerComponents/CustomerNav";
import CustomerFooter from "../../Components/CustomerComponents/CustomerFooter";

const EachProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [eachProduct, setEachProduct] = useState(null);

  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/customer/login"); // Redirect to login page if not authenticated
    return;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // No token found, redirect to login page
      navigate("/customer/login");
    } else {
      const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds

      if (tokenExpiration && tokenExpiration < Date.now()) {
        // Token expired, remove from local storage and redirect to login page
        localStorage.removeItem("token");
        navigate("/customer/login");
      }

      const fetchEachProduct = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4001/api/customers/products/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            console.log(response.data);
            setEachProduct(response.data);
          }
        } catch (error) {
          console.log("Error fetching products!!!");
        }
      };
      fetchEachProduct();
    }
  }, [decodedToken]);
  return (
    <div class="bg-indigo-100 relative pb-6 sm:pb-8 lg:pb-12">
    <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
      <CustomerNav />
      <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2 rounded-md">
        <img
          alt={`Photo of ${eachProduct?.name}`}
          src={eachProduct?.profilePic}
          className="h-56 w-full object-cover sm:h-full"
        />
        <div className="p-8 md:p-12 lg:px-16 lg:py-24">
          <div className="flow-root rounded-lg border bg-purple-300 border-gray-800 py-3 shadow-sm">
            <dl className="-my-3 divide-y divide-gray-800 text-sm">
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Product Name</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {eachProduct?.name}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Category</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {eachProduct?.category}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Quantity</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {eachProduct?.quantity}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Price</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  ₹ {eachProduct?.price}/-
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">
                  Product Description
                </dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {eachProduct?.desc}
                </dd>
              </div>
            </dl>
          </div>
          <div className="lg:flex justify-left items-center gap-3 xs:flex-col xs:gap-4">
            <button
              className="text-center px-6 py-3 mt-4 bg-blue-900 hover:bg-blue-950 text-gray-200 rounded-md"
            >
              Add To Cart 🛒
            </button>
            <button
              className="text-center px-6 py-3 mt-4 bg-blue-900 hover:bg-blue-950 text-gray-200 rounded-md"
            >
              Add To Wishlist ❣️
            </button>
          </div>
        </div>
      </section>
      <CustomerFooter />
    </div>
  </div>
  )
};

export default EachProduct;
