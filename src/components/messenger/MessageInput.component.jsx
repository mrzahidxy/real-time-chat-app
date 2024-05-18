import { useContext } from "react";
import { doc, updateDoc, arrayUnion, Timestamp, serverTimestamp } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db, storage } from "../../../firebase";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthProvider";
import { Form, Formik } from "formik";
import FormikInputField from "../Form/FormikInputField";
import FormikBulbFileInputField from "../Form/FormikFileField";
import * as Yup from "yup";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const validationSchema = Yup.object().shape({
  text: Yup.string().nullable(),
  image: Yup.mixed().nullable(),
});

const MessageInput = () => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  const initialValues = {
    text: "",
    image: null,
  };

  
  const clearPreviewImageCallback = { current: null };

  const handleUploadImage = async (image) => {
    const storageRef = ref(storage, uuid());
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error(error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    const { text, image } = values;

    let imageUrl = null;
    if (image) {
      imageUrl = await handleUploadImage(image);
    }

    const messageData = {
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
      ...(imageUrl && { image: imageUrl }),
    };

    const chatDocRef = doc(db, "chats", data.chatId);

    await updateDoc(chatDocRef, {
      messages: arrayUnion(messageData),
    });

    const userChatUpdate = {
      [`${data.chatId}.lastMessage`]: text,
      [`${data.chatId}.date`]: serverTimestamp(),
    };

    await updateDoc(doc(db, "userChats", currentUser.uid), userChatUpdate);
    await updateDoc(doc(db, "userChats", data.user.uid), userChatUpdate);

    // Reset form and clear the image field
    resetForm({ values: { text: "", image: null } });
    if (clearPreviewImageCallback.current) {
      clearPreviewImageCallback.current(); // Clear the preview image
    }
  };


  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, setFieldValue }) => (
        <Form className="relative w-full border border-t-0 border-gray-500 rounded-md pb-1">
          <FormikInputField
            name="text"
            inputFieldProps={{
              placeholder: "Enter your message...",
              textarea: true,
              className: "border-l-0 border-r-0 rounded-b-none w-full",
            }}
          />
          <FormikBulbFileInputField
            name="image"
            id="fileInput"
            inputFieldProps={{ clearPreviewImageCallback }}
          />
          <img
            src="/send.png"
            alt="Send"
            className="w-8 absolute right-2 top-2 cursor-pointer"
            onClick={submitForm}
          />
        </Form>
      )}
    </Formik>
  );
};

export default MessageInput;
