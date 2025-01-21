"use client";
import AddServiceForm from "@/components/form/Form";

import { useParams } from "next/navigation";
import React from "react";

// i use useparams to get category id from the url

const CategoryPage = () => {
  const { _id: categoryId } = useParams(); // Grabbing categoryId from URL params
  console.log("Parent Category ID:", categoryId); // This logs the categoryId to verify
  return (
    <div>
      <h1>Category Details</h1>
      <h1>Category: {categoryId}</h1>

      {/* Other category details */}
      {/* Pass categoryId to AddServiceForm */}
      <AddServiceForm initialCategoryId={categoryId} />
    </div>
  );
};

export default CategoryPage;
