import React from "react";

import Search from "./Search.component";
import Conversations from "./messenger/Conversations.component.";
import Navbar from "./Navbar.component";


const Sidebar = ({setVisible}) => {
  return (
    <div className="space-y-4">
      <Navbar />
      <Search />
      <Conversations setVisible={setVisible} />
    </div>
  );
};

export default Sidebar;
