import React from 'react'
import { Link } from 'react-router-dom'

const MerchantNav = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/merchant/login";
    console.log("Logging out");
  };
  return (
    <header class="mb-4 flex items-center justify-between py-4 md:py-8">
          <a
            href="/"
            class="inline-flex items-center gap-2.5 text-2xl font-bold text-blue-950 md:text-3xl"
            aria-label="logo"
          >
            <svg
              width="95"
              height="94"
              viewBox="0 0 95 94"
              class="h-auto w-6 text-blue-950"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M96 0V47L48 94H0V47L48 0H96Z" />
            </svg>
            Flex-Tronics
          </a>

          <nav class="hidden gap-12 lg:flex">
            <a href="#" class="text-lg font-semibold text-gray-800 transition duration-100 hover:text-blue-900 active:text-indigo-700">
              Home
            </a>
            <Link
              to={'/merchant/my-products'}
              class="text-lg font-semibold text-gray-800 transition duration-100 hover:text-blue-900 active:text-indigo-700"
            >
              Your Products
            </Link>
            <a
              href="#"
              class="text-lg font-semibold text-gray-800 transition duration-100 hover:text-blue-900 active:text-indigo-700"
            >
              All Products
            </a>
            <Link
              to={'/contact'}
              class="text-lg font-semibold text-gray-800 transition duration-100 hover:text-blue-900 active:text-indigo-700"
            >
              Contact
            </Link>
          </nav>

          <a
            onClick={handleLogout}
            class="hidden cursor-pointer rounded-lg bg-blue-900 px-8 py-3 text-center text-sm font-semibold text-gray-200 outline-none ring-blue-300 transition duration-100 hover:bg-blue-950 focus-visible:ring active:text-gray-700 md:text-base lg:inline-block"
          >
            Logout
          </a>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-2.5 py-2 text-sm font-semibold text-gray-500 ring-indigo-300 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            Menu
          </button>
        </header>
  )
}

export default MerchantNav