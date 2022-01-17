import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { useState } from "react";

export default function SetupButton() {
    const [show, setShow] = useState(false);
    const [apiInput, setApiInput] = useState("");

    const showModal = () => {
        setApiInput(localStorage.getItem("repairshopr-api"));
        setShow(true);
    }

    const hideModal = () => {
        setShow(false);
    }

    const save = () => {
        localStorage.setItem("repairshopr-api", apiInput);
        hideModal();
    }

    return (
        <>
            <Button variant="warning" onClick={showModal}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: "1.5em" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </Button>

            <Modal show={show} onHide={hideModal}>
                <Modal.Header closeButton>
                    Setup
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <InputGroup.Text>RepairShopr API</InputGroup.Text>
                        <FormControl
                            value={apiInput}
                            onChange={(e) => { setApiInput(e.target.value) }}
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hideModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={save}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}