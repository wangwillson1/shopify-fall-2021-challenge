
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Home from "./Home";
import Nav from "./Nav";
import Upload from "./Upload";
import MyImages from "./MyImages";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/signin" exact component={SignIn} />
          <Route path="/upload" exact component={Upload} />
          <Route path="/myimages" exact component={MyImages} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;