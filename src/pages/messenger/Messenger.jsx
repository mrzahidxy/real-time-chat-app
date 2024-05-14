import { useContext, useEffect, useState } from "react";
import Message from "../../components/messenger/Message";
import { AuthContext } from "../../context/AuthProvider";
import Sidebar from "../../components/Sidebar";
import {
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { ChatContext } from "../../context/ChatContext";
import { v4 as uuid } from "uuid";

const Messenger = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // console.log("other", data?.user)
  // console.log("user", currentUser)

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  const handleSend = async () => {
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });

    setText("");
  };

  console.log(messages.length > 0);

  return (
    <div className="grid grid-cols-3 border">
      {/* Sidebar */}
      <div className="space-y-4 hidden md:block">
        <Sidebar />
      </div>

      {/* Other User Info */}
      <div className="col-span-2 border-l-2">
        {/* Messages */}
        {messages.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 p-2 border-b-2">
              <img
                src={data?.user?.photoURL}
                alt="display image"
                className="w-10 h-10 rounded-full object-fill"
              />
              <span className="capitalize font-semibold text-black">
                {data?.user?.displayName ?? ""}
              </span>
            </div>

            <div className="flex flex-col gap-2 bg-white h-[calc(100vh-7rem)]">
              {messages.map((m) => (
                <Message
                  message={m}
                  own={m.senderId === currentUser.uid}
                  key={m.id}
                />
              ))}

              <div className="flex flex-row mt-auto">
                <input
                  className="w-full border py-2 focus:outline-blue-200"
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                />
                <button className="bg-white border px-4" onClick={handleSend}>
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center font-bold text-black text-2xl flex justify-center items-center h-[calc(100vh-7rem)]">
            Start a conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
