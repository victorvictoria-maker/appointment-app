"use client";
import { useState } from "react";
import axios from "axios";
import { notifySuccess, notifyError } from "../../../components/Toast";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    userType: "student", // default to student
    matricNumber: "",
    department: "",
    faculty: "",
  });
  const [loading, setLoading] = useState(false); // State to track loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on form submission
    try {
      await axios.post("/api/auth/signup", formData);
      notifySuccess("Account created successfully!");
      // Redirect to sign in page
      window.location.href = "/auth/signin";
    } catch (error) {
      notifyError("Error creating account. Please try again.");
    }
    setLoading(false); // Reset loading state after form submission
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <h1 className='text-3xl font-bold mb-8'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col items-center'>
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={formData.name}
          onChange={handleChange}
          className='py-2 px-4 rounded border border-gray-300 mb-4 text-black'
        />
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
          className='py-2 px-4 rounded border border-gray-300 mb-4 text-black'
        />
        <input
          type='text'
          name='phoneNumber'
          placeholder='Phone Number'
          value={formData.phoneNumber}
          onChange={handleChange}
          className='py-2 px-4 rounded border border-gray-300 mb-4 text-black'
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          className='py-2 px-4 rounded border border-gray-300 mb-4 text-black'
        />
        <select
          name='userType'
          value={formData.userType}
          onChange={handleChange}
          className='py-2 px-4 rounded border border-gray-300 mb-4 text-black'
        >
          <option value='student'>Student</option>
          <option value='hod'>HOD</option>
        </select>
        {formData.userType === "student" && (
          <>
            <input
              type='text'
              name='matricNumber'
              placeholder='Matric Number'
              value={formData.matricNumber}
              onChange={handleChange}
              className='py-2 px-4 rounded border text-black border-gray-300 mb-4'
            />
            <input
              type='text'
              name='department'
              placeholder='Department'
              value={formData.department}
              onChange={handleChange}
              className='py-2 px-4 rounded border text-black border-gray-300 mb-4'
            />
            <input
              type='text'
              name='faculty'
              placeholder='Faculty'
              value={formData.faculty}
              onChange={handleChange}
              className='py-2 px-4 rounded border text-black border-gray-300 mb-4'
            />
          </>
        )}
        {formData.userType === "hod" && (
          <input
            type='text'
            name='department'
            placeholder='Department'
            value={formData.department}
            onChange={handleChange}
            className='py-2 px-4 rounded border border-gray-300 mb-4'
          />
        )}
        <button
          type='submit'
          className='bg-primary hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'
          disabled={loading} // Disable button when loading is true
        >
          {loading ? "Signing Up..." : "Sign Up"}{" "}
          {/* Show loading text when loading is true */}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
