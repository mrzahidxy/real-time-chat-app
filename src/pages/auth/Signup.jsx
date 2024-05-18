import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import SubmitButton from "../../components/Form/SubmitButton";
import FormikBulbFileInputField from "../../components/Form/FormikFileField";
import FormikInputField from "../../components/Form/FormikInputField";


const validationSchema = Yup.object().shape({
  email: Yup.string().required("email is required"),
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  file: Yup.mixed(),
});

const SignUp = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
    username: ""
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const { username, email, password, file } = values;

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      // Image Reference
      const storageRef = ref(storage, `${username + date}`);
      try {
        await uploadBytesResumable(storageRef, file).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            try {
              //Update Auth Profile
              await updateProfile(res.user, {
                displayName: username,
                photoURL: downloadURL,
              });

              //Create User on Firestore
              await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                username,
                email,
                photoURL: downloadURL,
              });

              // Redirect
              navigate("/auth/login");
            } catch (err) {
              console.log(err);
            }
          });
        });
      } catch (error) {
        console.log(error);
      }
    } catch (err) {
      setError(err?.customData?._tokenResponse?.error?.message);
    }
  };

  return (
    <div className="bg-gradient-to-t from-red-400 to-blue-500 flex h-screen justify-center items-center">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="w-1/4 bg-white space-y-2 shadow p-5 rounded-md">
          <div className="mb-4">
          <h1 className="text-4xl font-medium mb-2 italic text-blue-500">Lippy</h1>
            <span className="text-sm">
              Welcome, Let's conect with your friend
            </span>
            <div className="text-red-500">{error}</div>
          </div>
          <FormikInputField
            name="username"
            inputFieldProps={{
              placeholder: "Name",
            }}
          />
          <FormikInputField
            name="email"
            inputFieldProps={{
              placeholder: "Email",
            }}
          />
          <FormikInputField
            name="password"
            inputFieldProps={{
              placeholder: "Password",
            }}
          />

          <FormikBulbFileInputField name="file" />

          <div>
            Already have an account? <Link to={'/auth/login'}>Login</Link>
          </div>

          <div className="flex justify-center pt-4">
            <SubmitButton text="Sign up" />
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default SignUp;
