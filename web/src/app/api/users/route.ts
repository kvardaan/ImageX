import z from "zod"
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/clients/prisma";

const UserUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required" }).max(32, { message: "Name should be less than 32 characters" }),
})

export async function PATCH(request: NextRequest) {
  const userData = await request.json();

  const validatedFields = UserUpdateSchema.safeParse(userData);

  if (!validatedFields.success)
    return NextResponse.json({ status: StatusCodes.BAD_REQUEST, error: validatedFields.error.issues[0].message });

  try {
    await prisma.user.update({
      where: { id: userData.id as string },
      data: {
        name: userData.name as string,
      }
    });

    return NextResponse.json({ status: StatusCodes.CREATED });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong!" }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}