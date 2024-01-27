import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const YourRecentProducts = () => {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState(null);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // No token found, redirect to login page
          navigate("/merchant/login");
        }
        const response = await axios.get("http://localhost:4001/api/merchants/my-products", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(response.status===200) {
            console.log(response.data);
            const all = response.data;
            setRecentProducts(all.slice(-3).reverse());
        }
      } catch (error) {
        console.log("Cant fetch products!!!", error);
      }
    };

    fetchRecentProducts();
  }, []);

  return (
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

          <li>
            <a href="#" className="cursor-pointer group block overflow-hidden rounded-md">
              {/* <img
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt=""
                className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
              /> */}

              <div className="relative bg-blue-900 pt-3 hover:bg-blue-950">
                <h3 className="text-xs ml-2 text-gray-200 group-hover:underline group-hover:underline-offset-4">
                  All Products →
                </h3>

                <p className="mt-2 ml-2">
                  <span className="sr-only"> Regular Price </span>

                  <span className="tracking-wider text-gray-200">
                    {" "}
                    Checkout all your products{" "}
                  </span>
                </p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default YourRecentProducts;
