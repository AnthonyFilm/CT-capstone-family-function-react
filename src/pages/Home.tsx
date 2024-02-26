import Modal from "../components/Modal"
import Auth, { variant } from "../auth/Auth"
import { signal } from "@preact/signals-react";



  export const open = signal(false)

  export const handleOpen = () => {
      variant.value = 'signup'
      open.value = true
  }

  export const handleClose = () => {
      open.value = false
  }


function Home() {
  
  return (
    <div className="relative justify-center content-center h-full w-full z-0 bg-no-repeat bg-center bg-fixed bg-cover">
    
              <Modal 
                openModalProp={open.value}
                onClose={handleClose}
                form={<Auth />}
                style="absolute top-[10%] left-[2%] md:left-[25%] sm:min-[250px] overflow-auto  max-w-sm min-w-sm 
                w-4/5 flex flex-col p-1 z-50 mt-10  bg-gray-600  bg-opacity-70 
                shadow-xl rounded"
              />
     
        <section className="animated-grid z-0 grid ">
            <div className="card " ></div>
            <div className="card" ></div>
            <div className="card" ></div>
            <div className="card" ></div>
            <div className="card" ></div>
            <div className="card" ></div>
            <div className="card" ></div>
            <div className="card" ></div>
            <div className="card" ></div>
            <div className="card" ></div>
            <div className="card" ></div>
            <div className="card" ></div>
            <div className="card" ></div>
            
            <div className="card z-0 w-200px" >
            
            <h1 className="bg-black m-1  px-4 rounded-md shaddow">Family Function</h1>
            <h2 className="bg-black  px-4 rounded-md shaddow">A secure way to store and share your family stories.</h2>
            <h2 className="bg-teal-600  hover:bg-teal-700 p-5 m-1 rounded-md shaddow font-size-3"><button onClick={ handleOpen}> Join your family...</button></h2>
            
            </div>
           
      </section>


    </div>
  )
}

export default Home
