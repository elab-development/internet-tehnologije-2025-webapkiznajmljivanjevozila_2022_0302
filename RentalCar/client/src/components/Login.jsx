import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const Login = () => {

  const {setShowLogin, axios, setToken} = useAppContext()

  const [mode, setMode] = useState("login"); // "login" | "signup"

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // ovde kasnije ide login/signup logika
    console.log("Submit:", mode);
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/50 text-sm text-gray-600"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white text-gray-500 mx-4 text-left text-sm shadow-[0px_0px_10px_0px] shadow-black/10
          ${mode === "login"
            ? "max-w-[350px] w-full md:p-6 p-4 rounded-xl"
            : "max-w-[340px] w-full md:p-6 p-4 py-8 rounded-lg"
          }`}
      >
        {mode === "login" ? (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Login Now
            </h2>

            <input
              id="email"
              className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
              type="email"
              placeholder="Enter your email"
              required
            />

            <input
              id="password"
              className="w-full border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
              type="password"
              placeholder="Enter your password"
              required
            />

            <div className="text-right py-4">
              <a
                className="text-blue-600 underline"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Forgot Password
              </a>
            </div>

            <button
              type="submit"
              className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded-full text-white"
            >
              Log in
            </button>

            <p className="text-center mt-4">
              Don’t have an account?{" "}
              <a
                href="#"
                className="text-blue-500 underline"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("signup");
                }}
              >
                Signup Now
              </a>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Sign Up
            </h2>

            <input
              className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3"
              type="text"
              placeholder="Username"
              required
            />

            <input
              className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3"
              type="email"
              placeholder="Email"
              required
            />

            <input
              className="w-full border mt-1 bg-indigo-500/5 mb-7 border-gray-500/10 outline-none rounded py-2.5 px-3"
              type="password"
              placeholder="Password"
              required
            />

            <button
              type="submit"
              className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95 py-2.5 rounded text-white font-medium"
            >
              Create Account
            </button>

            <p className="text-center mt-4">
              Already have an account?{" "}
              <a
                href="#"
                className="text-blue-500 underline"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("login");
                }}
              >
                Log In
              </a>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
