
import { auth } from "@/src/lib/auth"
import { redirect } from "next/navigation";
import { ReactNode } from "react";



async function AuthGaurd({ children }: { children: ReactNode }) {
    const  session = await auth()
    if(!session){
        redirect("/login")
    }
    return <>{children}</>

}

export default AuthGaurd
