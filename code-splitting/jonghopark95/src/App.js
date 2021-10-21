import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Home from "./pages/Home";
import LectureDetail from "./pages/LectureDetail";
import Lectures from "./pages/Lectures";
import React from "react";
import ResourceDetail from "./pages/ResourceDetail";
import Resources from "./pages/Resources";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/lecture-detail" component={LectureDetail} />
        <Route path="/lectures" component={Lectures} />
        <Route path="/resource-detail" component={ResourceDetail} />
        <Route path="/resources" component={Resources} />
      </Switch>
    </Router>
  );
};

export default App;
