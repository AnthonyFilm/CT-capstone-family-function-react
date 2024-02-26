interface CustomButtonProps {
    type?: any;
    children: any;
    onclick?: any;
    classname?:any;
    disabled?: boolean;
  }
  
  const classnameDef = "bg-teal-600 py-3 text-white rounded-md w-full mt-5 hover:bg-teal-700 transition"

  const CustomButton: React.FC<CustomButtonProps> = ({classname=classnameDef, type , onclick, disabled, children }) => {
    
    return (
        <button
        type={type}
        onClick={onclick}
        className={classname}
        disabled={disabled}
        >
        {children}
      </button>
    )
  }
  
  export default CustomButton;