import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import { useState } from "react";
import repairshopr from "../utils/repairshopr";

export default function CustomerSelector({setCustomer}) {
    const [input, setInput] = useState("");
    const [requestId, setRequestId] = useState(0);
    const [customers, setCustomers] = useState([]);

    const selectCustomer = (customer) => {
        setCustomers([]);
        setInput(`${customer.business_and_full_name}-${customer.phone}`);
        setCustomer(customer);
    };

    return (
        <div className="position-relative">
            <InputGroup>
                <InputGroup.Text>Customer</InputGroup.Text>
                <FormControl
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        //prevent request racing
                        const id = requestId + 1;
                        setRequestId(id);
                        repairshopr.get("customers/autocomplete", {query: input}).then((res) => {
                            //only update list if the request is the latest one
                            if(requestId <= id) {
                                console.log(res);
                                setCustomers(res.data.customers);
                            }
                        });
                    }}
                />
            </InputGroup>
            <ListGroup as="ul" className="position-absolute w-100">
                {customers.slice(0,10).map(customer => {
                    return (
                        <ListGroup.Item key={`customer-${customer.id}`} action onClick={() => {selectCustomer(customer)}}>
                            {`${customer.business_and_full_name}-${customer.phone}`}
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        </div>
    );
}