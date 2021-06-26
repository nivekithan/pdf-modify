import React from "react";
import { ReactComponent as Logo } from "~svg/p.svg";
import { Link } from "react-router-dom";

export const NavBar = () => {
  return (
    <header className="shadow-dark-200 shadow-lg rounded">
      <nav className="bg-light-200 flex items-stretch mx-5">
        <div className="flex items-center gap-x-3 text-xl font-semibold tracking-wide p-2 ">
          <Logo width="48px" height="48px" />
          Cut Pdf
        </div>
        <div className="flex items-stretch ml-auto">
          <Link to="/" className="flex items-center hover:bg-white-hover animate-hover px-6 ">
            Home
          </Link>
          <a
            href="https://github.com/nivekithan/pdf-modify"
            className="flex items-center px-6 hover:bg-white-hover animate-hover"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </div>
      </nav>
    </header>
  );
};
