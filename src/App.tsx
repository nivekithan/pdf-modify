import React, { Suspense } from "react";
import { pdfjs } from "react-pdf";
import { NavBar } from "./components/navBar";
import { ShareFiles } from "./components/shareFiles";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Windicss generated css file
import "virtual:windi.css";

// CSS for react-spinner
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

// react-pdf requires this to work properly
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
