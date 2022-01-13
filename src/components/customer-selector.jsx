import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse'
import { useEffect, useState } from "react";
import repairshopr from "../utils/repairshopr";
import ControlledTextInput from "./controlled-text-input";

export default function CustomerSelector({ setCustomer }) {
    const [input, setInput] = useState("");
    const [requestId, setRequestId] = useState(0);
    const [customers, setCustomers] = useState([]);
    

    //for new customer
    const [showForm, setShowForm] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [phone, setPhone] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");

    const selectCustomer = (customer) => {
        setCustomers([]);
        setInput(`${customer.business_and_full_name}-${customer.phone}`);
        setCustomer(customer);
        setShowForm(false);
    };

    useEffect(() => {
        setCustomer({
            "business_name": businessName,
            "firstname": firstName,
            "lastname": lastName,
            "email": email,
            "phone": phone,
            "mobile": mobile,
            "address": address1,
            "address_2": address2,
            "city": city,
            "state": state,
            "zip": zip
        });
    }, [firstName, lastName, businessName, phone, mobile, email, address1, address2, city, state, zip])

    return (
        <div className="position-relative">
            <InputGroup className="my-1">
                <InputGroup.Text>Customer</InputGroup.Text>
                <FormControl
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        //prevent request racing
                        const id = requestId + 1;
                        setRequestId(id);
                        repairshopr.get("customers/autocomplete", { query: input }).then((res) => {
                            //only update list if the request is the latest one
                            if (requestId <= id) {
                                //console.log(res);
                                setCustomers(res.data.customers);
                            }
                        });
                    }}
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={() => {
                    const numbers = /^\d+$/;
                    if(numbers.test(input)) {
                        //if input is all numbers, put input in phone numbebr
                        setPhone(input);
                    } else {
                        const split = input.split(" ");
                        if(split.length === 2) {
                            //if input is 2 words, put them in first and last name
                            setFirstName(split[0]);
                            setLastName(split[1]);
                        } else {
                            //if it doesn't look like anything, put it in the business name
                            setBusinessName(input);
                        }
                    }
                    setShowForm(true);
                    setInput("");
                }}>
                    New
                </Button>
            </InputGroup>
            <ListGroup as="ul" className="position-absolute w-100" style={{zIndex: 2000}}>
                {customers.slice(0, 10).map(customer => {
                    return (
                        <ListGroup.Item key={`customer-${customer.id}`} action onClick={() => { selectCustomer(customer) }}>
                            {`${customer.business_and_full_name}-${customer.phone}`}
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
            <Collapse in={showForm}>
                <Row>
                    <Col xs={12} className="my-1"><ControlledTextInput value={businessName} setValue={setBusinessName}>Business Name</ControlledTextInput></Col>
                    <Col xs={6} className="my-1"><ControlledTextInput value={firstName} setValue={setFirstName}>First Name</ControlledTextInput></Col>
                    <Col xs={6} className="my-1"><ControlledTextInput value={lastName} setValue={setLastName}>Last Name</ControlledTextInput></Col>
                    <Col xs={12} className="my-1"><ControlledTextInput value={phone} setValue={setPhone}>Phone Number</ControlledTextInput></Col>
                    <Col xs={12} className="my-1"><ControlledTextInput value={mobile} setValue={setMobile}>Mobile Number</ControlledTextInput></Col>
                    <Col xs={12} className="my-1"><ControlledTextInput value={email} setValue={setEmail}>Email</ControlledTextInput></Col>
                    <Col xs={12} className="my-1"><ControlledTextInput value={address1} setValue={setAddress1}>Address 1</ControlledTextInput></Col>
                    <Col xs={12} className="my-1"><ControlledTextInput value={address2} setValue={setAddress2}>Address 2</ControlledTextInput></Col>
                    <Col xs={4} className="my-1"><ControlledTextInput value={city} setValue={setCity}>City</ControlledTextInput></Col>
                    <Col xs={4} className="my-1"><ControlledTextInput value={state} setValue={setState}>State</ControlledTextInput></Col>
                    <Col xs={4} className="my-1"><ControlledTextInput value={zip} setValue={setZip}>Zip</ControlledTextInput></Col>
                </Row>
            </Collapse>
        </div>
    );
}