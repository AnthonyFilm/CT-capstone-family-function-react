import httpClient from '../httpClient';


const logout_config = {
  headers:{
    'Content-Type': 'application/json',
    'Authorization': null
  }
}
const config = {
    headers:{
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  }

  const upload_config = {
    headers:{
      'Content-Type': 'multipart/form-data'
    }
  }





const server_url = import.meta.env.VITE_FLASK_SERVER

export const server_calls = {

    isauthenticated: async () => {
    try {  
    
    const response = await httpClient.post( server_url + '/isauthenticated',
    config )
    const user = response.data
    return  user
    }
     catch (error: any) {
      console.log(error)
      return null
 
    }},

    logout: async () => {
      try {
            console.log('logout sequence start');
            
            const response = await httpClient.get( server_url + '/logout', logout_config )
            const user = response.data
            console.log(user);
            return  user
      }
      catch (error: any) {
        console.log(error)
        return error + "You must login before you logout"
  
      }
    },
    
    getMemories: async () => {
        const response = await httpClient.get( server_url + '/api/memories',
        config )
        console.log(response.data);
        return response.data  
    },

    getOneMemory:async (id:string) => {
        const response = await httpClient.get( server_url + '/api/memories/' + id , 
        config )
        const memory = response.data
        return await memory
    }, 

    getMemoryLink:async (mem_id: string, mem_loc:string) => {
      console.log(`this is the mem_loc from getMemoryLink: ${mem_loc}`);
      const file_name = mem_loc
      const linkForm = new FormData();
      linkForm.append('file_name', file_name);
      linkForm.append('expiration_time', '3600');
      const response = await httpClient.post(server_url + '/generate-link', linkForm, 
      upload_config)

      console.log(`this is the response from getMemoryLink: ${JSON.stringify(response.data)}`);
      
      const memory_id = mem_id
      
      const mem_link = await response.data;
      
      return { "mem_id": memory_id, "mem_link": mem_link }
    },

    createMemory: async (input: any={}) => {
      console.log('create memory input');
      console.log(input);
      const response = await httpClient.post(server_url + '/api/memories', JSON.stringify(input), 
      config )
      const memory = response.data;
      return await memory
    },

    uploadMemoryFile: async (input: any={}) => {
      let body = {'file_loc': input}
      const response = await httpClient.post(server_url + '/upload-file', body , 
      upload_config )
      console.log(input)
      const memory = response.data;
      return await memory
    },

    

    updateMemory:async (id:string, input:any={}) => {
      const response = await httpClient.post(server_url + '/api/memories/' + id, JSON.stringify(input), 
      config )
      const memory = response.data;
      return await memory  
    },

    deleteMemory:async (id:string) => {
      const response = await httpClient.delete(server_url + '/api/memories/' + id, 
      config )
      const memory = response.data;
      return await memory

    },

    deleteMemoryFile:async (file_name :string) => {
      const deleteForm = new FormData();
      deleteForm.append('file_name', file_name);

      const response = await httpClient.post(server_url + '/delete-file', deleteForm,
      upload_config )
      const memory = response.data;
      return await memory
    },

}