import React from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import enGB from "date-fns/locale/en-GB";
registerLocale("enGB", enGB);

function Datetime(props) {
  // const [startDate, setStartDate] = useState(new Date());
  const ExampleCustomInput = ({ value, onClick }) => (
    <InputGroup>
      <Form.Control
        value={value}
        onClick={onClick}
        readOnly
        placeholder="Press to pick time"
      />
      <InputGroup.Append>
        <Button
          style={{ position: "relative", zIndex: 0 }}
          variant="light"
          className="border px-3"
          // onClick={date => setStartDate(new Date())}
          onClick={date => props.onChangeDate(new Date())}
        >
          <i className="far fa-clock" style={{ width: "1.2em" }} />
          <div className="d-none d-sm-inline ml-1">{" Current time"}</div>
        </Button>
      </InputGroup.Append>
      <InputGroup.Append>
        <Button
          style={{ position: "relative", zIndex: 0 }}
          variant="light"
          className="border px-3"
          onClick={date => props.onChangeDate(null)}
          // onClick={date => setStartDate(null)}
        >
          <i className="far fa-times" style={{ width: "1.2em" }} />
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
  const MyContainer = ({ className, children }) => {
    return (
      <div style={{ position: "relative" }}>
        <CalendarContainer className={className}>
          <div style={{ position: "relative", fontSize: 14 }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };
  return (
    <Form.Group>
      <Form.Label>{props.label}</Form.Label>
      <div>
        <DatePicker
          className="w-100"
          selected={props.value}
          onChange={date => props.onChangeDate(date)}
          // onChange={date => setStartDate(date)}
          customInput={<ExampleCustomInput />}
          showTimeSelect
          // showTimeInput
          timeFormat="HH:mm"
          dateFormat="dd/MM/yyyy HH:mm"
          locale={enGB}
          showMonthDropdown
          showYearDropdown
          // showWeekNumbers
          calendarContainer={MyContainer}
          timeIntervals={15}
          // withPortal
        />
      </div>
      <Form.Text className="text-muted">{props.subtext}</Form.Text>
      <Form.Control.Feedback type="invalid">
        {props.feedback}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export default Datetime;
