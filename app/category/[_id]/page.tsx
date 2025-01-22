"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import AddServiceForm from "@/components/form/Form";
import ServiceTable from "@/components/ServiceTable";
import ErrorWithRetry from "@/components/ErrorWithRetry";
import { Button } from "@/components/ui/button";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

const CategoryPage = () => {
  const { _id: categoryId } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://192.168.50.142:3000/api/auth/category/${categoryId}/service`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(
        "An error occurred while fetching services. Please try again later."
      );
      console.error("Error fetching services:", err);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddService = () => {
    setShowAddForm(true);
  };

  const handleServiceAdded = () => {
    setShowAddForm(false);
    fetchServices();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Category Details</h1>
      <h2 className="text-xl mb-4">Category ID: {categoryId}</h2>

      {isLoading && <p className="text-gray-600">Loading services...</p>}
      {error && <ErrorWithRetry message={error} onRetry={fetchServices} />}
      {!isLoading && !error && (
        <>
          <h3 className="text-2xl font-semibold mb-4">Services</h3>
          {services.length > 0 ? (
            <ServiceTable services={services} />
          ) : (
            <p className="text-gray-600">
              No services found for this category.
            </p>
          )}
        </>
      )}

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Add New Service</h3>
        {showAddForm ? (
          <AddServiceForm
            initialCategoryId={categoryId}
            onSuccess={handleServiceAdded}
          />
        ) : (
          <Button onClick={handleAddService}>Add New Service</Button>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
