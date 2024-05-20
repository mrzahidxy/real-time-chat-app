import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const { currentUser, dispatch } = useContext(AuthContext);

  return (
    <div className="px-4 py-2 flex justify-between items-center  border-b-1 bg-blue-500 text-white">
      <div className="flex items-center gap-2">
        <img
          src={currentUser?.photoURL}
          alt="display image"
          className="w-18 h-16 rounded-full object-fill"
        />
        <span className="capitalize font-semibold text-xl">
          {currentUser?.displayName ?? ""}
        </span>
      </div>

      <button
        className="p-2  rounded-md border-none bg-red-400 hover:bg-red-500"
        onClick={() => dispatch({ type: "LOGOUT" })}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
