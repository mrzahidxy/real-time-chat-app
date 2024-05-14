import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Conversations from "./messenger/Conversations";


const Sidebar = () => {
  return (
    <>
      <Navbar />
      <Search />
      <Conversations />
    </>
  );
};

export default Sidebar;
