import { useField } from "formik";

interface CustomTextAreaProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label htmlFor={props.name}>{label}</label>
      <textarea
        {...field}
        {...props}
        className={meta.touched && meta.error ? "input-error" : ""}
      />
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </>
  );
};

export default CustomTextArea;
