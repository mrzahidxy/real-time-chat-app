import { useContext, useEffect, useState } from "react";
import { db } from "../../../firebase";
import { AuthContext } from "../../context/AuthProvider";
import { onSnapshot, doc } from "firebase/firestore";
import { ChatContext } from "../../context/ChatContext";

const Conversations = ({ setVisible }) => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);
  const [conversations, setConversations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = onSnapshot(
      doc(db, "userChats", currentUser.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setConversations(docSnapshot.data());
        } else {
          setConversations({});
        }
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const handleSelect = (userInfo) => {
   setVisible && setVisible(false);
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  };

  if (loading) {
    return <div className="font-medium pl-4">Loading...</div>;
  }

  return (
    <div>
      {Object.entries(conversations).map(([key, value]) => (
        <div
          key={key}
          className={`${
            value?.userInfo.uid === data?.user?.uid
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-100 text-gray-600"
          } flex gap-2 px-4 py-2 items-center hover:shadow-lg cursor-pointer border-b-2`}
          onClick={() => handleSelect(value.userInfo)}
        >
          <img
            src={value?.userInfo?.photoURL}
            alt="User Avatar"
            className="w-16 h-16 rounded-full"
          />
          <div className="flex justify-between w-full">
            <div className="flex flex-col">
              <span className="font-medium text-lg">
                {value?.userInfo?.displayName}
              </span>
              <span>{value?.lastMessage}</span>
            </div>
            <span className="text-xs">
              {new Date(value?.date?.seconds * 1000).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Conversations;
