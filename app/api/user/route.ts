import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { UserTypes } from "@/app/generated/prisma/enums";
import { auth } from "@/src/lib/auth";

type UserRequest = {
    fullName: string;
    email: string;
    password: string;
    userType: string;
    phone?: string;
}

export async function POST(req: NextRequest) {

    try{
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body: UserRequest = await req.json();
        if (!body.fullName || !body.email || !body.password || !body.userType) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        if (!body.userType || body.userType !== 'ADMIN' && body.userType !== 'USER') {
            return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
        }
        const userExists = await prisma.user.findUnique({
            where: { email: body.email }
        });
        if (userExists) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        
        
        const validUserType = body.userType?.toUpperCase() === 'ADMIN' ? UserTypes.ADMIN : UserTypes.USER;
        
        const user = await prisma.user.create({
            data: { 
                fullName: body.fullName, 
                email: body.email, 
                password: hashedPassword, 
                userType: validUserType, 
                phone: body.phone || null 
            }
        });
            return NextResponse.json(user);
    }
    catch(error){
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  
}


export async function GET(req: NextRequest) {
    try{
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const users = await prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
                email: true,
                userType: true,
                phone: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return NextResponse.json(users);
    }
    catch(error){
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}



export async function DELETE(req: NextRequest) {
    try{
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id } = await req.json();
        const user = await prisma.user.delete({
            where: { id }
        });
        return NextResponse.json(user);
    }
    catch(error){
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
