import { useQuery } from "@tanstack/react-query";
import { server_calls } from "../api/server";
import { memId } from "../pages";

const placeholderArray =  {
   "user_id": "1",
   "mem_title": "Loading...", 
   "mem_date": "Loading...", 
   "family": "Loading...", 
   "description": "Loading...", 
   "share_votes": 0, 
   "file_loc": "Loading...", 
   "medium": "Loading..."}

export default  function useGetMemory() {
    console.log('start of useGetMemory');
    console.log(memId.value);
    
    
   const  getMemory =  useQuery({queryKey: ['memory', memId.value ], queryFn: () => server_calls.getOneMemory(memId.value), staleTime: 1000 * 5* 60});
        console.log('memory data');
        console.log(getMemory.data, getMemory.status);

    console.log(`this is the status of getMemories ${getMemory.error}`);
    
    if (getMemory.isPending) return placeholderArray;
    if (getMemory.error) {
         console.log(getMemory.error);
         return placeholderArray;
         }
    console.log('getMemories data' + getMemory.data, typeof getMemory.data);
    
    console.log(`this is from usegetmemory` + JSON.stringify(getMemory.data));
    
   //  const result = getMemories.data.map((memory: any) => {memory[file_loc] =  useGetMemLink(memory.mem_loc)})

    return getMemory.data
 }
