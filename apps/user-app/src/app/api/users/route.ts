import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@repo/database";

import z from "zod"

const UserUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required" }).max(32, { message: "Name should be less than 32 characters" }).optional(),
  profileUrl: z.string().url({ message: "Profile URL is required" }).optional(),
})

export async function PATCH(request: NextRequest) {
  const userData = await request.json();

  const validatedFields = UserUpdateSchema.safeParse(userData);
  if (!validatedFields.success)
    return NextResponse.json({ error: validatedFields.error.issues[0].message }, { status: StatusCodes.BAD_REQUEST });

  try {
    await prisma.user.update({
      where: { id: userData.id },
      data: {
        name: userData.name,
        profileUrl: userData.profileUrl,
      }
    });

    return NextResponse.json({ status: StatusCodes.CREATED });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}