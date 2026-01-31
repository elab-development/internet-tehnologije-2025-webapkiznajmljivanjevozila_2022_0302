import React from "react";

const CountryBadge = ({ country }) => {
  if (!country) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <img
        src={country.flag}
        alt={country.name}
        className="w-5 h-4 object-cover rounded-sm border"
      />
      <span>{country.name}</span>
    </div>
  );
};

export default CountryBadge;
