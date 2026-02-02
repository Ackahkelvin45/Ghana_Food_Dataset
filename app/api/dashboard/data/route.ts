import { NextResponse} from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";


export async function GET(req:Request) {

    try{

        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const [users, submissions,images] = await Promise.all([
            prisma.user.count(),
            prisma.submission.count(),
            prisma.image.count(),

        ]);

        return NextResponse.json({ totals:{users, submissions,images}});



    }
    catch(error){
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

}