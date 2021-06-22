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
const NotFound = React.lazy(() => import("./pages/pageNotFound"));

export const App = () => {
  return (
    <div className="flex flex-col gap-y-30">
      <Router>
        <NavBar />
        <main className="flex flex-col gap-y-30">
          <Suspense fallback={<div></div>}>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/:id" exact>
                <Shared />
              </Route>
              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
        </main>
      </Router>
    </div>
  );
};
