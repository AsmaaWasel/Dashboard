"use client";

import React, { useState } from "react";

const AddServiceForm = ({ initialCategoryId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategoryId || ""); // State for categoryId
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://192.168.50.142:3000/api/auth/category/${categoryId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, description, country }),
        }
      );

      if (response.ok) {
        setMessage("Service added successfully");
        setName("");
        setDescription("");
        setCountry("");
      } else {
        // Parse the error message from the response
        const errorData = await response.json();
        setMessage(
          `Failed to add service: ${errorData.error || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Service</h2>
      <div>
        <label>Service Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Service Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Country:</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Service"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AddServiceForm;
