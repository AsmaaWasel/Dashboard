"use client";
import React, { useState } from "react";
import ReactFlagsSelect from "react-flags-select";

const CountryValidation = () => {
  const [selected, setSelected] = useState("");
  return (
    <div>
      <ReactFlagsSelect
        selected={selected}
        onSelect={(code) => setSelected(code)}
        placeholder="Select Country"
        searchable
        searchPlaceholder="Search countries"
        className="menu-flags"
      />
    </div>
  );
};

export default CountryValidation;
