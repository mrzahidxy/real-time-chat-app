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
  clearPreviewImageCallback,
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

  clearPreviewImageCallback.current = () => setPreviewImage(null); 

  return (
    <div className="flex flex-col gap-2">
      {label && <label>{label}</label>}
      <div className="relative flex gap-2">
        <img
          src="/attach.png"
          className="w-8 h-8 cursor-pointer p-1"
          alt=""
          onClick={() => document.getElementById("upload").click()}
        />

        <input
          className="hidden"
          id="upload"
          type="file"
          disabled={disabled}
          onChange={handleFileChange}
          {...rest} // Pass other props
        />

        {previewImage && (
          <div className="relative">
            <img src={previewImage} alt="Preview" className="h-16" />
          </div>
        )}
      </div>
      {error && <span className="text-red-600">{helperText}</span>}
    </div>
  );
};

const FormikBulbFileInputField = ({ inputFieldProps, ...rest }) => {
  const clearPreviewImageCallback = { current: null };
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
            clearPreviewImageCallback={clearPreviewImageCallback}
            {...inputFieldProps} // Pass additional props
          />
        );
      }}
    </Field>
  );
};

export default FormikBulbFileInputField;
