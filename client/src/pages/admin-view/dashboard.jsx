import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image as ImageIcon } from "lucide-react";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-border/50">
        <div className="p-3 bg-primary/10 rounded-xl w-fit">
          <ImageIcon size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Homepage Banners</h1>
          <p className="text-muted-foreground font-medium text-sm mt-0.5">Upload and manage promotional feature images for the home page.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />
        <Button
          onClick={handleUploadFeatureImage}
          disabled={!uploadedImageUrl || imageLoadingState}
          className="mt-6 w-full py-6 font-extrabold text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-md transition-all hover:-translate-y-0.5"
        >
          {imageLoadingState ? "Uploading..." : "Upload Banner Image"}
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Current Banners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureImageList && featureImageList.length > 0
            ? featureImageList.map((featureImgItem, idx) => (
              <div key={idx} className="relative group overflow-hidden rounded-2xl shadow-sm border border-border/50 hover:shadow-lg transition-all bg-white dark:bg-card p-2">
                <img
                  src={featureImgItem.image}
                  className="w-full h-[220px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.03]"
                  alt={`Banner ${idx + 1}`}
                />
              </div>
            ))
            : (
              <div className="col-span-full py-16 text-center text-muted-foreground bg-white dark:bg-card rounded-2xl border border-border/50 border-dashed">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold text-lg text-foreground mb-1">No banners uploaded</p>
                <p className="text-sm font-medium">Banners you upload will appear here.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
