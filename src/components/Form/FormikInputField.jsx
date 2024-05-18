import { Field } from "formik";

const InputField = ({
  label,
  placeholder,
  className,
  error,
  helperText,
  disabled,
  textarea = false,
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label>{label}</label>}
      {textarea ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          className={`outline-0 border border-gray-500 pl-2 rounded-md ${className}`}
          disabled={disabled}
          {...rest}
        />
      ) : (
        <input
          placeholder={placeholder}
          className={`outline-0 border border-gray-500 h-10 pl-2 rounded-md ${className}`}
          disabled={disabled}
          {...rest}
        />
      )}

      {error && <span className="text-red-600">{helperText}</span>}
    </div>
  );
};

const FormikInputField = ({ inputFieldProps, apiError, ...rest }) => {
  return (
    <Field {...rest}>
      {({ field, meta: { touched, error } }) => {
        const hasError = !!apiError || (touched && !!error);
        const displayHelperText = hasError
          ? error || apiError
          : inputFieldProps?.helperText;

        return (
          <InputField
            {...field}
            {...inputFieldProps}
            error={hasError}
            helperText={displayHelperText}
          />
        );
      }}
    </Field>
  );
};

export default FormikInputField;
