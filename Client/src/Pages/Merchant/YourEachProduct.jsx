import React, { useEffect, useState } from "react";
import MerchantNav from "../../Components/MerchantComponents/MerchantNav";
import MerchantFooter from "../../Components/MerchantComponents/MerchantFooter";
import { useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";

const YourEachProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [eachProduct, setEachProduct] = useState(null);
  const [popupEdit, setPopupEdit] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [profilePicErr, setProfilePicErr] = useState(null);
  const [error, setError] = useState(null);

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

      const fetchEachProduct = async () => {
        try {
          const response = await axios.get(
            `https://merchant-customer.vercel.app/api/merchants/products/${id}`,
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

  const handlePopupEdit = () => {
    setPopupEdit(!popupEdit);
  };

  const handleUploadImage = async (e) => {
    try {
      setProfilePicErr(null);
      setProfilePic(null);
      e.preventDefault();

      const token = localStorage.getItem("token");
      if (!token) {
        // No token found, redirect to login page
        navigate("/merchant/login");
      }

      const formData = new FormData();
      formData.append("productPic", profilePic);
      const response = await axios.post(
        "https://merchant-customer.vercel.app/api/merchants/upload-product-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setProfilePicUrl(response.data);
        setProfilePicErr("Product Pic Uploaded Successfully!!!");
      }
    } catch (error) {
      console.log(error);
      setProfilePicErr("Error in uploding!!!");
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // No token found, redirect to login page
        navigate("/merchant/login");
      }
      const response = await axios.put(
        `https://merchant-customer.vercel.app/api/merchants/products/edit/${eachProduct?._id}`,
        {
          name,
          category,
          desc: description,
          quantity,
          price,
          profilePic: profilePicUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Edit product Successfully!!!");
        setError("Edit Product Sucessfully!!!");
        setName("");
        setCategory("");
        setDescription("");
        setQuantity("");
        setPrice("");
        setProfilePic(null);
        setProfilePicUrl("");
      } else {
        setError("Something went wrong!!");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Something went wrong!!");
      // Handle error
    }
  };

  return (
    <div class="bg-indigo-100 relative pb-6 sm:pb-8 lg:pb-12">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <MerchantNav />
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
            <div className="flex justify-left">
              <button
                onClick={handlePopupEdit}
                className="text-center px-6 py-3 mt-4 bg-blue-900 hover:bg-blue-950 text-gray-200 rounded-md"
              >
                Edit Product Details
              </button>
            </div>
            {popupEdit && (
              <form onSubmit={handleEditProduct} className="flow-root rounded-lg border bg-purple-300 border-gray-800 py-3 shadow-sm mt-5">
                <dl className="-my-3 divide-y divide-gray-800 text-sm">
                  <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">
                      Edit Product Name
                    </dt>
                    {/* <dd className="text-gray-700 sm:col-span-2">
                      {eachProduct?.name}
                    </dd> */}
                    <input
                      name="product-name"
                      type="text"
                      id="product-name"
                      placeholder={eachProduct?.name}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-gray-700 sm:col-span-2 rounded-md px-2 py-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Edit Category</dt>
                    <input
                      name="product-name"
                      type="text"
                      id="product-name"
                      placeholder={eachProduct?.category}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="text-gray-700 sm:col-span-2 rounded-md px-2 py-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Edit Quantity</dt>
                    <input
                      name="product-name"
                      type="text"
                      id="product-name"
                      placeholder={eachProduct?.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="text-gray-700 sm:col-span-2 rounded-md px-2 py-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Edit Price</dt>
                    <input
                      name="product-name"
                      type="number"
                      id="product-name"
                      placeholder={eachProduct?.price}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="text-gray-700 sm:col-span-2 rounded-md px-2 py-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">
                      Edit Product Description
                    </dt>
                    <textarea
                      name="description"
                      type="text"
                      id="description"
                      placeholder={eachProduct?.desc}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="text-gray-700 sm:col-span-2 rounded-md px-2 py-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">
                      Edit Product Image
                    </dt>
                    <div className="lg:flex items-center gap-2 xs:flex-col">
                      <input
                        type="file"
                        name="profilePic"
                        onChange={(e) => setProfilePic(e.target.files[0])}
                        class="text-gray-700 px-3 py-2 bg-gray-100 sm:col-span-2 rounded-md px-2 py-1 w-auto"
                      />
                      <button
                        onClick={handleUploadImage}
                        className="px-2 py-1 rounded-md bg-green-500 hover:bg-green-750 text-gray-200"
                      >
                        Upload
                      </button>
                    </div>
                    {profilePicErr && (
                      <p className="text-center text-md text-gray-700">
                        {profilePicErr}
                      </p>
                    )}
                  </div>
                </dl>
                <div className="flex justify-center mt-3">
                  <button className="px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-gray-300">
                    Edit Details
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
        <MerchantFooter />
      </div>
    </div>
  );
};

export default YourEachProduct;
