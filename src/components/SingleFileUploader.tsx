import  { useState } from "react";
import { server_calls } from "../api/server";
import CustomButton from "./CustomButton";
import { signal } from "@preact/signals-react";
import { fileUploadWindowOpen, memoryDataFormOpen } from "../pages";




export const uploadedFile = signal(null);

const SingleFileUploader = () => {
  console.log('start single file uploader');
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadedFile.value = e.target.files[0]   
      setFile(e.target.files[0]);
      const file = new FileReader();
      file.onload = () => {
        setPreview(file.result);
      };
      file && file.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpload = async () => { 
    
    if (file) { 
        try {
        console.log(file);
        localStorage.setItem('file_name', file.name)
        uploadedFile.value = file
        const result:any  = await server_calls.uploadMemoryFile(file) 
        const data = await result;
        console.log(data);
        fileUploadWindowOpen.value = false;
        memoryDataFormOpen.value = true;
        }
        catch (error)
            {console.error(error)}
  };}

  return (
    <div className="bg-[url('https://source.unsplash.com/random?family')]">
      <div   >
        <label htmlFor="file" className="message mx-1 text-white text-center  ">
         <h1 className="mt-1"> FIRST select your memory file to save. </h1>
        </label>
        <input id="file" type="file" onChange={handleFileChange} />
      </div>
      {file && (
        <section className="p-2 text-white bg-slate-500">
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
            <li> {preview && (
  <p className="m-1"><img src={preview as string} alt="Upload preview" /></p>
)}</li>
          </ul>
          <CustomButton onclick={handleUpload}>Upload "{file.name}"</CustomButton>
        </section>
      )}
    </div>
  );
};

export default SingleFileUploader;
