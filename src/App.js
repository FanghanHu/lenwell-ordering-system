import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SetupButton from './components/setup-button';
import CustomerSelector from './components/customer-selector';


function App() {
  return (
    <div className="App">
        <SetupButton/>
        <CustomerSelector setCustomer={(customer) => {console.log(customer)}}/>
        some more text
    </div>
  );
}

export default App;
