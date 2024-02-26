import { useState } from "react";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";

import { server_calls } from "../api/server";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { open,  handleOpen, memId} from "../pages";
import { variant } from "../auth/Auth";
import { signal } from "@preact/signals-react";

import { useActivityTimer } from "../helpers/useActivityTimer";

export const userId = signal(null)

export function getUserIdObject() { 
    return useQuery({
    queryKey: ['user_id'],
    queryFn: server_calls.isauthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  })}

function Navbar() {
    console.log('start navbar access')
    const [isVisible, setIsVisible] = useState(false);

    
    userId.value = getUserIdObject().data


    console.log('navbar get user id value:' + JSON.stringify(userId) );
    const queryClient = useQueryClient()

    const signOutOnClick = () => {
        console.log('start sign out');
        
        server_calls.logout();
        localStorage.clear()
        queryClient.clear()
        alert('You have been signed out of your account. Please sign in again to access your account.');
        queryClient.setQueryData(['user_id'], null);
        userId.value = null
        memId.value = null
        window.location.replace('/')
   
    };

   useActivityTimer(signOutOnClick, 30 * 60 * 1000)

   

    const signInOnClick = () => {
        console.log('start sign in');
        
        open.value = true;
        handleOpen()    
        variant.value = 'signin'
    };

    const dropDown = () => {
  
        setIsVisible(!isVisible)
    }

    const clicked = () => {
        setIsVisible(false);
    };

  return (
    <nav   id="navbar" className="flex items-center justify-between flex-wrap bg-black-500 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
            <Link to='/' className="font-semibold text-xl tracking-tight">Family Function</Link>
            
        </div>
        <div className="block ">
            <CustomButton onclick={dropDown} classname="flex items-center px-3 py-2 text-white-200 border rounded border-black-400 hover:text-white hover:gray-white">
                <i className="fa-solid fa-bars bg-white"></i>
                </CustomButton> 
        </div>
        { isVisible ? (
            <div className="w-full block flex-grow items-right  ">
                <div className="text-sm lg:flex-grow">
                    <CustomButton classname="p-3 m-5 bg-teal-600 justify-center rounded">
                        <div>
                            <Link to="/" onClick={ clicked } className="flex place-items-center mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-900 mr-4">
                                Home
                            </Link>
                        </div>
                    </CustomButton>
                    <CustomButton classname="p-3 m-5 bg-teal-600 justify-center rounded">
                        <div>
                            <Link to="/about" onClick={ clicked} className="flex place-items-center mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-900 mr-4">
                                About
                            </Link>
                        </div>
                    </CustomButton>

                    {
                        (userId.value === null || userId === undefined )  ?
                        <CustomButton classname="p-3 m-5 bg-teal-600 justify-center rounded" onclick={signInOnClick}>
                            <div>
                                <Link to="/" className='flex place-items-center mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-900'>
                                    Sign In 
                                </Link>
                            </div>
                        </CustomButton>
                        :
                        <>
                         <CustomButton classname="p-3 m-5 bg-teal-600 rounded justify-center">
                        <div>
                            <Link to="/memviewer" onClick={ clicked} className="flex place-items-center mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-900 mr-4">
                                Memory Timeline Viewer 
                            </Link>
                        </div>
                        </CustomButton> 
                        <CustomButton classname="p-3 m-2 bg-teal-600 justify-center rounded" onclick={signOutOnClick}>
                            <div>
                                <Link to="/"  className="flex place-items-center mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-900">
                                    Sign Out
                                </Link>
                            </div>
                        </CustomButton>  
                       
                        </>
                    }
                </div>
            </div>
        ) : (
            <></>
        )}
        </nav>
  )
}

export default Navbar