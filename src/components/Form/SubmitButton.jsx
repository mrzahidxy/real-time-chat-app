import { useFormikContext } from "formik";

const SubmitButton = ({className, text}) => {
  const { isSubmitting } = useFormikContext();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`bg-blue-500 text-white w-32 h-10 text-center font-medium rounded-md ${className}`}
    >
      {isSubmitting ? "Loading...." : text}
    </button>
  );
};

export default SubmitButton;
