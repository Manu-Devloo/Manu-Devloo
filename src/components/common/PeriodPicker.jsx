import { Form, Row, Col, Card } from "react-bootstrap";
import { useState, useId } from "react";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
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
    <Form.Group className="period-picker">
      <Form.Label className="d-flex align-items-center mb-3">
        <FaCalendarAlt className="me-2 text-primary" />
        <span>Time Period</span>
      </Form.Label>
      
      {/* Period Type Selection */}
      <Card className="mb-3 border-0 shadow-sm">
        <Card.Body className="py-2">
          <div className="period-type-selector">
            <Form.Check
              type="radio"
              id={`periodType-range-${uniqueId}`}
              name={`periodType-${uniqueId}`}
              className={`period-type-option ${periodType === "range" ? 'active' : ''}`}
              label="Date Range"
              checked={periodType === "range"}
              onChange={() => handlePeriodTypeChange("range")}
            />
            <Form.Check
              type="radio"
              id={`periodType-oneMonth-${uniqueId}`}
              name={`periodType-${uniqueId}`}
              className={`period-type-option ${periodType === "oneMonth" ? 'active' : ''}`}
              label="One Month"
              checked={periodType === "oneMonth"}
              onChange={() => handlePeriodTypeChange("oneMonth")}
            />
            <Form.Check
              type="radio"
              id={`periodType-present-${uniqueId}`}
              name={`periodType-${uniqueId}`}
              className={`period-type-option ${periodType === "present" ? 'active' : ''}`}
              label="Present"
              checked={periodType === "present"}
              onChange={() => handlePeriodTypeChange("present")}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Date Selection */}
      <div className="date-selection">
        <Row className="g-2 mb-3">
          <Col xs={12}>
            <div className="date-label start">Start Date</div>
          </Col>
          <Col xs={7} md={8}>
            <Form.Select
              value={firstMonth}
              onChange={(e) => {
                const newMonth = e.target.value;
                setFirstMonth(newMonth);
                updateValue(newMonth, firstYear, secondMonth, secondYear);
              }}
              className="month-select"
            >
              <option value="">Select Month</option>
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={5} md={4}>
            <YearPicker
              year={firstYear}
              setYear={setFirstYear}
              updateValue={(year) => updateValue(firstMonth, year, secondMonth, secondYear)}
            />
          </Col>
        </Row>

        {/* End Date - only show for range type */}
        {periodType === "range" && (
          <Row className="g-2">
            <Col xs={12} className="d-flex align-items-center mb-2">
              <div className="date-divider"></div>
              <FaArrowRight className="mx-2 text-muted" />
              <div className="date-label end">End Date</div>
            </Col>
            <Col xs={7} md={8}>
              <Form.Select
                value={secondMonth}
                onChange={(e) => {
                  const newMonth = e.target.value;
                  setSecondMonth(newMonth);
                  updateValue(firstMonth, firstYear, newMonth, secondYear);
                }}
                className="month-select"
              >
                <option value="">Select Month</option>
                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={5} md={4}>
              <YearPicker
                year={secondYear}
                setYear={setSecondYear}
                updateValue={(year) => updateValue(firstMonth, firstYear, secondMonth, year)}
              />
            </Col>
          </Row>
        )}
      </div>
    </Form.Group>
  );
}