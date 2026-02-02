import  {useQuery,useMutation,useQueryClient }from "@tanstack/react-query"

import { getUsers,getUserById,createUser } from "@/app/api/user/users.api"

const USER_QUERY_KEY = "users"

export function useGetUsersQuery(){
    return useQuery({
        queryKey:[USER_QUERY_KEY],
        queryFn:getUsers
    })
}

export function useGetUserByIdQuery(id:string){
    return useQuery({
        queryKey:[...USER_QUERY_KEY,id],
        queryFn:()=>getUserById(id),
        enabled:!!id
    })
}

export function useCreateUserMutation(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:createUser,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:[USER_QUERY_KEY]})
        }
    })
}