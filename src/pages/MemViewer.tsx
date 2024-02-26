import { useEffect } from "react";
import MemoryCreateForm from "../components/MemoryCreateForm";
import Modal from "../components/Modal";
import SingleFileUploader from "../components/SingleFileUploader";
import getUserId from "../helpers/getUserID";
import useGetMemories from "../helpers/useGetMemories";
import Timeline from 'timelinejs-react';
import  { useGetMemLinks } from "../helpers/useGetMemLink";
import { signal } from "@preact/signals-react";
import PlaceholderImage from "../assets/placeholder-family.jpg";

// @ts-ignore
interface Memory {
  id: string,
  mem_title: string,
  mem_date: string,
  family: string,
  description: string,
  share_votes: number,
  file_loc: string,
  medium: string
}

export const fileUploadWindowOpen = signal(false);
export const memoryDataFormOpen= signal(false);
export const memId = signal(null);
export const isUpdate = signal(false);
export const isDelete = signal(false);
export const memLinkMap = signal(new Map())
export const memoryIdFileLocsMap = signal(new Map())

// @ts-ignore
const timelineRendered = signal(false);
// @ts-ignore
const server_url = import.meta.env.VITE_FLASK_SERVER

function MemViewer() {

  const user_id = getUserId()
  
  const handleFileUploadWindowOpen = () => {
      fileUploadWindowOpen.value = true;
  }

  const handleFileUploadWindowClose = () => {
      fileUploadWindowOpen.value = false;
      memoryDataFormOpen.value = true;
 
  }

  
  const handleMemoryDataFormClose = () => {
      memoryDataFormOpen.value = false;
      memId.value = null;
      isUpdate.value = false;
      isDelete.value = false;
  }

  // create html for the update and delete buttons within the JS Timeline "text" property
  const updateButtonFirst = 
  '<button class="p-1 px-2 bg-teal-600 rounded my-1 text-black hover:bg-teal-800 hover:text-white updateButton"' 
  const updateButtonEnd = "> Update</button>"

  const deleteButtonFirst ='<button class="p-1 px-2 bg-red-600 rounded my-1 mx-1 text-black hover:bg-red-800 hover:text-white deleteButton" data-id="delete"'
  const deleteButtonEnd = ">Delete</button>"



// Get each memory record from the SQL database
  const memories = useGetMemories()
  console.log(`this is the memories return memories : ${memories}`);
  console.log(`this is the memories array: ${JSON.stringify(memories)}`);

// Use the mem_loc (file name for the media) to create a link to the media file in the AWS S3 bucket
  let memoryIdFileLocs = []
  memories.map((memory: { id: any; file_loc: any; }) => {
      memoryIdFileLocs.push({"id": memory.id, "file_loc": memory.file_loc })
      // map the memory id to the file location to facilitate its possibledeletion from the S3 bucket
      memoryIdFileLocsMap.value.set(memory.id, memory.file_loc)
    })
  console.log(`this is the memoryIdFileLocs array: ${JSON.stringify(memoryIdFileLocs)}`);
  const memLIdLinks = useGetMemLinks(memoryIdFileLocs)
  console.log(`this is the memLIdLinks array: ${JSON.stringify(memLIdLinks)}`);
  
  
  if (!memLIdLinks.error)  {
    memLIdLinks.data.forEach(link => {
      if (typeof link !== 'string') {
        memLinkMap.value.set(link.mem_id, link.mem_link);
      }
    });
    } else {
    memLinkMap.value.set("1", PlaceholderImage);
    }
  
  
  // create the timeline events array from the memories array
  const memorySlideEvents : Slide[] = memories.map((memItem: { mem_title: any; id: string; description: string; mem_date: string | any[]; }) => {
    return (   
    {
      // "unique_id": memItem.id,
      "text": {
        "headline": memItem.mem_title,
        "text": updateButtonFirst + "id=" + memItem.id + updateButtonEnd + deleteButtonFirst + "id=" + memItem.id + deleteButtonEnd + "<br/>" + memItem.description
      },
      "media": {
        "url": memLinkMap.value.get(memItem.id),
        "thumbnail": memLinkMap.value.get(memItem.id),
      },
      "start_date": {
        "month": memItem.mem_date.slice(5,7),
        "day": memItem.mem_date.slice(8,10),
        "year": memItem.mem_date.slice(0,4)
      },
    }
  )
})
  

console.log(memorySlideEvents);




const modal_styling = 
  "flex text-sm w-screen center m-auto sm:min-[250px]lg:min-[100%] overflow-visible max-w-sm w-full h-fit flex flex-col p-1 z-50 mt-10 p-2  bg-gray-600  bg-opacity-70 shadow-xl rounded"
  

const options: TimelineOptions = {
        height: 100,
        initial_zoom: 5,
        width: 500,
        debug: true,
        is_embed: true,
        timenav_height: 10,
};

const TimelineJSReact: React.FC = () => {
    if (memories.isLoading) {
      return <div>Loading...</div>
    }
    if (memories.isError) {
      return <div>Error...</div>
    }

    useEffect(() => {
      const handleDeleteClick = (event: MouseEvent) => {
        // Get the id of the clicked memory update button
        //  @ts-ignore
        const idValue = event.target.id;
        console.log("ID value:", idValue);
        memId.value = idValue;
        console.log(`this is the memId.value: ${memId.value}`);
        memoryDataFormOpen.value = true;
        isDelete.value = true;
        isUpdate.value = false;
      };
      // Create a MutationObserver instance
      const observer = new MutationObserver(() => {
        const deleteButtons = document.getElementsByClassName("deleteButton");
    
        // Add a click event listener to each button
        for (let i = 0; i < deleteButtons.length; i++) {
          // Check if the event listener has already been added
          if (deleteButtons[i].getAttribute('data-hasClickListener') === 'true') {
            continue;
          }
      
          deleteButtons[i].addEventListener('click', handleDeleteClick);
      
          // Add a custom attribute to indicate that the event listener has been added
          deleteButtons[i].setAttribute('data-hasClickListener', 'true');
        }
      });
    
      // Start observing the document with the configured parameters
      observer.observe(document, { childList: true, subtree: true });
    
      return () => {
        // Stop observing changes
        observer.disconnect();
    
        // Remove the event listener from each button
        const deleteButtons = document.getElementsByClassName("deleteButton");
        for (let i = 0; i < deleteButtons.length; i++) {
          deleteButtons[i].removeEventListener('click', handleDeleteClick);
        }
      };
    }, [memorySlideEvents]);
    
    useEffect(() => {
      const handleUpdateClick = (event: MouseEvent) => {
        // Get the id of the clicked memory update button
        //  @ts-ignore
        const idValue = event.target.id;
        console.log("ID value:", idValue);
        memId.value = idValue;
        console.log(`this is the memId.value: ${memId.value}`);
        memoryDataFormOpen.value = true;
        isUpdate.value = true;
        isDelete.value = false;
      };
      // Create a MutationObserver instance
      const observer = new MutationObserver(() => {
        const updateButtons = document.getElementsByClassName("updateButton");
    
        // Add a click event listener to each button
        for (let i = 0; i < updateButtons.length; i++) {
          // Check if the event listener has already been added
          if (updateButtons[i].getAttribute('data-hasClickListener') === 'true') {
            continue;
          }
      
          updateButtons[i].addEventListener('click', handleUpdateClick);
      
          // Add a custom attribute to indicate that the event listener has been added
          updateButtons[i].setAttribute('data-hasClickListener', 'true');
        }
      });
    
      // Start observing the document with the configured parameters
      observer.observe(document, { childList: true, subtree: true });
    
      return () => {
        // Stop observing changes
        observer.disconnect();
    
        // Remove the event listener from each button
        const updateButtons = document.getElementsByClassName("updateButton");
        for (let i = 0; i < updateButtons.length; i++) {
          updateButtons[i].removeEventListener('click', handleUpdateClick);
        }
      };
    }, [memorySlideEvents]);
    
    return <Timeline
        target={<div className="timeline"/>}
        events={memorySlideEvents}
        // title={title} // optional
        options={options} // optional
    />;
};





  return (
    <div id='memviewer' className="w-75 m-auto self-center flex flex-col center bg-black-300">
      <div className="flex flex-row">
                <div>
                    <button
                        className="p-3 bg-teal-600 rounded m-3 text-black hover:bg-teal-800 hover:text-white"
                        onClick={() => handleFileUploadWindowOpen()}
                    >
                        Add a New Memory to Collection
                    </button>
                </div>
             
            </div>
      <h1 className="text-white flex justify-center m-5">Memory Timeline Viewer</h1>   

      <div id="modal" className="h-[100%]">
        <Modal 
              openModalProp={fileUploadWindowOpen.value}
              onClose={handleFileUploadWindowClose}
              form={<SingleFileUploader /> }
              style={modal_styling}
            />
      </div>

      <Modal
            openModalProp={memoryDataFormOpen.value}
            onClose={handleMemoryDataFormClose}
            form={<MemoryCreateForm user_id={user_id} />}
            style={modal_styling}
          />
  
      <div className="text-white h-[100%]">
    
  
      <div className="timeline h-[400px] w-600">
      < TimelineJSReact />
      </div>
      </div>
    </div>
  )
}

export default MemViewer