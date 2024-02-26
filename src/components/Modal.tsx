import { createPortal } from "react-dom"


type Props = {
    openModalProp: boolean;
    form?: any;
    onClose: () => void;
    style:string;
}

const Modal = ( props: Props) => {
    if ( !props.openModalProp ) return (<></>)
    return (createPortal(
            <div
                className={props.style}
                onClick={ (e) => {
                    e.stopPropagation()

                }}>
                    
            <div 
                className="flex flex-col w-full">
                        <p className="flex justify-center m-1 h-7 w-7
                         bg-slate-900 p-1 rounded hover:bg-slate-800 text-white z-20"
                        onClick={props.onClose}>
                        x
                        </p>
                        {props.form} 
                </div>
            </div>
   
     , document.getElementById('modal'))
           
    )
}

export default Modal