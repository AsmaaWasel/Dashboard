"use client";
import AddServiceForm from "@/components/form/Form";
import { useParams } from "next/navigation";
import React from "react";

const CategoryPage = () => {
  const { id: categoryId } = useParams();
  console.log("Parent Category ID:", categoryId);
  return (
    <div>
      <h1>Category Details</h1>
      <h1>Category: {categoryId}</h1>

      {/* Other category details */}
      <AddServiceForm categoryId={categoryId} />
    </div>
  );
};

export default CategoryPage;
