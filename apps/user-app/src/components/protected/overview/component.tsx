"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { PlusCircle, ImageOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { AddImage } from "@/components/protected/gallery/addImage";

type ImageType = {
  id: string;
  url: string;
  title: string;
};

type Props = {};

export const Component: React.FC<Props> = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const imagesPerPage = 12;

  useEffect(() => {
    fetchImages(currentPage);
  }, [currentPage]);

  const fetchImages = async (page: number) => {
    setIsLoading(true);
    // try {
    //   // Replace this with your actual API call
    //   const response = await fetch(
    //     `/api/images?page=${page}&limit=${imagesPerPage}`
    //   );
    //   const data = await response.json();
    //   setImages(data.images);
    //   setTotalPages(Math.ceil(data.total / imagesPerPage));
    // } catch (error) {
    //   console.error("Error fetching images:", error);
    // } finally {
    setIsLoading(false);
    // }
  };

  const handleAddImage = () => {
    // Implement your logic to add a new image
    console.log("Add image clicked");
  };

  return (
    <div className="w-full flex flex-col gap-y-2">
      {/* Add Image Button */}
      <AddImage userId="asdsadsadad" setUserProfileUrl={handleAddImage}>
        <div className="flex flex-row items-end justify-end">
          <Button onClick={handleAddImage} variant="default">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Image
          </Button>
        </div>
      </AddImage>

      {/* Images */}
      <div className="min-h-[425px] flex flex-col items-center justify-center gap-y-2 bg-white dark:bg-black/50 border dark:border-white/25 rounded-lg">
        {images.length === 0 ? (
          <div className="text-center py-10 leading-8">
            <ImageOff className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-md font-medium">No images</h3>
            <p className="mt-1 text-sm font-light text-black/50 dark:text-white/50">
              Get started by adding a new image.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={image.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
