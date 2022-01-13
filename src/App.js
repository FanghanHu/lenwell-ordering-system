import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SetupButton from './components/setup-button';
import CustomerSelector from './components/customer-selector';
import DeviceSelector from './components/device-selector';


function App() {
  return (
    <div className="App">
        <SetupButton/>
        <CustomerSelector setCustomer={(customer) => {console.log(customer)}}/>
        <DeviceSelector setDevice={(device) => {console.log(device)}}/>
    </div>
  );
}

export default App;
