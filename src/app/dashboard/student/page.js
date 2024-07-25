/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { notifySuccess, notifyError } from "../../../components/Toast";

const StudentDashboard = () => {
  const { data: session } = useSession();
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchAvailableTimes();
      fetchAppointments();
    }
  }, [session]);

  const fetchAvailableTimes = async () => {
    try {
      const res = await axios.get("/api/hod/available-times");
      if (res.data.success && Array.isArray(res.data.data)) {
        setAvailableTimes(res.data.data);
        console.log("Available Times:", res.data.data);
      } else {
        throw new Error("Invalid response or data structure");
      }
    } catch (error) {
      notifyError("Error fetching available times");
      console.error("Error fetching available times:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      if (session?.user?.id) {
        const res = await axios.get(
          `/api/user/${session.user.id}/appointments`
        );
        if (res.data.success) {
          setAppointments(res.data.data);
        } else {
          throw new Error("Failed to fetch appointments");
        }
      } else {
        notifyError("User session ID not found");
      }
    } catch (error) {
      notifyError("Error fetching appointments");
      console.error("Error fetching appointments:", error);
    }
  };

  const getDateOfNextDay = (dayName) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = daysOfWeek.indexOf(dayName);
    if (dayIndex === -1) return null;

    const today = new Date();
    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() + ((dayIndex + 7 - today.getDay()) % 7));
    return resultDate;
  };

  const handleBooking = async () => {
    if (!selectedTime) {
      notifyError("Please select a time slot");
      return;
    }

    try {
      setLoading(true);

      const [day, timeRange] = selectedTime.split(" - ");
      const [startTime] = timeRange.split(" to ");

      const nextDayDate = getDateOfNextDay(day);
      if (!nextDayDate) {
        notifyError("Invalid day selected");
        setLoading(false);
        return;
      }

      const [hours, minutes] = startTime.split(":");
      nextDayDate.setHours(parseInt(hours, 10));
      nextDayDate.setMinutes(parseInt(minutes, 10));
      nextDayDate.setSeconds(0);
      nextDayDate.setMilliseconds(0);

      const time = nextDayDate;

      if (!session || !session.user || !session.user.id) {
        notifyError("User session not found");
        return;
      }

      const response = await axios.post(
        `/api/user/${session.user.id}/appointments`,
        {
          studentId: session.user.id,
          time: time.toISOString(),
          hodId: "6671c022dc8995b37f9704ce", // Replace with dynamic hodId
        }
      );

      if (response.data.success) {
        notifySuccess("Appointment booked successfully");
        fetchAppointments(); // Refresh appointments after booking
      } else {
        throw new Error(response.data.error || "Unknown error");
      }
    } catch (error) {
      notifyError("Error booking appointment");
      console.error("Error booking appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <p>Please sign in to access this page.</p>;
  }

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className='min-h-screen flex flex-col items-center'>
      <h1 className='text-3xl font-bold mb-8'>Student Dashboard</h1>
      <div className='w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4'>Book Appointment</h2>
        <div className='flex flex-col mb-8 text-black'>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className='py-2 px-4 rounded border border-gray-300 mb-4'
          >
            <option value=''>Select a time slot</option>
            {availableTimes.map((time, index) => (
              <option
                key={index}
                value={`${time.day} - ${time.startTime} to ${time.endTime}`}
              >
                {time.day} - {time.startTime} to {time.endTime}
              </option>
            ))}
          </select>
          <button
            onClick={handleBooking}
            className={`bg-primary hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </div>
        <h2 className='text-2xl font-bold mb-4'>My Appointments</h2>
        <ul className='list-disc list-inside'>
          {appointments.map((appointment, index) => (
            <li key={index}>
              {new Date(appointment.date).toLocaleString()} -{" "}
              {appointment.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
