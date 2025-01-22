"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const AddServiceForm = ({ initialCategoryId }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    country: "",
    provider: "",
    languages: {
      voiceLanguage: [],
      signLanguage: [],
    },
  });
  const [categoryId, setCategoryId] = useState(initialCategoryId || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const voiceLanguages = ["En", "Ar", "Fr"]; // Add more as needed
  const signLanguages = ["عربي موحد", "مصريه", "خليجية"]; // Add more as needed

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLanguageChange = (type, lang) => {
    setFormData((prevData) => ({
      ...prevData,
      languages: {
        ...prevData.languages,
        [type]: prevData.languages[type].includes(lang)
          ? prevData.languages[type].filter((l) => l !== lang)
          : [...prevData.languages[type], lang],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://192.168.50.142:3000/api/auth/category/${categoryId}/service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setMessage("Service added successfully");
        setFormData({
          name: "",
          description: "",
          country: "",
          provider: "",
          languages: {
            voiceLanguage: [],
            signLanguage: [],
          },
        });
      } else {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Add Service</h2>

      <div>
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Service Description</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded-md"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="provider">Provider</Label>
        <Input
          id="provider"
          name="provider"
          value={formData.provider}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label>Voice Languages</Label>
        <div className="flex flex-wrap gap-2">
          {voiceLanguages.map((lang) => (
            <div key={lang} className="flex items-center space-x-2">
              <Checkbox
                id={`voice-${lang}`}
                checked={formData.languages.voiceLanguage.includes(lang)}
                onCheckedChange={() =>
                  handleLanguageChange("voiceLanguage", lang)
                }
              />
              <label htmlFor={`voice-${lang}`}>{lang}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Sign Languages</Label>
        <div className="flex flex-wrap gap-2">
          {signLanguages.map((lang) => (
            <div key={lang} className="flex items-center space-x-2">
              <Checkbox
                id={`sign-${lang}`}
                checked={formData.languages.signLanguage.includes(lang)}
                onCheckedChange={() =>
                  handleLanguageChange("signLanguage", lang)
                }
              />
              <label htmlFor={`sign-${lang}`}>{lang}</label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Service"}
      </Button>

      {message && (
        <p className="mt-4 text-sm font-medium text-green-600">{message}</p>
      )}
    </form>
  );
};

export default AddServiceForm;
