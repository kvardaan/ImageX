import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@repo/database";

/**
 * @description
 * Returns a image
 *
 * @example
 *   GET /api/images/1
 *   => { id: 1, url: "https://example.com/image.jpg" }
 *
 * @params
 *   {
 *     id: number,
 *   }
 */
export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  const id = params.id

  try {
    const image = await prisma.image.findUnique({
      where: { id }
    });

    return new NextResponse(JSON.stringify(image), { status: StatusCodes.OK });
  } catch (error) {
    console.error(`Server Error: ${JSON.stringify(error)}`)
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}