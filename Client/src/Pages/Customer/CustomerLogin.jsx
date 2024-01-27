import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../../Components/Navbar"
import Footer from "../../Components/Footer";

const CustomerLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        // Perform login logic here
        try {
          const response= await axios.post("https://merchant-customer.vercel.app/api/customers/login",
          {
            email,
            password
          });
    
          if (response.status === 200) {
            const token = response.data.token;
            // Store the token in local storage
            localStorage.setItem("token", token);
            console.log("Logged in successfully as Customer");
            // Redirect to dashboard page
            navigate('/customer/dashboard')
          } else {
            console.log("Login failed");
            setError("Login Details Are Wrong!!");
            // Handle login error
          }
        } catch (error) {
          console.error("Error logging in:", error);
          setError("Login Details Are Wrong!!");
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
                Login As Customer
              </h2>

              <form
                onSubmit={handleLogin}
                class="mx-auto max-w-lg rounded-lg border-2"
              >
                <div class="flex flex-col gap-4 p-4 md:p-8">

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
                      Password
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

                  {error && (<p className="text-center text-md text-red-500">{error}</p>)}
                  <button class="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">
                    Login
                  </button>
                </div>

                <div class="flex rounded-md items-center justify-center bg-gray-400 p-4">
                  <p class="text-center text-sm text-gray-100">
                    Don't have an account?{" "}
                    <Link
                      to={'/customer/signup'}
                      class="text-indigo-600 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                    >
                      Signup
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

export default CustomerLogin