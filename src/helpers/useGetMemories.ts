import { useQuery } from "@tanstack/react-query";
import { server_calls } from "../api/server";
import { signal } from "@preact/signals-react";



const placeholderArray =  [{
   "id": "1",
   "mem_title": "Loading...", 
   "mem_date": "Loading...", 
   "family": "Loading...", 
   "description": "Loading...", 
   "share_votes": "Loading...", 
   "file_loc": "Loading...", 
   "medium": "Loading..."}]

export const gotMemories = signal(false);

export default  function useGetMemories() {
   const  getMemories =  useQuery({
      queryKey: ['memories'], 
      queryFn: server_calls.getMemories, 
      staleTime: 1000 * 5* 60});
        console.log('memory data');
        console.log(getMemories.data, getMemories.status);

    console.log(`this is the status of getMemories ${getMemories.status}`);
    
    if (getMemories.isPending) return placeholderArray;
    if (getMemories.error) {
         console.log(getMemories.error);
         return placeholderArray;
         }

   if (getMemories.data) {
      console.log("got memories" + getMemories.data);
      
      gotMemories.value = true;
  };
    console.log('getMemories data' + getMemories.data, typeof getMemories.data);
    
    console.log(`this is from usegetmemories` + JSON.stringify(getMemories.data));
    
   //  const result = getMemories.data.map((memory: any) => {memory[file_loc] =  useGetMemLink(memory.mem_loc)})

    return getMemories.data
 }
