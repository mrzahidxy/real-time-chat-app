import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const { currentUser, dispatch } = useContext(AuthContext);

  return (
    <div className="px-6 py-2 flex justify-between border border-b-1">
      <div className="flex items-center gap-2">
        <img
          src={currentUser?.photoURL}
          alt="display image"
          className="w-10 h-10 rounded-full object-fill"
        />
        <span className="capitalize font-semibold text-black">
          {currentUser?.displayName ?? ""}
        </span>
      </div>

      <button
        className="px-4 py-1 rounded-md border hover:bg-blue-400 hover:text-white"
        onClick={() => dispatch({ type: "LOGOUT" })}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
