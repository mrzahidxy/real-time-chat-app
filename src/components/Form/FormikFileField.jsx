import { useState } from "react";
import { Field } from "formik";

const BulbFileInputField = ({
  label,
  className,
  error,
  helperText,
  disabled = false,
  field, // Formik field object
  form, // Formik form object
  ...rest
}) => {
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }

    // Use Formik's onChange
    form.setFieldValue(field.name, file);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label>{label}</label>}
      <div className="relative">
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="absolute h-10 w-10 left-2 top-3 pointer-events-none"
          />
        )}

        <input
          type="file"
          disabled={disabled}
          onChange={handleFileChange}
          {...rest} // Pass other props
        />
      </div>
      {error && <span className="text-red-600">{helperText}</span>}
    </div>
  );
};

const FormikBulbFileInputField = ({ inputFieldProps, ...rest }) => {
  return (
    <Field {...rest}>
      {({ field, form, meta }) => {
        const hasError = !!meta.error && meta.touched;
        const displayHelperText = hasError
          ? meta.error
          : inputFieldProps?.helperText;

        return (
          <BulbFileInputField
            field={field}
            form={form}
            error={hasError}
            helperText={displayHelperText}
            {...inputFieldProps} // Pass additional props
          />
        );
      }}
    </Field>
  );
};

export default FormikBulbFileInputField;
