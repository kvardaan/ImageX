"use client"

import { toast } from "sonner"
import { Upload } from "lucide-react"
import { useState, useRef, useEffect } from "react"

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ExtendedUser } from "@/lib/next-auth"
import { Button } from "@/components/ui/button"
import { addImage } from "@/lib/actions/images"

interface AddImageProps {
  user: ExtendedUser | undefined
  children: React.ReactNode
}

export const AddImage = ({ user, children }: AddImageProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSaveImage = async () => {
    if (!selectedFile || !user?.id) {
      toast.error("Please select an image to upload.")
      return
    }

    const formData = new FormData()
    formData.append("fileName", `${user?.id}/${new Date().getTime()}`)
    formData.append("file", selectedFile)

    const response = await addImage(formData)

    if (response && response.error) toast.error(response.error)
    else {
      toast.success("Image added successfully!")
      setPreview(null)
      setSelectedFile(null)
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90%] rounded-lg">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
          <DialogDescription>
            Upload a new image by dragging and dropping or selecting a file.
          </DialogDescription>
        </DialogHeader>
        <div
          className="grid gap-4 py-4"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div
            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Image preview"
                width={128}
                height={128}
                loading="lazy"
                className="mx-auto h-40 w-40 object-cover border rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-32">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop the image here, or click to select a file
                </p>
              </div>
            )}
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground text-center">
              Selected Image: {selectedFile.name}
            </p>
          )}
        </div>
        <DialogFooter className="mx-auto">
          <Button onClick={handleSaveImage} disabled={!selectedFile}>
            Add Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
