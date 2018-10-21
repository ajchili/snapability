import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Home from "./components/Home";
import Post from "./components/Post";
import Stats from "./components/Stats";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/post" component={Post} />
          <Route path="/post/:type" component={Post} />
          <Route exact path="/stats" component={Stats} />
        </div>
      </Router>
    );
  }
}

export default App;
