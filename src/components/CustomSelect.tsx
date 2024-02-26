import { useField } from 'formik';

interface CustomSelectProps {
  label: string;
  name: string;
  children: any;
  // You can add more props specific to the <select> element here if needed
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label,children, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <label htmlFor={props.name}>{label}</label>
      <select {...field} {...props} id={props.name}>
        {children}
        {/* Add your <option> elements here */}
      </select>
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </div>
  );
};

export default CustomSelect;
