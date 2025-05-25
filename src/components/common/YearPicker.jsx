import { Form, InputGroup } from 'react-bootstrap';

const YearPicker = ({ year, setYear, updateValue }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <InputGroup className="year-picker">
      <Form.Control
        type="number"
        value={year}
        onChange={(e) => {
          const newYear = e.target.value;
          setYear && setYear(newYear);
          updateValue(newYear);
        }}
        min="1900"
        max={currentYear + 10}
        placeholder="Year"
        required
        className="text-center"
      />
    </InputGroup>
  );
};

export default YearPicker;
