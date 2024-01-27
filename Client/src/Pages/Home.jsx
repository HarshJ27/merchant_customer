import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div class="bg-indigo-100 pb-6 sm:pb-8 lg:pb-12">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
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
            <a
              href="#"
              class="text-lg font-semibold text-gray-800 transition duration-100 hover:text-blue-900 active:text-indigo-700"
            >
              Products
            </a>
            <a
              href="#"
              class="text-lg font-semibold text-gray-800 transition duration-100 hover:text-blue-900 active:text-indigo-700"
            >
              About
            </a>
            <Link
              to={'/contact'}
              class="text-lg font-semibold text-gray-800 transition duration-100 hover:text-blue-900 active:text-indigo-700"
            >
              Contact
            </Link>
          </nav>

          <a
            href="#"
            class="hidden rounded-lg bg-blue-900 px-8 py-3 text-center text-sm font-semibold text-gray-200 outline-none ring-blue-300 transition duration-100 hover:bg-blue-950 focus-visible:ring active:text-gray-700 md:text-base lg:inline-block"
          >
            Signin
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

        <section class="min-h-96 relative flex flex-1 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 py-16 shadow-lg md:py-20 xl:py-48">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            loading="lazy"
            alt="Photo by Fakurian Design"
            class="absolute blur-sm inset-0 h-full w-full object-cover object-center"
          />

          <div class="absolute inset-0 bg-blue-900 mix-blend-multiply"></div>

          <div class="relative flex flex-col items-center p-4 sm:max-w-xl">
            <p class="mb-4 text-center text-lg text-gray-100 sm:text-xl md:mb-8">
              Very proud to introduce
            </p>
            <h1 class="mb-6 text-center text-4xl font-semibold text-white sm:text-5xl md:mb-12 md:text-6xl">
              Bit sized store, Byte Sized Products
            </h1>

            <p class="text-center text-lg text-indigo-200 sm:text-xl md:mb-8">
              Get Started As
            </p>
            <div class="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
              <Link
                to={'/merchant/signup'}
                class="inline-block rounded-lg bg-indigo-600 hover:bg-indigo-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
              >
                Merchant
              </Link>

              <Link
                to={'/customer/signup'}
                class="inline-block rounded-lg bg-indigo-600 hover:bg-indigo-800 px-8 py-3 text-center text-sm font-semibold text-gray-200 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
              >
                Customer
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
