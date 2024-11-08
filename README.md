# ImageX

A high-performance image processing application enabling real-time image transformations and optimizations, supporting multiple image formats.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Database Schema](#db-schema)

## Features

- Auth using NextAuth
- Upload/download and manage image(s)
- Edit images with features like rotation, filters (grayscale, etc.), format conversion, watermarks, and compress.

## Technologies Used

- Next.js
- NextAuth
- AWS S3
- Tailwind CSS
- Shadcn UI
- ESLint
- Prisma ORM
- PostgreSQL
- Docker

## Architecture

![Architecture](/public/Architecture.png)

## Database Schema

![Database Schema](/public/DB_Schema.png)

## Future Work

- Payment Setup + Add a plan management/ upgrade feature
- Daily image processing limits based on user plan

Additional Resources

- [Next-Auth Documentation](https://authjs.dev)
- [AWS S3 JavaScript Client Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3)
- [Prisma ORM Documentation](https://www.prisma.io/docs/orm)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/installation)

> [!NOTE]  
> Suggestions are welcomed for additional improvements to the existing structure. If you have ideas for enhancing the functionality or user experience, please feel free to open an issue or submit a pull request.
