import { NextResponse} from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";


export async function GET(req:Request) {

    try{

        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const [
          users,
          submissions,
          images,
          submissionsByClassRaw,
          submissionsWithImageCounts,
        ] = await Promise.all([
          prisma.user.count(),
          prisma.submission.count(),
          prisma.image.count(),
          prisma.submission.groupBy({
            by: ["dishName"],
            _count: { _all: true },
          }),
          prisma.submission.findMany({
            select: {
              dishName: true,
              _count: {
                select: { images: true },
              },
            },
          }),
        ]);

        // Aggregate submissions by class (dish type)
        const submissionsByClass: Record<string, number> = {};
        for (const item of submissionsByClassRaw) {
          submissionsByClass[item.dishName] = item._count._all;
        }

        // Aggregate images by class (dish type)
        const imagesByClass: Record<string, number> = {};
        for (const item of submissionsWithImageCounts) {
          const key = item.dishName;
          const imageCount = item._count.images;
          if (!imagesByClass[key]) {
            imagesByClass[key] = 0;
          }
          imagesByClass[key] += imageCount;
        }

        return NextResponse.json({
          totals: { users, submissions, images },
          submissionsByClass,
          imagesByClass,
        });
    }
    catch(error){
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

}