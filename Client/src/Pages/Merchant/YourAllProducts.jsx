import React, { useEffect, useState } from "react";
import MerchantNav from "../../Components/MerchantComponents/MerchantNav";
import MerchantFooter from "../../Components/MerchantComponents/MerchantFooter";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";

const YourAllProducts = () => {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState(null);
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/merchant/login"); // Redirect to login page if not authenticated
    return;
  }

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

      const fetchMyProducts = async () => {
        try {
          const response = await axios.get(
            "http://localhost:4001/api/merchants/my-products",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            console.log(response.data);
            const all = response.data;
            setRecentProducts(all.reverse());
          }
        } catch (error) {
          console.log("Error fetching products!!!");
        }
      };
      fetchMyProducts();
    }
  }, [decodedToken]);

  return (
    <div class="bg-indigo-100 relative pb-6 sm:pb-8 lg:pb-12">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <MerchantNav />
        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <header className="text-center">
              <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                Your Products
              </h2>
            </header>

            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 items-center">
              {recentProducts?.map((recentProduct) => (
                <li>
                  <Link
                    to={`/merchant/my-products/${recentProduct?._id}`}
                    className="group block overflow-hidden rounded-md"
                  >
                    <img
                      src={recentProduct.profilePic}
                      alt={recentProduct?.name}
                      className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                    />

                    <div className="relative bg-white pt-3">
                      <h3 className="text-xs ml-2 text-gray-700 group-hover:underline group-hover:underline-offset-4">
                        {recentProduct.name}
                      </h3>

                      <p className="mt-2 ml-2">
                        <span className="sr-only"> Regular Price </span>

                        <span className="tracking-wider text-gray-900">
                          {" "}
                          ₹ {recentProduct.price}{" "}
                        </span>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <MerchantFooter />
      </div>
    </div>
  );
};

export default YourAllProducts;
