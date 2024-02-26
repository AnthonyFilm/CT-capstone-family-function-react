import { useQueries, useQuery } from '@tanstack/react-query';
import { server_calls } from '../api/server';
import Placeholder from '../assets/placeholder-family.jpg';


// use useQueries function to get all memory links to put in an object with memory id as key and memory link as value
export default function useGetMemLink(mem_id: string, mem_loc: string) {
    console.log('start of useGetMemLink');
    console.log(`this is mem_id from useGetMemlink ${mem_id}`);
    
    const getMemLink = useQuery({
        queryKey: ['memory_links', mem_loc],
        queryFn: () => server_calls.getMemoryLink(mem_id, mem_loc),
        staleTime: 1000 * 5 * 60,
        retry: 1,
     
    });
    console.log('memory data');
    console.log(getMemLink.data);
    console.log(`this is the status of getMemoryLink ${getMemLink.status}`);
    if (getMemLink.isPending) return {Placeholder}
    if (getMemLink.error){
        console.log(getMemLink.error);
        return {Placeholder}
        }
    console.log('getMemories data ' + JSON.stringify(getMemLink.data), typeof getMemLink.data);

    return getMemLink.data;
}

export function useGetMemLinks(mem_ids: any[]) {
    console.log('start of useGetMemLinks');
    console.log(mem_ids);

    const getMemLinks = useQueries({
        queries: (mem_ids ?? []).map((item) => ({
            queryKey: ['memory_links', item.id],
            queryFn: () => server_calls.getMemoryLink(item.id, item.file_loc),
            staleTime: 1000 * 60 * 60,
            retry: 1,
            placeholderData: 'Loading...'
        })),
        combine: (results) => ({
            data: results.map((result) => result.data),
            pending: results.some(result => result.isPending),
            error: results.some(result => result.error)
        })
    });

    console.log(`memory links ${JSON.stringify(getMemLinks)}`);
    
    
    return getMemLinks
}