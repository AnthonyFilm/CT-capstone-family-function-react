import { Navigate } from "react-router-dom";
import { userId} from "./Navbar";



const PrivateWrapper = ({ children }: { children: JSX.Element }) => {
    try {
    

    if (userId.value !== null) {
      return children
    }
    else {
      return <Navigate to="/" replace />
     }
    }
    catch {
        return <Navigate to="/" replace />
    }
  };

export default PrivateWrapper