
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import './App.css';
import Landing from "./Landing"
import CheckoutPage from "./components/checkout/checkout.component"
import Header from "./components/header/header.component";

function App() {
  return (
    <div className="App">
      
      <Router>
        <Header/>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/checkout" component={CheckoutPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
