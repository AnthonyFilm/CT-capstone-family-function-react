import { useMutation, useQueryClient } from '@tanstack/react-query'
import { server_calls } from '../api/server'
import { memId, memoryIdFileLocsMap } from '../pages';



export function useCreateMemory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (memdata) => server_calls.createMemory(memdata),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['memories']})
            // queryClient.setQueryData(['memories'], (old: any) => [...old, memdata])
            memId.value = null
            }
        })
    } 

export function useUpdateMemory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (memdata) => server_calls.updateMemory(memId.value, memdata),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['memories']})
            memId.value = null
            },
        onError: (_, error) => {
            console.log('error', error);
        }        
        })
    }

    export function useDeleteMemory() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: () => server_calls.deleteMemory(memId.value),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['memories']})
            
                },
            onError: (_, error) => {
                console.log('error', error);
            }        
            })
        }

        export function useDeleteMemoryFile() {

            return useMutation({
                mutationFn: () => server_calls.deleteMemoryFile(memoryIdFileLocsMap.value.get(memId.value)),
                onSuccess: () => {
                    memoryIdFileLocsMap.value.delete(memId.value)
                    memId.value = null
                    },
                onError: (_, error) => {
                    console.log('error', error);
                }        
                })
            }
    