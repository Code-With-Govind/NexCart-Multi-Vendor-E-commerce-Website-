import { FileIcon, UploadCloudIcon, XIcon, FileImage } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data
      );

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
      } else {
        setImageLoadingState(false);
        setImageFile(null);
      }
    } catch (e) {
      console.error("Image upload failed:", e);
      setImageLoadingState(false);
      setImageFile(null);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`w-full ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-xs font-bold text-muted-foreground mb-3 block uppercase tracking-wider">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed border-border/60 bg-muted/5 hover:bg-muted/10 transition-colors rounded-2xl p-6 relative group`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode || imageLoadingState}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? "cursor-not-allowed" : "cursor-pointer"} flex flex-col items-center justify-center h-40`}
          >
            <div className="w-14 h-14 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
              <UploadCloudIcon className="w-7 h-7" />
            </div>
            <span className="font-semibold text-foreground text-[15px]">Drag & drop or <span className="text-primary hover:underline">click to upload</span></span>
            <span className="text-xs text-muted-foreground mt-2 font-medium bg-muted px-2 py-1 rounded-md">JPEG, PNG, WEBP (Max 5MB)</span>
          </Label>
        ) : imageLoadingState ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-muted-foreground animate-pulse">Uploading to cloud server...</p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-background border border-border/50 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <FileImage className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-bold text-foreground truncate">{imageFile.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 ml-4 rounded-full h-10 w-10 transition-colors"
              onClick={handleRemoveImage}
              disabled={isEditMode}
            >
              <XIcon className="w-5 h-5" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
