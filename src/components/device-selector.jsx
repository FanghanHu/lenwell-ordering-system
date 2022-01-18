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
    const [color, setColor] = useState("");
    const [colorFilter, setColorFilter] = useState("");

    useEffect(() => {
        setDevice({type, model, color});
    }, [type, model, color])


    return (
        <div className="position-relative">
            <InputGroup className="mt-5 mb-1">
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
                        <Button className="m-1" variant={type?type===el?"success":"secondary":"success"} key={`type-${index}`} onClick={ () => {
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
                        <Button className="m-1" variant={model?model===el[1]?"success":"secondary":"success"} onClick={() => setModel(el[1])} key={`model-${index}`}>
                            {el[0]}
                        </Button>
                    )
                })
            }
            <InputGroup className="my-1">
                <InputGroup.Text>Color</InputGroup.Text>
                <FormControl
                    value={color}
                    onChange={(e) => {
                        setColor(e.target.value);
                        setColorFilter(e.target.value);
                    }}
                />
            </InputGroup>
            {
                devices.colors.filter(el => !colorFilter | el.toLowerCase().includes(colorFilter.toLowerCase())).map((el, index) => {
                    return (
                        <Button className="m-1" variant={color?color===el?"success":"secondary":"success"} key={`color-${index}`} onClick={ () => {
                            setColor(el);
                            setColorFilter("");
                        }}>
                            {el}
                        </Button>
                    )
                })
            }
        </div>
    )
}