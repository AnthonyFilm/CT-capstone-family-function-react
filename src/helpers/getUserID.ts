import { useQuery, useQueryClient } from "@tanstack/react-query"
import { server_calls } from "../api/server"


function getUserId() {

  console.log(`get user id component`);

  
  const getUserIdObject = useQuery({
      queryKey: ['user_id'],
      queryFn: server_calls.isauthenticated,
      staleTime: 1000 * 60 * 5,
      retry: false,
      refetchOnWindowFocus: false,
    })
 
    console.log(`getuserID after useQuery ${getUserIdObject.data}`);
  if (getUserIdObject.data) {
    console.log('returning user_id data ' + getUserIdObject.data);

 
   
    
    return JSON.stringify(getUserIdObject.data)
  }

  
   
  
  console.log(getUserIdObject.data);
  if (getUserIdObject.isLoading){
    return null}
  if (getUserIdObject.error) return null
  
  const user_id_str: string = JSON.stringify(getUserIdObject.data) 
  console.log(user_id_str);

  return user_id_str

}
  
export default getUserId

