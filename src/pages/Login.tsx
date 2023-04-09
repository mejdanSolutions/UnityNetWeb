import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authActions } from "../redux/authSlice";
import { useAppDispatch } from "../redux/hooks";
import socket, { onLoginSuccess } from "../services/socket";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("All fields must be filled");
      return;
    }

    const formData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        `http://localhost:7000/api/auth/login`,
        formData
      );
      dispatch(authActions.setLogin(true));

      onLoginSuccess(response.data);

      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center h-[100vh]">
      <div className="md:mb-5">
        <h1 className="text-center text-4xl text-blue-500 font-bold md:text-5xl lg:text-[3.5rem]">
          UnityNet
        </h1>

        <p className="my-3 text-center text-gray-700 text-[1rem] md:text-[1.2rem]">
          Connect with friends and the world <br /> around you on Social Media.
        </p>
      </div>

      <form
        onSubmit={login}
        className="flex flex-col space-y-3 p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:space-y-5 md:py-10"
      >
        <input
          type="text"
          placeholder="Enter your email"
          className="p-2 border-2 rounded-md focus:outline-blue-600 md:w-[25rem]"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="password"
          className="p-2 border-2 rounded-md focus:outline-blue-600 md:w-[25rem]"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md font-bold hover:bg-blue-600"
        >
          Log in
        </button>

        {message && <span className="text-center text-red-500">{message}</span>}

        <Link
          className="mx-auto text-[0.9rem] text-blue-600 hover:underline"
          to="/forgotpass"
        >
          Forgot Password ?
        </Link>

        <Link to="/register" className="mx-auto">
          <button className="bg-green-600 p-2 rounded-md text-white font-bold hover:bg-green-700">
            Create new account
          </button>
        </Link>
      </form>
    </section>
  );
};

export default Login;
