import React, { Suspense } from "react";
import { pdfjs } from "react-pdf";
import { NavBar } from "./components/navBar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "virtual:windi.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./styles/animate.css";

pdfjs.GlobalWorkerOptions.workerSrc = "pdf.worker.min.js";

const Home = React.lazy(() => import("./pages/home"));
const Shared = React.lazy(() => import("./pages/shared"));

export const App = () => {
  return (
    <div className="flex flex-col gap-y-30">
      <NavBar />
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/:id" exact>
              <Shared />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
};
