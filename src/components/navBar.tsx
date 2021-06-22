import React from "react";
import { ReactComponent as Logo } from "~svg/p.svg";
import { Link } from "react-router-dom";

export const NavBar = () => {
  return (
    <header className="shadow-dark-200 shadow-lg rounded">
      <nav className="h-[60px] w-full bg-light-200  flex items-center px-10 py-2 justify-between ">
        <div className="flex items-center gap-x-2">
          <Logo width="48px" height="48px" />
          <span className="text-xl font-semibold relative top-1">Modify Pdf</span>
        </div>
        <div className="flex gap-x-5">
          <Link to="/" className="hover:text-blue-600 animate-hover">
            Home
          </Link>
          <a href="https://github.com/nivekithan/pdf-modify">Github</a>
        </div>
      </nav>
    </header>
  );
};
