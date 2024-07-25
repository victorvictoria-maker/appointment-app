/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { notifySuccess, notifyError } from "../../../components/Toast";

const HodDashboard = () => {
  const { data: session } = useSession();
  const [hodData, setHodData] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    department: "",
  });
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    if (session) {
      fetchHodData();
    }
  }, [session]);

  const fetchHodData = async () => {
    try {
      const res = await axios.get(`/api/hod/${session.user.id}`);
      if (res.data.success) {
        setHodData(res.data.data);
        setProfileForm({
          name: res.data.data.name,
          department: res.data.data.department,
        });
        setAvailableTimes(res.data.data.availableTimes);
      } else {
        notifyError("Failed to fetch HOD data");
      }
    } catch (error) {
      console.error("Error fetching HOD data:", error);
      notifyError("Error fetching HOD data");
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/hod/profile", {
        id: session.user.id,
        ...profileForm,
      });
      notifySuccess("Profile updated successfully");
      fetchHodData();
    } catch (error) {
      console.error("Error updating profile:", error);
      notifyError("Error updating profile");
    }
  };

  const handleTimesChange = (index, field, value) => {
    const newTimes = [...availableTimes];
    newTimes[index][field] = value;
    setAvailableTimes(newTimes);
  };

  const handleTimesSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/api/hod/available-times", {
        id: session.user.id,
        availableTimes,
      });
      if (res.data.success) {
        notifySuccess("Available times updated successfully");
        fetchHodData();
      } else {
        notifyError("Failed to update available times");
      }
    } catch (error) {
      console.error("Error updating available times:", error);
      notifyError("Error updating available times");
    }
  };

  const addNewTimeSlot = () => {
    setAvailableTimes([
      ...availableTimes,
      { day: "", startTime: "", endTime: "" },
    ]);
  };

  const removeTimeSlot = (index) => {
    const newTimes = availableTimes.filter((_, i) => i !== index);
    setAvailableTimes(newTimes);
  };

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className='min-h-screen flex flex-col items-center'>
      <h1 className='text-3xl font-bold mb-8'>HOD Dashboard</h1>

      <div className='w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4'>Profile</h2>
        <form onSubmit={handleProfileSubmit} className='flex flex-col mb-8'>
          <input
            type='text'
            name='name'
            placeholder='Name'
            value={profileForm.name}
            onChange={handleProfileChange}
            className='py-2 px-4 rounded border border-gray-300 mb-4'
          />
          <input
            type='text'
            name='department'
            placeholder='Department'
            value={profileForm.department}
            onChange={handleProfileChange}
            className='py-2 px-4 rounded border border-gray-300 mb-4'
          />
          <button
            type='submit'
            className='bg-primary hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'
          >
            Update Profile
          </button>
        </form>

        <h2 className='text-2xl font-bold mb-4'>Available Times</h2>
        <form onSubmit={handleTimesSubmit} className='flex flex-col mb-8'>
          {availableTimes.map((time, index) => (
            <div key={index} className='mb-4'>
              <input
                type='text'
                placeholder='Day'
                value={time.day}
                onChange={(e) =>
                  handleTimesChange(index, "day", e.target.value)
                }
                className='py-2 px-4 rounded border border-gray-300 mb-2 text-black'
              />
              <input
                type='time'
                placeholder='Start Time'
                value={time.startTime}
                onChange={(e) =>
                  handleTimesChange(index, "startTime", e.target.value)
                }
                className='py-2 px-4 rounded border border-gray-300 mb-2 text-black'
              />
              <input
                type='time'
                placeholder='End Time'
                value={time.endTime}
                onChange={(e) =>
                  handleTimesChange(index, "endTime", e.target.value)
                }
                className='py-2 px-4 rounded border border-gray-300 mb-2 text-black'
              />
              <button
                type='button'
                onClick={() => removeTimeSlot(index)}
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded '
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type='button'
            onClick={addNewTimeSlot}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4'
          >
            Add Time Slot
          </button>
          <button
            type='submit'
            className='bg-primary hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'
          >
            Update Available Times
          </button>
        </form>
      </div>
    </div>
  );
};

export default HodDashboard;
