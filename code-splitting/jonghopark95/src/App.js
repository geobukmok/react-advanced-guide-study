import React, { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import ErrorBoundary from "./ErrorBoundary";

// import Home from "./pages/Home";
// import LectureDetail from "./pages/LectureDetail";
// import Lectures from "./pages/Lectures";
// import ResourceDetail from "./pages/ResourceDetail";
// import Resources from "./pages/Resources";

const Home = lazy(() => import("./pages/Home"));
const LectureDetail = lazy(() => import("./pages/LectureDetail"));
const Lectures = lazy(() => import("./pages/Lectures"));
const ResourceDetail = lazy(() => import("./pages/ResourceDetail"));
const Resources = lazy(() => import("./pages/Resources"));

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/lecture-detail" component={LectureDetail} />
            <Route path="/lectures" component={Lectures} />
            <Route path="/resource-detail" component={ResourceDetail} />
            <Route path="/resources" component={Resources} />
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
