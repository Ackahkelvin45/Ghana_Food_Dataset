const BASE_URL = "/api/user"

export interface CreateUserPayload {
  fullName: string
  email: string
  password: string
  userType: string
  phone?: string
}

export async function getUsers(){
    const response = await fetch(`${BASE_URL}`);
    return response.json();
}

export async function getUserById(id:string){
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
}

export async function createUser(payload: CreateUserPayload){
    const response = await fetch(`${BASE_URL}`,{
        method:"POST",
        body: JSON.stringify(payload),
        headers:{
            "Content-Type":"application/json"
        }
    });
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
        throw new Error((data as { error?: string }).error || "Failed to create user")
    }
    return data
}