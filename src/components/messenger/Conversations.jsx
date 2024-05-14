import { useContext, useEffect, useState } from "react";
import { db } from "../../../firebase";
import { AuthContext } from "../../context/AuthProvider";
import { onSnapshot, doc } from "firebase/firestore";
import { ChatContext } from "../../context/ChatContext";

const Conversations = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getConversation = async () => {
    if (!currentUser?.uid) {
      return;
    }

    setLoading(true);

    try {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.exists()) {
          setConversations(doc.data());
        }
      });

      return () => {
        unsub();
      };
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    currentUser?.uid && getConversation();
  }, [currentUser?.uid]);

  const handleSelect = (value) => {
    dispatch({ type: "CHANGE_USER", payload: value.userInfo });
  };

  return (
    <div>
      {loading
        ? "Loading..."
        : Object.entries(conversations).map(([key, value]) => (
            <div
              className="flex gap-2 bg-gray-100 rounded-md px-4 py-2 hover:shadow-lg cursor-pointer"
              key={key}
              onClick={() => handleSelect(value)}
            >
              <img
                src={value.userInfo.photoURL}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div className="flex justify-between w-full">
                <div className="flex flex-col">
                  <span className="font-semibold text-lg text-gray-800">
                    {value.userInfo.displayName}
                  </span>
                  <span className="text-gray-600">How are you?</span>
                </div>

                <span className="text-xs text-gray-400">
                  {/* {new Date(value.date.seconds * 1000).toLocaleTimeString()} */}
                </span>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Conversations;
