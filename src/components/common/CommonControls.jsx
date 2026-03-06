import React from "react";

export const SectionHeader = ({ title, description }) => (
  <div className="mb-6 text-left">
    <h2 className="text-lg font-semibold text-[#222]">{title}</h2>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

export const FormField = ({ label, defaultValue, type = "text", placeholder, readOnly, className = "" }) => (
  <div className="flex flex-col gap-1.5 w-full text-left">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      readOnly={readOnly}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={`border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all ${className}`}
    />
  </div>
);

export const SelectField = ({ label, options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);