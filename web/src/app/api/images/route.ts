import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/clients/prisma";

/**
 * @description
 * Returns a list of all images of a user
 * @example
 *   GET /api/images
 *   => {{ id: 1, url: "https://example.com/image.jpg" }, ...}
 * @body
 *   {
 *     id: number,
 *   }
 */
export async function GET(request: NextRequest) {
  const userData = await request.json()
  const userId = userData.id

  try {
    const images = await prisma.image.findMany({
      where: { userId }
    });

    return new NextResponse(JSON.stringify(images), { status: StatusCodes.CREATED });
  } catch (error) {
    console.error(`Server Error: ${JSON.stringify(error)}`)
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}