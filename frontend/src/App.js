import './App.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Upload from './components/Upload';
import Files from './components/Files';
import PrivateRoute from './components/PrivateRoute';

/**
 * Renders the main application component.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  return (
    <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <PrivateRoute path="/upload" component={Upload} />
      <PrivateRoute path="/files" component={Files} />
      {/* Add more routes as needed */}
    </Switch>
  </Router>
  );
}

export default App;
