import Form from 'react-bootstrap/Form';

const YearPicker = ({ year, setYear, updateValue }) => {
  return (
    <Form.Control
        type="number"
        value={year}
        onChange={(e) => {
          const newYear = e.target.value;
          setYear && setYear(newYear);
          updateValue(newYear);
        }}
        required
      />
  );
};

export default YearPicker;
