import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SetupButton from './components/setup-button';
import CustomerSelector from './components/customer-selector';
import DeviceSelector from './components/device-selector';
import TaskSelector from './components/task-selector';
import { useState } from 'react';


function App() {
  const [device, setDevice] = useState({});

  return (
    <div className="App">
        <SetupButton/>
        <CustomerSelector setCustomer={(customer) => {console.log(customer)}}/>
        <DeviceSelector setDevice={(device) => {
            setDevice(device)
            console.log(device);
        }}/>

        <TaskSelector device={device} setTask={(task) => {console.log(task)}}/>
    </div>
  );
}

export default App;
