"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import CountryValidation from "../ui/country-validation";

interface FormData {
  id?: number;
  provider: string;
  title: string;
  image: File | null;
  description: string;
  url: string;
  country: string;
  tags: string;
}

interface ServiceProviderFormProps {
  onSubmit: (formData: FormData) => void;
  initialData?: FormData | null;
}

export default function ServiceProviderForm({
  onSubmit,
  initialData,
}: ServiceProviderFormProps) {
  const [formData, setFormData] = useState<FormData>({
    provider: "",
    title: "",
    image: null,
    description: "",
    url: "",
    country: "",
    tags: "",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    let isValid = true;

    if (!formData.provider) {
      newErrors.provider = "اسم المزود مطلوب";
      isValid = false;
    }
    if (!formData.title) {
      newErrors.title = "العنوان مطلوب";
      isValid = false;
    }
    if (!formData.image) {
      newErrors.image = "الصورة مطلوبة";
      isValid = false;
    }
    if (!formData.description) {
      newErrors.description = "الوصف مطلوب";
      isValid = false;
    }
    if (!formData.url) {
      newErrors.url = "الرابط مطلوب";
      isValid = false;
    } else if (!/^https?:\/\/.+\..+/.test(formData.url)) {
      newErrors.url = "الرجاء إدخال رابط صالح";
      isValid = false;
    }
    if (!formData.country) {
      newErrors.country = "الدولة مطلوبة";
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
    <form
      onSubmit={handleSubmit}
      dir="rtl"
      className="space-y w-full max-w-lg mx-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-1">
          <Label htmlFor="provider">اسم المزود</Label>
          <Input
            id="provider"
            name="provider"
            value={formData.provider}
            onChange={handleInputChange}
            placeholder="أدخل اسم المزود"
            className={errors.provider ? "border-red-500" : ""}
          />
          {errors.provider && (
            <p className="text-red-500 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.provider}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="title">العنوان</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="أدخل العنوان"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-500 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.title}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">الوصف</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="أدخل الوصف"
          rows={4}
          className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.description}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "تحديث الخدمة" : "إضافة الخدمة"}
      </Button>
    </form>
  );
}
