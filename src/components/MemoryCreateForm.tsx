
import { useEffect,  useState, } from "react";

import { Formik, Form, } from "formik";
import CustomInput from "./CustomInput";
import CustomSelect from "./CustomSelect";
import CustomTextArea from "./CustomTextArea";
import CustomButton from "./CustomButton";
import { memId, memLinkMap, isDelete, isUpdate, memoryDataFormOpen, memoryIdFileLocsMap } from "../pages";
import * as Yup from "yup";

import { useCreateMemory, useUpdateMemory, useDeleteMemory, useDeleteMemoryFile } from "../helpers/mutations";
import { uploadedFile } from "./SingleFileUploader";

import useGetMemory from "../helpers/useGetMemory";

import { queryClient } from "../main";

import { signal } from "@preact/signals-react";

export const MemoryFormSubmitted = signal(false);

function MemoryCreateForm ({user_id}) {
  

  const createMemory = useCreateMemory()
  const updateMemory = useUpdateMemory()
  const deleteMemory = useDeleteMemory()
  const deleteMemoryFile = useDeleteMemoryFile()

  console.log(`this is the value of user_id in memory create form: ${JSON.stringify(user_id)}`);
  
  console.log(`this is the value of memId in memory create form: ${memId.value}`);  
  let initialValues =  useGetMemory()
  if (!memId.value) {
    initialValues =  {
      mem_title: "",
      family: "",
      share_votes: 0,
      medium: "",
      file_loc: localStorage.getItem('file_name'),
      // sharable: false, 
      mem_date: "0000000",    
      description: "",  
      user_id: {user_id},  
    }}
  
    console.log(`this is the value of initialValues in memory create form: ${JSON.stringify(initialValues)}`);
    
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    if (uploadedFile.value) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreview(fileReader.result);
      };
// @ts-ignore
      fileReader.readAsDataURL(uploadedFile.value);
    }
  }, [uploadedFile.value]);

  const memorySchema = Yup.object().shape({
    mem_title: Yup.string()
        .required('Please enter a title for your memory.')
        .max(100, 'Your title must use less than 100 characters.'),
    family: Yup.string()
        .required('Please enter a family name.')
        .max(100, 'The family name property must be less than 100 characters. Please truncate.'),
    share_votes: Yup.number()
        .nullable(),
    // sharable: Yup.boolean()
    //     .default(false),
    mem_date: Yup.string()
        .required("If you don't know the date of this memory, enter 'unknown'."),
    medium: Yup.string()
        .required('You must select the type of file you are saving.')
        .oneOf(["Video","Photo","Document", "Audio/Sound"], 
        "We do not accept that file type. If you would like that file to be saved, please email us to request it."),
    file_loc: Yup.mixed()

    ,
    description: Yup.string()
        .nullable(),
      })
    // @ts-ignore
  type MemoryType = Yup.InferType<typeof memorySchema>;

  const file_name = localStorage.getItem('file_name')
  console.log(file_name);
  




// id = db.Column(db.String, primary_key = True)
// mem_title = db.Column(db.String(100), nullable=False)
// family = db.Column(db.String(100), nullable=False)
// share_votes = db.Column(db.Integer, default=0)
// sharable = db.Column(db.Boolean, default=False)
// mem_date = db.Column(db.Date, nullable=False) # if none must enter 'null' # must be a string in the form of 'yyyy-mm-dd'
// medium = db.Column(db.String(100), nullable=False)
// file_loc = db.Column(db.String, nullable=False)
// description = db.Column(db.Text, nullable=True)
// date_created = db.Column(db.DateTime, nullable = False, default = datetime.utcnow)
// user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False) 

console.log(`these are init values: ${JSON.stringify(initialValues)}`);


   


  return (
    <div className="w-fit h-full flex flex-col gap-1 bg-[url('https://source.unsplash.com/random?family')] bg-cover bg-center bg-opacity-90">
      <h1 className="text-black text-center m-1 message">Please enter the details about your memory here.</h1>


      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={memorySchema}
        onSubmit={(values, actions) => {
          MemoryFormSubmitted.value = true;
          console.log(`these the values submitting ${JSON.stringify(values)}`)
          console.log(actions)
          if (!isUpdate.value && !isDelete.value) {
            console.log("create memory");
            createMemory.mutate(values)
    
          }
          else if (isDelete.value) {
            console.log("delete memory");
            const resp = deleteMemory.mutate(memId.value)
            console.log(`this is the value of delete resp: ${JSON.stringify(resp)}`);
            
            console.log(`this is the value of memoryIdFileLocsMap: ${JSON.stringify(memoryIdFileLocsMap.value.get(memId.value))}`);
            
            const resp2 = deleteMemoryFile.mutate()
            console.log(`this is the value of delete file resp2: ${JSON.stringify(resp2)}`);
            
           
          }
          else {
            console.log("update memory");
            updateMemory.mutate(values)
            
          }
          actions.setSubmitting(false);
          
          const refetch = queryClient.refetchQueries({ queryKey: ['memories']})
          console.log(`this is the value of refetch: ${JSON.stringify(refetch.finally)}`);
          
          queryClient.refetchQueries({ queryKey: ['memory'], stale: true})
          isDelete.value = false;
          isUpdate.value = false;
          uploadedFile.value = null;
          MemoryFormSubmitted.value = false;
          memoryDataFormOpen.value = false;

        }}
      >
        <Form>
          <div className="flex justify-center m-1 w-[90%]">
          {preview && <img src={String(preview)} alt="uploaded file" /> }
          {isUpdate.value && <h1 className="text-black text-center bg-teal-600 m-1 px-3 py-1">UPDATE MEMORY</h1> }
          {isDelete.value && <h1 className="text-red-900 bg-red-300 text-center m-1">YOU ARE ABOUT TO DELETE THIS MEMORY FILE. THIS ACTION CANNOT BE UNDONE.</h1> }
          <br />
          </div>
          
          {(isDelete.value || isUpdate.value) && <div className="m-1"><img src={memLinkMap.value.get(memId.value)} alt="uploaded file" /></div> }
          
        
          <CustomInput
            label="Memory Title"
            name="mem_title"
            type="text"
          />
          <CustomInput
            label="Enter your Family Name (usually your last name)."
            name="family"
            type="text"
          />  

          <CustomSelect 
            label="What type of file are you saving?"
            name="medium" >
              <option value="">Select one...</option>
              <option value="Video">Video</option>
              <option value="Photo">Photo</option>
              <option value="Document">Document</option>
              <option value="Audio/Sound">Audio/Sound</option>
          </CustomSelect>
          
          <CustomSelect 
            label="Do you want to share this memory outside of your family? (Everyone in your family must agree.)"
            name="share_votes" >
              <option value="0">No</option>
              <option value="1">Yes</option>
          </CustomSelect>
          <CustomInput
            label="Enter the approximate date when the memory item was created. If unknown, type 'unknown'. (Date must be in the form of 'yyyy-mm-dd')"
            name="mem_date"
            type="text"
          />
          <CustomTextArea
            label="Describe your memory."
            name="description"
            type="textarea"
          />
         
          <CustomButton type="submit" classname = "bg-teal-600 py-2 text-white rounded-md w-full mt-2 hover:bg-teal-700 transition" disabled={MemoryFormSubmitted.value}>
            
           {isDelete.value ? <h2 className="text-red-900 bg-red-600">DELETE </h2>: <h2>Submit</h2>}
            
            </CustomButton>
          
        </Form>
      </Formik>
    </div>
  );
};


export default MemoryCreateForm;
