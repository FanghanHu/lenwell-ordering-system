import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from 'react-bootstrap/Button';
import devices from "../utils/devices";

export default function DeviceSelector({setDevice}) {
    const [type, setType] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [model, setModel] = useState("");
    const [modelFilter, setModelFilter] = useState("");

    return (
        <div className="position-relative">
            <InputGroup className="my-1">
                <InputGroup.Text>Type</InputGroup.Text>
                <FormControl
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        setTypeFilter(e.target.value);
                    }}
                />
            </InputGroup>
            {
                Object.keys(devices.models).filter(el => !typeFilter | el.toLowerCase().includes(typeFilter.toLowerCase())).map((el, index) => {
                    return (
                        <Button className="m-1" variant="success" key={`type-${index}`} onClick={ () => {
                            setType(el);
                            setModelFilter("");
                        }}>
                            {el}
                        </Button>
                    )
                })
            }
            <InputGroup className="my-1">
                <InputGroup.Text>Model</InputGroup.Text>
                <FormControl
                    value={model}
                    onChange={(e) => {
                        setModel(e.target.value);
                        setModelFilter(e.target.value);
                    }}
                />
            </InputGroup>
            {
                devices.models[type]?.filter(el => !modelFilter | el[0].toLowerCase().includes(modelFilter.toLowerCase()))?.map((el, index) => {
                    return (
                        <Button className="m-1" variant="success" onClick={() => setModel(el[1])} key={`type-${index}`}>
                            {el[0]}
                        </Button>
                    )
                })
            }
        </div>
    )
}