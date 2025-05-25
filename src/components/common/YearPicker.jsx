import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * A component for selecting a specific year
 * 
 * @param {Object} props Component props
 * @param {string} props.value The current year value
 * @param {Function} props.onChange Callback function when year changes
 * @param {string} props.label Label for the form control
 * @param {boolean} props.required Whether the field is required
 * @param {number} props.startYear The first year to show in the dropdown (defaults to 1990)
 * @param {number} props.endYear The last year to show in the dropdown (defaults to current year + 5)
 */
const YearPicker = ({ 
  value = '', 
  onChange, 
  label = 'Year', 
  required = false,
  startYear = 1990,
  endYear = new Date().getFullYear() + 5
}) => {
  // Generate year options from startYear to endYear in descending order
  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }
  
  const handleYearChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}{required && <span className="text-danger">*</span>}</Form.Label>}
      <Form.Select 
        value={value}
        onChange={handleYearChange}
        required={required}
      >
        <option value="">Select Year</option>
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default YearPicker;
