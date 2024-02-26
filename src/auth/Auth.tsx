import { useCallback, useState } from 'react';
import Input from '../components/Input';
import httpClient from '../httpClient';
import Modal from '../components/Modal';
import { signal } from '@preact/signals-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import { open } from '../pages';


export const variant = signal('signup');





const Auth = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');

  const navigate = useNavigate()

  
  let [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [errorMessageModalOpen, setErrorMessageModalOpen] = useState(false)

// Modal handling functions
  const handleOpen = () => {
     setErrorMessageModalOpen(true)
  }
  const handleClose = () => {
      setErrorMessageModalOpen(false)
  }
  const handleMessage = (words:string) => {
    setMessage(words)
  }


  const toggleVariant = useCallback(() => {
    if (variant.value === "signin") {
      variant.value = "signup"
    }
    else variant.value = 'signin'}, []
  )

  const config = {
    headers:{
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  }

  const server_url = import.meta.env.VITE_FLASK_SERVER

  const queryClient = useQueryClient()


  const signin = async (email: string, password: string) => {
    console.log(email, password);
    try {
      setSubmitting(true)
      const resp = await httpClient.post(server_url + "/signin", {
        email,
        password,
      });
      const user_id = resp.data
      queryClient.setQueryData(['user_id'], user_id)
      console.log(`sign in user_id ${user_id}`);

      setSubmitting(false) 
      open.value = false
      handleClose()
      navigate("/memviewer")
      } 
    catch (error: any) {
      console.log(error);
      if (error.response.status === 401) {
        handleMessage('There was a problem with your email address or password. Please try again.')
        setSubmitting(false)
        handleOpen()
        
      }
    }
  };

  const signup = async () => {
    try {
      
      if (password != confPassword){
        handleMessage('Passwords do not match. Please try again.')
        setSubmitting(false)
        handleOpen()
      }
      else {
        setSubmitting(true)
        console.log(firstName, lastName, email, password)
        await httpClient.post(server_url + "/signup", {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
          }, config
          ).then(() => { signin(email, password);});
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        handleMessage('That email address is already in use. Please try a different one.')
        setSubmitting(false)
        handleOpen()
      }
    }
  };


  

    return (
        <div className="flex justify-center z-1">
        <div className="bg-black bg-opacity-70 px-1 py-1 lg:max-w-sm self-center mt-2 z-20  rounded-md w-full">
          
          <h2 className="text-white text-4xl mb-8 font-semibold">
            {variant.value === 'signin' ? 'Sign in' : 'Sign Up'}
          </h2>

          <Modal form={message} openModalProp={errorMessageModalOpen} onClose={handleClose} style='px-3 py-1 text-white bg-red-900 text-sm mb-8 font-semibold' />
          
          <div className="flex flex-col gap-4">
            {variant.value === 'signup' && (
              <Input
                id="first_name"
                type="text"
                label="First Name"
                value={firstName}
                onChange={(e: any) => setFirstName(e.target.value)} 
              />  
            )}
            {variant.value === 'signup' && (
             <Input
              id="last_name"
              type="text"
              label="Last Name"
              value={lastName}
              onChange={(e: any) => setLastName(e.target.value)} 
            />
            )}
            <Input
              id="email"
              type="email"
              label="Email address"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)} 
            />
            <Input
              type="password" 
              id="password" 
              label="Password" 
              value={password}
              onChange={(e: any) => setPassword(e.target.value)} 
            />
            {variant.value === 'signup' && (
            <Input
              type="password" 
              id="conf_password" 
              label="Confirm Password" 
              value={confPassword}
              onChange={(e: any) => setConfPassword(e.target.value)} 
            />
            )}
          </div>
          <button onClick={variant.value === 'signin' ? () => signin(email, password) : signup} className={`py-3 text-white rounded-md w-full mt-5 transition ${submitting ? 'bg-gray-600' : 'bg-teal-600 hover:bg-teal-700'}`} disabled={submitting} >
            {(variant.value === 'signin' && !submitting) ? 'Sign In' : 'Sign up'} {submitting && '...submitting'}
          </button>

          <p className="text-neutral-500 mt-5">
            {variant.value === 'signin' ? 'First time using Family Function?' : 'Already have an account?'}
        
            <span role="button" onClick={toggleVariant} onKeyDown={toggleVariant} tabIndex={0} onTouchStart={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
              {variant.value === 'signin' ? 'Create an account' : 'Sign In'}
            </span>
            
          </p>
        </div>
      </div>
    )
}

export default Auth;