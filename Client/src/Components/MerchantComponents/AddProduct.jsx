import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [profilePicErr, setProfilePicErr] = useState(null);
  const [error, setError] = useState(null);

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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // No token found, redirect to login page
        navigate("/merchant/login");
      }
      const response = await axios.post(
        "https://merchant-customer.vercel.app/api/merchants/add-product",
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
        console.log("User Registered Successfully!!!");
        setError("Product Added Sucessfully!!!");
        setName("");
        setCategory("");
        setDescription("");
        setQuantity("");
        setPrice("");
        setProfilePic(null);
        setProfilePicUrl("");
      } else if (response.data === 409) {
        console.log("Signup failed");
        setError("Merchant exists already!!!");
        // Handle signup error
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
    <div class="py-6 sm:py-8 lg:py-12">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div class="mb-10 md:mb-16">
          <h2 class="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            Add New Product
          </h2>
        </div>

        <form
          onSubmit={handleAddProduct}
          class="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2"
        >
          <div>
            <label
              htmlFor="product-name"
              class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              Product Name*
            </label>
            <input
              name="product-name"
              type="text"
              id="product-name"
              placeholder="Samsung Galaxy S24 (Galaxy AI)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              Category*
            </label>
            <input
              name="category"
              type="text"
              id="category"
              placeholder="Mobile Phone, Tablet, etc."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
            />
          </div>

          <div class="sm:col-span-2">
            <label
              htmlFor="description"
              class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              Description Of The Product*
            </label>
            <textarea
              name="description"
              placeholder="Tell about the product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              class="h-64 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
            ></textarea>
          </div>

          <div class="sm:col-span-2">
            <label
              htmlFor="quantity"
              class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              Quantity*
            </label>
            <input
              name="quantity"
              placeholder="No. of units you have"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
            />
          </div>

          <div class="sm:col-span-2">
            <label
              htmlFor="price"
              class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              Price(in Rupees)*
            </label>
            <input
              name="price"
              placeholder="15000/-"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
            />
          </div>

          <div class="sm:col-span-2">
            <label
              htmlFor="profilePic"
              class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              Product Image*
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                name="profilePic"
                onChange={(e) => setProfilePic(e.target.files[0])}
                class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              />
              <button
                onClick={handleUploadImage}
                className="px-3 py-2 rounded-md bg-green-500 hover:bg-green-750 text-gray-200"
              >
                Upload
              </button>
            </div>
            {error && <p className="text-center text-md text-gray-500">{error}</p>}
          </div>

          <div class="flex items-center justify-between sm:col-span-2">
            <button class="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">
              Add Product
            </button>

            <span class="text-sm text-gray-500">*Required</span>
          </div>

          {/* <p class="text-xs text-gray-400">
            By signing up to our newsletter you agree to our{" "}
            <a
              href="#"
              class="underline transition duration-100 hover:text-indigo-500 active:text-indigo-600"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            >
              Privacy Policy
            </a>
            .                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
          </p> */}
          {profilePicErr && (
            <p className="text-center text-md text-gray-200">{profilePicErr}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
