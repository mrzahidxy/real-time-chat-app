import { useEffect, useRef } from "react";

const Message = ({ message, own }) => {

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div ref={ref} className={`${own ? "justify-end" : "justify-start"} flex px-2`}>
      <div className="flex flex-col">
        {message?.text && (
          <span
            className={`${
              own ? "bg-blue-500" : "bg-gray-500"
            }  text-white px-4 py-1 rounded-md`}
          >
            {message?.text}
          </span>
        )}

        {message.image && <img src={message.image} alt="" />}
        <span className="text-xs text-gray-400">
          {" "}
          {new Date(message?.date?.seconds * 1000)?.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default Message;
