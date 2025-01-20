"use client";
import React, { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const PhoneValidation = () => {
  const [selected, setSelected] = useState<string>("");

  const handlePhoneChange = (value: string | undefined) => {
    setSelected(value || ""); // Set to an empty string if value is undefined
  };

  return (
    <div>
      <PhoneInput
        placeholder="Enter phone number"
        value={selected}
        onChange={handlePhoneChange}
      />
    </div>
  );
};

export default PhoneValidation;
