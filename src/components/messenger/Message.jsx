const Message = ({ message, own }) => {

  

  return (
    <div className={`${own ? "justify-end" : "justify-start"} flex pt-2`}>
      <div className="flex flex-col">
        <span
          className={`${
            own ? "bg-blue-400" : "bg-gray-400"
          }  text-white px-4 py-1 rounded-md`}
        >
          {message?.text}
        </span>
        {/* <span className="text-xs text-gray-400">{formattedDateTime}</span> */}
      </div>
    </div>
  );
};

export default Message;
