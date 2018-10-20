import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import "./App.css";
import Home from "./components/Home";
import Post from "./components/Post";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/post" component={Post} />
        </div>
      </Router>
    );
  }
}

export default App;
