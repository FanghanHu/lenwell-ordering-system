import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { useEffect, useMemo, useRef, useState } from "react";
import Form from "react-bootstrap/Form"
import repairshopr from "../utils/repairshopr";

export default function TaskSelector({ setTask, device }) {

    const [tasks, setTasks] = useState([]);
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
    }, [device])

    const addTask = (task) => {
        //console.log(task);
        const index = tasks.length;
        setTasks([...tasks, task]);
    }

    const removeTask = (task) => {
        const newTasks = tasks.filter(el => el !== task);
        setTasks(newTasks);
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

    const ColorOptions = ({item, prefix}) => {
        const options = [];
        const colors = Object.keys(item);
        for(let i=0; i<colors.length; i++) {
            const color = colors[i];
            options.push(
                <option value={color} key={`${prefix}-${i}`}>
                    {color}
                </option>
            )
        }
        return options;
    }

    const AddTaskButton = ({buttonName, taskName, children}) => {
        const selectId = `${buttonName.replace(" ", "-")}-color`;
        return (
            <InputGroup className="m-1 d-inline-flex align-items-center w-auto">
                <InputGroup.Text className="bg-primary text-white user-select-none">{buttonName}</InputGroup.Text>
                <Form.Select className="border-primary" id={selectId} defaultValue={device?.color?.toLowerCase()}>
                    {children}
                </Form.Select>
                <Button variant="outline-primary"
                    onClick={() => {
                        addTask({name: taskName, color: document.getElementById(selectId).value })
                    }}
                >+</Button>
            </InputGroup>
        );
    }

    return (
        <div className="position-relative">
            <InputGroup className="my-1">
                <InputGroup.Text>Tasks</InputGroup.Text>
                <FormControl as="div" className="d-flex">
                    {
                        tasks.map((task, index) => {
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
            <AddTaskButton buttonName={"Glass"} taskName={"Glass Repair"}><ColorOptions item={glass} prefix={"glass-repair"}/></AddTaskButton>
            <AddTaskButton buttonName={"TP"} taskName={"TP Repair"}><ColorOptions item={tp} prefix={"tp-repair"}/></AddTaskButton>
            <AddTaskButton buttonName={"Backdoor"} taskName={"Backdoor Repair"}><ColorOptions item={backdoor} prefix={"backdoor-repair"}/></AddTaskButton>
            <AddTaskButton buttonName={"LCD"} taskName={"LCD Repair"}><ColorOptions item={lcd} prefix={"lcd-repair"}/></AddTaskButton>
        </div>
    )
}