"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { notifySuccess, notifyError } from "../../../components/Toast";

const SigninPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result.error) {
      notifyError(result.error);
      setLoading(false);
    } else {
      notifySuccess("Login successful!");
      // Obtain the user session
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      // Redirect to the appropriate dashboard based on user role
      if (session.user.userType === "hod") {
        window.location.href = "/dashboard/hod";
      } else if (session.user.userType === "student") {
        window.location.href = "/dashboard/student";
      }
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <h1 className='text-3xl font-bold mb-8'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col items-center'>
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
          className='py-2 px-4 rounded border border-gray-300 mb-4'
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          className='py-2 px-4 rounded border border-gray-300 mb-4 text-black'
        />
        <button
          type='submit'
          className='bg-primary hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default SigninPage;
