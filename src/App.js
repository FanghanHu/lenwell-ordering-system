import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SetupButton from "./components/setup-button";
import CustomerSelector from "./components/customer-selector";
import DeviceSelector from "./components/device-selector";
import TaskSelector from "./components/task-selector";
import { useState, useCallback } from "react";
import ProblemSelector from "./components/problem-selector";
import Button from "react-bootstrap/Button";
import repairshopr from "./utils/repairshopr";
import Modal from "react-bootstrap/Modal";

function App() {
	const [customer, setCustomer] = useState({});
	const [device, setDevice] = useState({});
	const [tasks, setTasks] = useState([]);
	const [problems, setProblems] = useState([]);
	const [sendingOrder, setSendingOrder] = useState(false);

	const [showModal, setShowModal] = useState(false);
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const sendOrder = async () => {
		//disable the send button to prevent duplicate orders
		setSendingOrder(true);

		let customerId = customer.id;

		if (!customerId) {
			//create customer first
			const res = await repairshopr.post("customers", customer);
			customerId = res.data.customer.id;
			setCustomer(res.data.customer);
		}

		//create the ticket
		const ticket = {
			subject: `${device.model}${device.color ? " - " : ""}${device.color}${
				problems.length ? " - " : ""
			}${problems.join(" - ")}`,
			customer_id: customerId,
			problem_type: tasks
				.map((task) =>
					task.color && task.color !== "default"
						? `${task.name}(${task.color})`
						: task.name
				)
				.join(", "),
		};

		//create the ticket in repairshopr
		const res2 = await repairshopr.post("tickets", ticket);
		const ticketId = res2.data.ticket.id;

		//add line items to the ticket
		const addLineItem = (product) => {
			return repairshopr.post(`tickets/${ticketId}/add_line_item`, {
				name: product.name,
				description: product.description,
				product_id: product.id,
				quantity: 1,
				price_cost: product.price_cost,
				price_retail: product.price_retail,
				taxable: false,
			});
		};

		const addLineItemWithId = async (itemId) => {
			if (itemId) {
				const productRes = await repairshopr.get("products/" + itemId);
				const product = productRes.data.product;
				await sleep(250);
				await addLineItem(product);
			}
		};

		for (const task of tasks) {
			//add auto pricing and inventory line item to ticket
			await addLineItemWithId(task.productId);
			await addLineItemWithId(task.serviceId);

			//add additional item in the task
			if (task.additionalItems?.length) {
				for (const item of task.additionalItems) {
					let products = await repairshopr.queryProducts(
						item.replace("%color%", task.color ? `(${task.color})` : "")
					);
					for (const product of products) {
						if (
							product.description.toLowerCase() ===
							item
								.replace("%color%", task.color ? `(${task.color})` : "")
								.toLowerCase()
						) {
              await sleep(250);
							await addLineItem(product);
							break;
						}
					}
				}
			}
		}

		//release the buttons after the ticket is created
		setSendingOrder(false);

		return res2.data.ticket;
	};

	return (
		<div className="App">
			<h1>
				New Ticket <SetupButton />{" "}
			</h1>
			<CustomerSelector
				setCustomer={useCallback((customer) => {
					console.log(customer);
					setCustomer(customer);
				}, [])}
			/>
			<DeviceSelector
				setDevice={useCallback((device) => {
					setDevice(device);
					console.log(device);
				}, [])}
			/>
			<TaskSelector
				device={device}
				setTasks={useCallback((tasks) => {
					setTasks(tasks);
					console.log(tasks);
				}, [])}
				setSendingOrder={setSendingOrder}
				sendingOrder={sendingOrder}
			/>
			<ProblemSelector
				setProblems={useCallback((problems) => {
					setProblems(problems);
					console.log(problems);
				}, [])}
			/>
			<div className="float-end mt-5">
				<Button
					variant="info"
					size="lg"
					className="m-1"
					disabled={sendingOrder}
					onClick={async () => {
						//create the ticket
						await sendOrder();
						//display a modal to inform user the ticket is created
						setShowModal(true);
					}}
				>
					Chain Ticket
				</Button>
				<Button
					variant="primary"
					size="lg"
					className="m-1"
					disabled={sendingOrder}
					onClick={async () => {
						//send the ticket to repairshopr
						let ticket = await sendOrder();
						//open the  ticket in repairshopr
						repairshopr.openTicket(ticket.id);
					}}
				>
					Create Ticket
				</Button>
			</div>
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Message</Modal.Title>
				</Modal.Header>
				<Modal.Body>Ticket Created</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default App;
