import { Form } from "react-bootstrap";
import { useState, useId } from "react";
import YearPicker from "./YearPicker";

export default function PeriodPicker({ value, onChange }) {
  const uniqueId = useId();
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const splitValue = value ? value.split("-") : [""];

  const [firstMonth, setFirstMonth] = useState(
    splitValue[0]?.split(" ")[0] || ""
  );
  const [firstYear, setFirstYear] = useState(
    splitValue[0]?.split(" ")[1] || ""
  );

  const oneMonth = splitValue[1] === undefined;
  const isPresent = oneMonth ? false : splitValue[1]?.trim() === "Present";

  const [secondMonth, setSecondMonth] = useState(
    !isPresent ? splitValue[1]?.trim().split(" ")[0] || "" : ""
  );

  const [secondYear, setSecondYear] = useState(
    !isPresent ? splitValue[1]?.trim().split(" ")[1] || "" : ""
  );

  // Determine initial period type
  const getInitialPeriodType = () => {
    // If no value provided, default to "oneMonth"
    if (!value || value.trim() === "") return "oneMonth";
    if (isPresent) return "present";
    if (oneMonth) return "oneMonth";
    return "range";
  };

  const [periodType, setPeriodType] = useState(getInitialPeriodType());

  // Update parent component when values change
  const updateValue = (fMonth = firstMonth, fYear = firstYear, sMonth = secondMonth, sYear = secondYear, pType = periodType) => {
    let newValue = "";
    if (fMonth && fYear) {
      newValue = `${fMonth} ${fYear}`;
      if (pType === "present") {
        newValue += " - Present";
      } else if (pType === "range" && sMonth && sYear) {
        newValue += ` - ${sMonth} ${sYear}`;
      }
      // For "oneMonth" type, we don't append anything
    }
    onChange(newValue);
  };

  const handlePeriodTypeChange = (type) => {
    setPeriodType(type);
    
    if (type === "oneMonth") {
      // Clear second month/year for one month selection
      setSecondMonth("");
      setSecondYear("");
      updateValue(firstMonth, firstYear, "", "", type);
    } else if (type === "present") {
      // Clear second month/year for present
      setSecondMonth("");
      setSecondYear("");
      updateValue(firstMonth, firstYear, "", "", type);
    } else if (type === "range") {
      // Set default second year if not set
      if (!secondYear) {
        setSecondYear(new Date().getFullYear());
      }
      updateValue(firstMonth, firstYear, secondMonth, secondYear || new Date().getFullYear(), type);
    }
  };

  return (
    <Form.Group>
      <Form.Label>Period:</Form.Label>
      
      {/* Period Type Selection */}
      <div className="mb-3">
        <Form.Check
          type="radio"
          id={`periodType-range-${uniqueId}`}
          name={`periodType-${uniqueId}`}
          label="Date Range"
          checked={periodType === "range"}
          onChange={() => handlePeriodTypeChange("range")}
        />
        <Form.Check
          type="radio"
          id={`periodType-oneMonth-${uniqueId}`}
          name={`periodType-${uniqueId}`}
          label="One Month"
          checked={periodType === "oneMonth"}
          onChange={() => handlePeriodTypeChange("oneMonth")}
        />
        <Form.Check
          type="radio"
          id={`periodType-present-${uniqueId}`}
          name={`periodType-${uniqueId}`}
          label="Present"
          checked={periodType === "present"}
          onChange={() => handlePeriodTypeChange("present")}
        />
      </div>

      {/* Start Date */}
      <Form.Select
        value={firstMonth}
        onChange={(e) => {
          const newMonth = e.target.value;
          setFirstMonth(newMonth);
          updateValue(newMonth, firstYear, secondMonth, secondYear);
        }}
      >
        <option value="">Select a Month</option>
        {MONTHS.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </Form.Select>
      <YearPicker
        year={firstYear}
        setYear={setFirstYear}
        updateValue={(year) => updateValue(firstMonth, year, secondMonth, secondYear)}
      />

      {/* End Date - only show for range type */}
      {periodType === "range" && (
        <>
          To

          <Form.Select
            value={secondMonth}
            onChange={(e) => {
              const newMonth = e.target.value;
              setSecondMonth(newMonth);
                updateValue(firstMonth, firstYear, newMonth, secondYear);
            }}
          >
            <option value="">Select a Month</option>
            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Form.Select>
          <YearPicker
            year={secondYear}
            setYear={setSecondYear}
            updateValue={(year) => updateValue(firstMonth, firstYear, secondMonth, year)}
          />
        </>
      )}
    </Form.Group>
  );
}