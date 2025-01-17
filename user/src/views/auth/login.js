import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as actions from "../../store/actions";
import Swal from "sweetalert2";

const LoginForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const { isLoggedIn, msg, update } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    // Show error message if there's any
    if (msg) {
      Swal.fire("Oops!", msg, "error");
    }
  }, [msg]);

  // Show success alert
  useEffect(() => {
    if (isLoggedIn) {
      Swal.fire("Success!", "You have successfully logged in!", "success");
    }
  }, [isLoggedIn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      const payload = {
        identifier: formData.email,
        password: formData.password,
      };
      dispatch(actions.login(payload)); // Chỉ gọi hành động login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 relative">
      

      <div className="bg-white p-10 rounded-lg shadow-xl max-w-sm w-full z-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sign In
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign In
          </button>

          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/sign-up"
                className="text-indigo-600 hover:text-indigo-700"
              >
                Sign up
              </a>
            </span>
          </div>

          {/* Adding a moving text effect */}
          <div className="text-center mt-6 text-lg text-indigo-600 font-semibold animate-bounce">
            <p>Join the best social network!</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
