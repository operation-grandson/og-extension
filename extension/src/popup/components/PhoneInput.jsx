import React from 'react';

const PhoneInput = ({ value, onChange, label, placeholder }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="phone-container">
      <div className="phone-label">{label}</div>
      <input
        type="tel"
        className="phone-input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default PhoneInput;