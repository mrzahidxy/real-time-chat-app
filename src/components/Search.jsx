import React, { useContext, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthProvider";

const Search = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUserSearch = async (e) => {
    if (e.key === "Enter") {
      try {
        const q = query(
          collection(db, "users"),
          where("username", "==", searchQuery)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUserSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await setDoc(
          doc(db, "userChats", currentUser.uid),
          {
            [combinedId]: {
              userInfo: {
                uid: user.uid,
                displayName: user.username,
                photoURL: user.photoURL,
              },
              date: serverTimestamp(),
            },
          },
          { merge: true }
        );

        await setDoc(
          doc(db, "userChats", user.uid),
          {
            [combinedId]: {
              userInfo: {
                uid: currentUser.uid,
                displayName: currentUser?.displayName,
                photoURL: currentUser.photoURL,
              },
              date: serverTimestamp(),
            },
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error(err);
    }

    setUser(null);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col px-2">
      <div className="flex flex-row">
        <input
          className="w-full relative h-12 pl-4 rounded-l-lg border focus:outline-blue-200"
          placeholder="Search your friend..."
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => handleUserSearch(e)}
          value={searchQuery}
        />
      </div>
      {user && (
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 px-4 py-2 rounded-r-lg"
          onClick={handleUserSelect}
        >
          <img
            src={user?.photoURL}
            alt="display image"
            className="w-10 h-10 rounded-full object-fill"
          />
          <span className="capitalize font-semibold text-black">
            {user?.username ?? ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default Search;
