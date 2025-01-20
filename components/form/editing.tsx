"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import CountryValidation from "../ui/country-validation";

interface FormData {
  id?: number;
  title: string;
  image: string;
  country: string;
  phone: string;
  description: string;
}

interface ServiceProviderFormProps {
  onSubmit: (formData: FormData) => void;
  initialData?: FormData | null;
}

export default function EditingForm({
  onSubmit,
  initialData,
}: ServiceProviderFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    image: "",
    country: "",
    phone: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Auto-format Title on Change
    if (name === "title") {
      const formattedValue = value
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    let isValid = true;

    if (!formData.title) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    if (!formData.image) {
      newErrors.image = "Image is required";
      isValid = false;
    }
    if (!formData.country) {
      newErrors.country = "Country is required";
      isValid = false;
    }
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
      isValid = false;
    }
    if (!formData.description) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      {/* title */}
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={errors.image ? "border-red-500" : ""}
        />
        {formData.image && (
          <Image
            src={formData.image}
            alt="Selected image"
            width={100}
            height={100}
            className="mt-2"
          />
        )}
        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
      </div>

      <CountryValidation />

      <div className="space-y-1">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
            errors.description ? "border-red-500" : ""
          }`}
          rows={4}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Service" : "Add Service"}
      </Button>
    </form>
  );
}
