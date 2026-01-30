import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();

  const [state, setState] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const endpoint = state === "login" ? "/api/user/login" : "/api/user/register";

      const payload =
        state === "login"
          ? { email, password }
          : { name, email, password };

      const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        navigate("/");
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 text-sm text-gray-600"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-gray-500 mx-4 text-left text-sm shadow-[0px_0px_10px_0px] shadow-black/10 max-w-[360px] w-full md:p-6 p-4 rounded-xl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {state === "login" ? "Login Now" : "Sign Up"}
        </h2>

        {state === "register" && (
          <input
            className="w-full border my-2 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          className="w-full border my-2 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border my-2 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full mt-4 mb-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded-full text-white"
        >
          {state === "login" ? "Log in" : "Create Account"}
        </button>

        <p className="text-center mt-4">
          {state === "login" ? (
            <>
              Don’t have an account?{" "}
              <a
                href="#"
                className="text-blue-500 underline"
                onClick={(e) => {
                  e.preventDefault();
                  setState("register");
                }}
              >
                Signup Now
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a
                href="#"
                className="text-blue-500 underline"
                onClick={(e) => {
                  e.preventDefault();
                  setState("login");
                }}
              >
                Log In
              </a>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
