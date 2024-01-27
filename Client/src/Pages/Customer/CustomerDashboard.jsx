import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import CustomerNav from "../../Components/CustomerComponents/CustomerNav";
import CustomerFooter from "../../Components/CustomerComponents/CustomerFooter";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState(null);
  const [companies, setCompanies] = useState(null);
  const [categories, setCategories] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/customer/login"); // Redirect to login page if not authenticated
    return;
  }

  const userName = decodedToken ? decodedToken.name : "No Name Found";

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

      const fetchRecentProducts = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            // No token found, redirect to login page
            navigate("/customer/login");
          }
          const response = await axios.get(
            "http://localhost:4001/api/customers/products",
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
            const uniqueCompanies = [
              ...new Set(all.map((each) => each.company)),
            ];
            const uniqueCategories = [
              ...new Set(all.map((each) => each.category)),
            ];
            console.log(uniqueCompanies, uniqueCategories);
            setCompanies(uniqueCompanies);
            setCategories(uniqueCategories);
          }
        } catch (error) {
          console.log("Cant fetch products!!!", error);
        }
      };

      fetchRecentProducts();
    }
  }, [decodedToken]);

  const fetchFilteredProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4001/api/customers/filtered-products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            companies: selectedCompanies.join(","),
            categories: selectedCategories.join(","),
            priceRanges: selectedPriceRanges.join(","),
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        const filtered = response.data;
        setRecentProducts(filtered.reverse());
      }
    } catch (error) {
      console.log("Error fetching filtered products!!!", error);
    }
  };

  return (
    <div class="bg-indigo-100 relative pb-6 sm:pb-8 lg:pb-12">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <CustomerNav />
        <h2 className="my-8 text-5xl text-gray-800 font-bold">
          Welcome back, <span className="text-blue-950">{userName}</span>
        </h2>
        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <header className="text-center">
              <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                All Flex-tronics Products
              </h2>
            </header>

            {/* Filter options */}
            <div className="flex items-center justify-center gap-5 mb-4 mt-2">
              {/* Companies dropdown */}
              <select
                onChange={(e) =>
                  setSelectedCompanies(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                className="p-2 border border-gray-300 rounded-md"
              >
                {companies &&
                  companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
              </select>

              {/* Categories dropdown */}
              <select
                onChange={(e) =>
                  setSelectedCategories(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                className="p-2 border border-gray-300 rounded-md"
              >
                {categories &&
                  categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>

              {/* Price range dropdown */}
              <select
                onChange={(e) =>
                  setSelectedPriceRanges(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="5000-10000">5000-10000</option>
                <option value="10000-15000">10000-15000</option>
                <option value="15000-20000">15000-20000</option>
                <option value="20000-30000">20000-30000</option>
                {/* Add more options as needed */}
              </select>

              {/* Search button */}
              <button
                onClick={fetchFilteredProducts}
                className="p-2 bg-blue-500 text-white rounded-md"
              >
                Search
              </button>
            </div>

            {recentProducts ? (
              <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 items-center">
                {recentProducts?.map((recentProduct) => (
                  <li>
                    <Link
                      to={`/customer/products/${recentProduct?._id}`}
                      className="group block overflow-hidden rounded-md"
                    >
                      <img
                        src={recentProduct.profilePic}
                        alt={recentProduct?.name}
                        className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                      />

                      <div className="relative bg-gray-400 pt-3">
                        <h3 className="text-xs ml-2 text-gray-700 group-hover:underline group-hover:underline-offset-4">
                          {recentProduct.name}
                        </h3>

                        <p className="mt-2 ml-2 flex flex-col">
                          <span className="sr-only"> Regular Price </span>

                          <span className="tracking-wider text-gray-900">
                            {" "}
                            ₹ {recentProduct.price}{" "}
                          </span>
                          <span className="tracking-wider font-semibold text-gray-900">
                            {" "}
                            Mgf. By: {recentProduct.company}{" "}
                          </span>
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <h2 className="text-4xl text-center text-blue-950">
                😔 Sorry!! No products avaiable.
              </h2>
            )}
          </div>
        </section>
        <CustomerFooter />
      </div>
    </div>
  );
};

export default CustomerDashboard;
