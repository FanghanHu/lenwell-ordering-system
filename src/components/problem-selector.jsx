import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";

export default function ProblemSelector({ setProblems }) {
    const [input, setInput] = useState([]);

    useEffect(() => {
        setProblems(input);
    }, [input, setProblems])

    const addProblem = (problem) => {
        //console.log(task);
        setInput([...input, problem]);
    }

    const removeProblem = (problem) => {
        const newTasks = input.filter(el => el !== problem);
        setInput(newTasks);
    }

    const AddProblemButton = ({problemName}) => {
        return (
            <InputGroup className="m-1 d-inline-flex align-items-center w-auto">
                <InputGroup.Text className="bg-dark text-white user-select-none">{problemName}</InputGroup.Text>
                <Button variant="outline-dark"
                    onClick={() => {
                        addProblem(problemName)
                    }}
                >+</Button>
            </InputGroup>
        );
    }

    const handleOtherProblem = () => {
        const input = document.getElementById("other-problem")
        const problem = input.value;
        input.value = "";
        addProblem(problem)
    }

    return (
        <div className="position-relative">
            <InputGroup className="mt-3 mb-1">
                <InputGroup.Text>Problems</InputGroup.Text>
                <FormControl as="div" className="d-flex">
                    {
                        input.map((problem, index) => {
                            return (
                                <InputGroup className="mx-1 d-inline-flex align-items-center w-auto" key={`problem-${index}`}>
                                    <InputGroup.Text className="outline-secondary user-select-none">{problem}</InputGroup.Text>
                                    <Button variant="outline-danger"
                                        onClick={() => {
                                            removeProblem(problem);
                                        }}
                                    >-</Button>
                                </InputGroup>
                            )
                        })
                    }
                </FormControl>
            </InputGroup>
            <AddProblemButton problemName="Black Dot"/>
            <AddProblemButton problemName="Shadow"/>
            <AddProblemButton problemName="Touch Issue"/>
            <AddProblemButton problemName="Backlight Issue"/>
            <AddProblemButton problemName="Bent Frame"/>
            <AddProblemButton problemName="No Display"/>
            <AddProblemButton problemName="No Power"/>
            <AddProblemButton problemName="Broken Screen"/>
            <AddProblemButton problemName="Broken Backdoor"/>
            <AddProblemButton problemName="Broken Camera Lens"/>
            <AddProblemButton problemName="Broken Camera"/>
            <AddProblemButton problemName="Broken Home Button"/>
            <AddProblemButton problemName="LCD Only"/>
            <InputGroup className="m-1 d-inline-flex align-items-center w-auto">
                <InputGroup.Text className="bg-dark text-white user-select-none">Other</InputGroup.Text>
                <FormControl id="other-problem" onKeyUp={(e) => {
                    if (e.key === 'Enter' || e.keyCode === 13) {
                        handleOtherProblem();
                    }
                }}/>
                <Button variant="outline-dark"
                    onClick={handleOtherProblem}
                >+</Button>
            </InputGroup>
        </div>
    );
}