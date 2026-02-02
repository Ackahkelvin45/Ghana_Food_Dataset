import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try{
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
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
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user);
    }
    catch(error){
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}