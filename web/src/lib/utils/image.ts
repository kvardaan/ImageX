export const formatImageMetadata = (metadata: string) => {
  let { fileSize, fileType }: { fileSize: number; fileType: string } =
    JSON.parse(metadata)
  const fileSizeInBytes = fileSize
  const fileSizeInKb = fileSizeInBytes / 1024
  const fileSizeInMb = fileSizeInKb / 1024

  const fileSizeString =
    fileSizeInMb >= 1
      ? `${fileSizeInMb.toFixed(2)} MB`
      : fileSizeInKb >= 1
        ? `${fileSizeInKb.toFixed(2)} KB`
        : `${fileSizeInBytes} bytes`

  fileType = fileType.replace("image/", "")

  return { fileSize: fileSizeString, fileType }
}
