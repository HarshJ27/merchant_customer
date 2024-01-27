import React, { useState } from "react";
import Navbar from "../../Components/Navbar"
import Footer from "../../Components/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"

const CustomerSignup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [profilePicErr, setProfilePicErr] = useState(null);
    const [error, setError] = useState(null);
  
    const handleUploadImage = async (e) => {
      try {
        setProfilePicErr(null);
        e.preventDefault();
  
        const formData = new FormData();
        formData.append("customerPic", profilePic);
        const response = await axios.post(
          "https://merchant-customer.vercel.app/api/customers/upload-profile-pic",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        if (response.status === 200) {
          console.log(response.data);
          setProfilePicUrl(response.data);
          setProfilePicErr("Profile Pic Uploaded Successfully!!!")
        }
      } catch (error) {
        console.log(error);
        setProfilePicErr("Error in uploding!!!")
      }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);
    
        try { 
          const response = await axios.post(
            "https://merchant-customer.vercel.app/api/customers/signup",
            {
              name,
              email,
              password,
              profilePic: profilePicUrl,
            }
          );
    
          if (response.status === 201) {
            console.log("User Registered Successfully!!!");
            navigate("/customer/login");
          } else if (response.data === 409) {
            console.log("Signup failed");
            setError("Customer exists already!!!");
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
    <div class="bg-indigo-100 relative pb-6 sm:pb-8 lg:pb-12">
    <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
      <Navbar />
      <section class="min-h-96 relative flex flex-1 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 py-16 shadow-lg md:py-20 xl:py-30">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          loading="lazy"
          alt="Photo by Fakurian Design"
          class="absolute blur-sm inset-0 h-full w-full object-cover object-center"
        />

        <div class="absolute inset-0 bg-blue-900 mix-blend-multiply"></div>

        <div className="relative max-w-1/3">
          <div class="rounded-md py-6 sm:py-8 lg:py-12">
            <div class="mx-auto px-4 md:px-8">
              <h2 class="mb-4 text-center text-2xl font-bold text-gray-300 md:mb-8 lg:text-3xl">
                Get Started As Customer
              </h2>

              <form
                onSubmit={handleSignup}
                class="mx-auto max-w-lg rounded-lg border-2"
              >
                <div class="flex flex-col gap-4 p-4 md:p-8">
                  <div>
                    <label
                      htmlFor="name"
                      class="mb-2 inline-block text-sm text-gray-300 font-bold sm:text-base"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Alex Hales"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 font-bold outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      class="mb-2 inline-block text-sm text-gray-300 font-bold sm:text-base"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 font-bold outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      class="mb-2 inline-block text-sm text-gray-300 font-bold sm:text-base"
                    >
                      Create Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="xxxxxxx"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 font-bold outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profilePic"
                      class="mb-2 inline-block text-sm text-gray-300 font-bold sm:text-base"
                    >
                      Upload Your Profile Image (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                    <input
                      type="file"
                      name="profilePic"
                      onChange={(e) => setProfilePic(e.target.files[0])}
                      class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                    />
                    <button onClick={handleUploadImage} className="px-3 py-2 rounded-md bg-green-500 hover:bg-green-750 text-gray-200">Upload</button>
                    </div>
                  </div>

                  {profilePicErr && (<p className="text-center text-md text-gray-200">{profilePicErr}</p>)}
                  {error && (<p className="text-center text-md text-red-500">{error}</p>)}
                  <button class="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">
                    Sign up
                  </button>
                </div>

                <div class="flex rounded-md items-center justify-center bg-gray-400 p-4">
                  <p class="text-center text-sm text-gray-100">
                    Already have an account?{" "}
                    <Link
                      to={'/customer/login'}
                      class="text-indigo-600 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  </div>
  )
}

export default CustomerSignup