import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";


import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import FormikInputField from "../../components/Form/FormikInputField";
import SubmitButton from "../../components/Form/SubmitButton";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const { email, password } = values;
    // sign in
    // const res = await createUserWithEmailAndPassword(auth, email, password);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user });
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  return (
    <div className="bg-gradient-to-t from-red-400 to-blue-500 flex h-screen justify-center items-center">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="bg-white space-y-2 shadow p-5 rounded-md ">
          <div>
            <div>Logo</div>
            <h1 className="text-xl font-semibold ">Register</h1>
            <span className="text-sm ">
              Welcome, Let's coonect with your friend
            </span>
            <div className="text-red-500">{error}</div>
          </div>

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
          <div>
            Don't have account? <Link to={'/auth/signup'}>Register</Link>
          </div>

          <div className="flex justify-center pt-6">
            <SubmitButton text="Log in" />
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
