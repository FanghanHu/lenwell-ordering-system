import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form"
import repairshopr from "../utils/repairshopr";



const CUSTOM_TASKS = [
    "Camera",
    "Camera Lens",
    "Charging Port",
    "Battery",
    "Polish",
    "Home Button",
    "Speaker",
    "Frame",
];

export default function TaskSelector({ setTasks, device }) {

    const [input, setInput] = useState([]);
    const [products, setProducts] = useState([]);
    const lastReq = useRef();

    useEffect(async () => {
        //query for products that's related to this model
        if(device.model) {
            const requestTime = Date.now();
            lastReq.current = requestTime;
            const results = await repairshopr.queryProducts(device.model);
            if(lastReq.current === requestTime) {
                setProducts(results);
            }
        }
    }, [device]);

    useEffect(() => {
        setTasks(input);
    }, [input, setTasks])

    const addTask = (task) => {
        console.log(task);
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
        const match = product.description.match(`^${device.model} ${itemName} \\((.+)\\)$`);
        if(match && match.length === 2) {
            item[match[1].toLowerCase()] = product;
            return true;
        }

        //find default item
        if(product.description.match(`^${device.model} ${itemName}$`)) {
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
                        //color is used when adding additionalItem with color to line items when sending the ticket
                        //productId and serviceId are ids of prodcuts to be added as a line item when sending the ticket
                        //additionalItems is an array of string, which will hint the system to look for additional
                        //products to add as line items when sending the ticket
                        addTask(
                            {
                                name: taskName, 
                                color: select.value, 
                                productId: option.getAttribute("data-product-id"),
                                serviceId: option.getAttribute("data-service-id"),
                                additionalItems: device.options?.[taskName]
                            })
                    }}
                >+</Button>
            </InputGroup>
        );
    }

    const AddTaskButton = ({taskName}) => {
        const service = products.find(product => product.description.match(`^${device.model} ${taskName} Repair$`));
        const product = products.find(product => product.description.match(`^${device.model} ${taskName}$`));

        return (
            <InputGroup className="m-1 d-inline-flex align-items-center w-auto">
                <InputGroup.Text className="bg-primary text-white user-select-none">{taskName}</InputGroup.Text>
                <Button variant="outline-primary"
                    onClick={() => {
                        addTask(
                            {
                                name: taskName, 
                                productId: product?.id, 
                                serviceId: service?.id, 
                                additionalItems: device.options?.[taskName]
                            });
                    }}
                >+</Button>
            </InputGroup>
        );
    }

    const handleOtherTask = () => {
        const input = document.getElementById("other-task")
        const taskName = input.value;
        input.value = "";
        const service = products.find(product => product.description.match(`^${device.model} ${taskName} Repair$`));
        const product = products.find(product => product.description.match(`^${device.model} ${taskName}$`));
        addTask({
            name: taskName,
            productId: product?.id, 
            serviceId: service?.id, 
            additionalItems: device.options?.[taskName]
        })
    }

    return (
        <div className="position-relative">
            <InputGroup className="mt-3 mb-1">
                <InputGroup.Text>Tasks</InputGroup.Text>
                <FormControl as="div" className="d-flex">
                    {
                        input.map((task, index) => {
                            return (
                                <InputGroup className="mx-1 d-inline-flex align-items-center w-auto" key={`task-${index}`}>
                                    <InputGroup.Text className="outline-secondary user-select-none">{`${task.name} ${task.color&&task.color!=='default'?`(${task.color})`:""}`}</InputGroup.Text>
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
            {CUSTOM_TASKS.map(taskName => <AddTaskButton taskName={taskName} key={`task-${taskName}`}/>)}
            <InputGroup className="m-1 d-inline-flex align-items-center w-auto">
                <InputGroup.Text className="bg-primary text-white user-select-none">Other</InputGroup.Text>
                <FormControl id="other-task" onKeyUp={(e) => {
                    if (e.key === 'Enter' || e.keyCode === 13) {
                        handleOtherTask();
                    }
                }}/>
                <Button variant="outline-primary"
                    onClick={handleOtherTask}
                >+</Button>
            </InputGroup>
        </div>
    )
}