"use client"

import { toast } from "sonner"
import { Upload } from "lucide-react"
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react"

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { getPublicUrl } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useApplicationStore } from "@/lib/store/appStore"

interface ChangeAvatarProps {
  children: React.ReactNode
  userId: string | undefined
  setUserProfileUrl: Dispatch<SetStateAction<string>>
}

export const ChangeAvatar = ({
  children,
  userId,
  setUserProfileUrl,
}: ChangeAvatarProps) => {
  const updateUser = useApplicationStore((state) => state.updateUser)
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

  const handleSaveAvatar = async () => {
    if (!selectedFile || !userId) {
      toast.error("Please select an image to upload.")
      return
    }

    const formData = new FormData()
    formData.append("userId", userId)
    formData.append("fileName", userId)
    formData.append("file", selectedFile)

    try {
      await fetch("api/users/avatar", {
        method: "post",
        body: formData,
      })

      setUserProfileUrl(getPublicUrl(userId))
      updateUser({ profileUrl: getPublicUrl(userId) })
      toast.success("Avatar changed successfully!")
      setPreview(null)
      setSelectedFile(null)
    } catch {
      toast.error("Error updating avatar!")
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
          <DialogTitle>Edit Avatar</DialogTitle>
          <DialogDescription>
            Upload a new avatar by dragging and dropping an image or selecting a
            file.
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
                alt="Avatar preview"
                width={128}
                height={128}
                loading="lazy"
                className="mx-auto h-40 w-40 object-cover border rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-32">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop the avatar image here, or click to select a file
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
              Selected Avatar: {selectedFile.name}
            </p>
          )}
        </div>
        <DialogFooter className="mx-auto">
          <Button onClick={handleSaveAvatar} disabled={!selectedFile}>
            Save Avatar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
