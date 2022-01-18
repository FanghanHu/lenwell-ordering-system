import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form"
import repairshopr from "../utils/repairshopr";

export default function TaskSelector({ setTasks, device }) {

    const [input, setInput] = useState([]);
    const [products, setProducts] = useState([]);
    const lastReq = useRef();

    useEffect(() => {
        //query for products that's related to this model
        if(device.model) {
            const req = repairshopr.get("products", {query: device.model});
            lastReq.current = req;
            req.then((res) => {
                //prevent request racing
                if(lastReq.current === req) {
                    setProducts(res.data.products);
                }
            })
        }
    }, [device]);

    useEffect(() => {
        setTasks(input);
    }, [input])

    const addTask = (task) => {
        console.log(task);
        const index = input.length;
        setInput([...input, task]);
    }

    const removeTask = (task) => {
        const newTasks = input.filter(el => el !== task);
        setInput(newTasks);
    }

    //find related products
    let glassRepair = {default: {}};
    let glass = {default: {}};
    let tpRepair = {default: {}};
    let tp = {default: {}};
    let backdoorRepair = {default: {}};
    let backdoor = {default: {}};
    let lcdRepair = {default: {}};
    let lcd = {default: {}};

    const findProduct = (product, item, itemName) => {
        //find colored variants
        const match = product.name.match(`^${device.model} ${itemName} \\((.+)\\)$`);
        if(match && match.length === 2) {
            item[match[1].toLowerCase()] = product;
            return true;
        }

        //find default item
        if(product.name.match(`^${device.model} ${itemName}$`)) {
            item.default = product;
            return true;
        }

        return false;
    }

    //loop through the product query results to find the product
    for(const product of products) {
        if(findProduct(product, glassRepair, "Glass Repair")) continue;
        if(findProduct(product, glass, "Glass")) continue;
        if(findProduct(product, tpRepair, "TP Repair")) continue;
        if(findProduct(product, tp, "TP")) continue;
        if(findProduct(product, backdoorRepair, "Backdoor Repair")) continue;
        if(findProduct(product, backdoor, "Backdoor")) continue;
        if(findProduct(product, lcdRepair, "LCD Repair")) continue;
        if(findProduct(product, lcd, "LCD")) continue;
    }

    const ColorOptions = ({item, service, prefix}) => {
        const options = [];
        const colors = Object.keys(item);
        for(let i=0; i<colors.length; i++) {
            const color = colors[i];
            options.push(
                <option 
                    value={color} 
                    data-product-id={item[color].id} 
                    data-service-id={service.default.id} 
                    key={`${prefix}-${i}`}
                >
                    {color}
                </option>
            )
        }
        return options;
    }

    const AddColoredTaskButton = ({taskName, children}) => {
        const selectId = `${taskName.replace(" ", "-")}-color`;
        return (
            <InputGroup className="m-1 d-inline-flex align-items-center w-auto">
                <InputGroup.Text className="bg-primary text-white user-select-none">{taskName}</InputGroup.Text>
                <Form.Select className="border-primary" id={selectId} defaultValue={device?.color?.toLowerCase()}>
                    {children}
                </Form.Select>
                <Button variant="outline-primary"
                    onClick={() => {
                        const select = document.getElementById(selectId);
                        const option = select.querySelector(`option[value=${select.value}]`);
                        addTask(
                            {
                                name: taskName, 
                                color: select.value, 
                                productId: option.getAttribute("data-product-id"),
                                serviceId: option.getAttribute("data-service-id")
                            })
                    }}
                >+</Button>
            </InputGroup>
        );
    }

    const AddTaskButton = ({taskName}) => {
        return (
            <InputGroup className="m-1 d-inline-flex align-items-center w-auto">
                <InputGroup.Text className="bg-primary text-white user-select-none">{taskName}</InputGroup.Text>
                <Button variant="outline-primary"
                    onClick={() => {
                        addTask({name: taskName})
                    }}
                >+</Button>
            </InputGroup>
        );
    }

    return (
        <div className="position-relative">
            <InputGroup className="mt-5 mb-1">
                <InputGroup.Text>Tasks</InputGroup.Text>
                <FormControl as="div" className="d-flex">
                    {
                        input.map((task, index) => {
                            return (
                                <InputGroup className="mx-1 d-inline-flex align-items-center w-auto" key={`task-${index}`}>
                                    <InputGroup.Text className="outline-secondary user-select-none">{`${task.name} ${task.color&&task.color!='default'?`(${task.color})`:""}`}</InputGroup.Text>
                                    <Button variant="outline-danger"
                                        onClick={() => {
                                            removeTask(task);
                                        }}
                                    >-</Button>
                                </InputGroup>
                            )
                        })
                    }
                </FormControl>
            </InputGroup>
            <AddColoredTaskButton taskName={"Glass"}><ColorOptions item={glass} service={glassRepair} prefix={"glass-repair"}/></AddColoredTaskButton>
            <AddColoredTaskButton taskName={"TP"}><ColorOptions item={tp} service={tpRepair} prefix={"tp-repair"}/></AddColoredTaskButton>
            <AddColoredTaskButton taskName={"Backdoor"}><ColorOptions item={backdoor} service={backdoorRepair} prefix={"backdoor-repair"}/></AddColoredTaskButton>
            <AddColoredTaskButton taskName={"LCD"}><ColorOptions item={lcd} service={lcdRepair} prefix={"lcd-repair"}/></AddColoredTaskButton>
            <AddTaskButton taskName={"Camera"}/>
            <AddTaskButton taskName={"Camera Lens"}/>
            <AddTaskButton taskName={"Charging Port"}/>
            <AddTaskButton taskName={"Polish"}/>
            <AddTaskButton taskName={"Home Button"}/>
            <AddTaskButton taskName={"Speaker"}/>
            <AddTaskButton taskName={"Frame"}/>
            <AddTaskButton taskName={"Other"}/>
        </div>
    )
}