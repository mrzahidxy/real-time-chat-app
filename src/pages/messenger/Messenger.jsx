import { useContext, useEffect, useRef, useState } from "react";
import Message from "../../components/messenger/Message.component";
import { AuthContext } from "../../context/AuthProvider";
import Sidebar from "../../components/Sidebar";
import {
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { ChatContext } from "../../context/ChatContext";
import MessageInput from "../../components/messenger/MessageInput.component";

const Messenger = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);



  return (
    <div className="h-screen grid lg:grid-cols-3">
      {/* Sidebar */}
      <div className="space-y-4 hidden lg:block">
        <Sidebar />
      </div>

      <div className="lg:col-span-2 border-l-2">
        {/* Messages */}
        {data?.chatId !== "null" ? (
          <>
            <div className="flex items-center gap-2 py-4 px-6 border-b-2">
              <img
                src={data?.user?.photoURL ?? "./user-not-found.jpeg"}
                alt="display image"
                className="w-14 h-14 rounded-full object-fill"
              />
              <span className="capitalize font-semibold text-black">
                {data?.user?.displayName ?? ""}
              </span>
            </div>

            <div className="flex flex-col gap-2 bg-white h-[calc(100vh-6rem)]">
              <div
                className="flex-1 overflow-y-auto scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#4A90E2 #E4E4E4",
                }}
              >
                {messages.map((m, index) => (
                  <Message
                    message={m}
                    own={m.senderId === currentUser.uid}
                    key={m.id}
                   
                  />
                ))}
              </div>

              <MessageInput />
            </div>
          </>
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
