// import { deleteSingleImage,  uploadSingleImage, uploadSingleImageFromUrl } from "@/hooks/useGetImage";
// import { CloudUpload, LoaderCircle } from "lucide-react";
// import React, { useEffect, useState, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Skeleton } from "@/components/ui/skeleton";
// import { LabelSeparator } from "@/components/ui/separator";
// import useAlert from "@/hooks/useAlert";

// interface ProfilePictureProps {
//   url: string;
//   setProfilePhoto: (url: any) => void;
// }

// export const ProfilePicture = React.memo(({ url, setProfilePhoto }: ProfilePictureProps) => {
//   const { user } = useAuthStore();
//   const { setAlert } = useAlert();
//   const [openModal, setOpenModal] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const [deletingImage, setDeletingImage] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [pasteUrl, setPasteUrl] = useState("");a

//   // Drag & Drop Handlers
//   const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragActive(true);
//   }, []);

//   const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragActive(false);
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile) {
//       if (!droppedFile.type.startsWith('image/')) {
//         setAlert('Please drop an image file', 'error');
//         return;
//       }
//       if (droppedFile.size > 5000000) {
//         setAlert('File too large. 5MB max', 'error');
//         return;
//       }
//       setFile(droppedFile);
//     }
//   }, [setAlert]);

//   const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragActive(false);
//   }, []);

//   // File Upload
//   const handleGetPhotoFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       if (!selectedFile.type.startsWith('image/')) {
//         setAlert('Only image files are allowed', 'error');
//         return;
//       }
//       if (selectedFile.size > 5000000) {
//         setAlert('File too large. 5MB max', 'error');
//         return;
//       }
//       setFile(selectedFile);
//     }
//   }, [setAlert]);

//   const handleFileUpload = useCallback(async () => {
//     if (!file) return;
//     try {
//       setUploading(true);
//       setOpenModal(false);
//       const { data, success, message } = await uploadSingleImage(file, user?.uid!);
//       if (!success) throw new Error(message!);
//       setProfilePhoto(data!);
//     } catch (err: any) {
//       setAlert(err.message, 'error');
//     } finally {
//       setUploading(false);
//       setFile(null);
//     }
//   }, [file, setProfilePhoto, setAlert, user?.uid]);

//   const handleUploadFromUrl = useCallback(async () => {
//     try {
//       setUploading(true);
//       setOpenModal(false);
//       const { data, success, message } = await uploadSingleImageFromUrl(pasteUrl, user?.uid!);
//       if (!success) throw new Error(message!);
//       setProfilePhoto(data!);
//     } catch (err: any) {
//       setAlert(err.message, 'error');
//     } finally {
//       setUploading(false);
//     }
//   }, [pasteUrl, setProfilePhoto, setAlert, user?.uid]);

//   const handleDeleteProfilePhoto = useCallback(async () => {
//     if (!url) return;
//     setDeletingImage(true);
//     try {
//       const { success, message } = await deleteSingleImage(url);
//       if (!success) throw new Error(message!);
//       setProfilePhoto('');
//     } catch (err: any) {
//       setAlert(err.message, 'error');
//     } finally {
//       setDeletingImage(false);
//     }
//   }, [url, setProfilePhoto, setAlert]);

//   useEffect(() => {
//     if (file) {
//       handleFileUpload();
//     }
//   }, [file, handleFileUpload]);

//   return (
//     <Dialog open={openModal} onOpenChange={setOpenModal}>
//       <div className="flex items-center gap-2">
//         <div className="w-16 h-16 rounded-full p-[2px] border-2 border-muted">
//           {uploading ? (
//             <Skeleton className="h-full w-full rounded-full" />
//           ) : (
//             <img
//               src={url || user?.photoURL || ''}
//               alt="Profile"
//               className="w-full h-full object-cover rounded-full"
//             />
//           )}
//         </div>

//         <DialogTrigger asChild>
//           <Button variant="outline" className="text-[10px]" size="sm">
//             Upload New Picture
//           </Button>
//         </DialogTrigger>
//         {!url && (
//           <Button
//             className="text-[10px] bg-muted text-black hover:bg-slate-200 px-5"
//             size="sm"
//             onClick={handleDeleteProfilePhoto}
//           >
//             Delete
//           </Button>
//         )}
//       </div>

//       <DialogContent className="sm:max-w-lg flex flex-col gap-6 items-center pt-10">
//         <div
//           className={`w-full h-full border-2 border-dashed rounded-lg flex flex-col gap-4 items-center mt-4 py-4 ${
//             dragActive ? 'border-blue-500' : ''
//           }`}
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//         >
//           <CloudUpload className="h-16 w-16" />
//           <p className="text-sm capitalize">Drag & Drop your file here</p>
//           <p className="text-xs lowercase text-zinc-500">
//             Supported file: JPEG, PNG, GIF, JPG
//           </p>
//         </div>

//         <LabelSeparator label="or" className="text-xs max-w-[250px]" />

//         <Button type="submit" className="w-full max-w-xs p-0">
//           <label htmlFor="profile_image" className="w-full h-full bg-transparent items-center flex justify-center cursor-pointer">
//             <input
//               type="file"
//               id="profile_image"
//               style={{ display: 'none' }}
//               onChange={handleGetPhotoFile}
//             />
//             Browse Device
//           </label>
//         </Button>

//         <LabelSeparator label="or" className="text-xs max-w-[250px]" />

//         <div className="border w-full rounded-md flex items-center gap-1 p-1">
//           <input
//             type="url"
//             className="border-none bg-background outline-none h-full w-full px-2 text-xs"
//             placeholder="Paste photo URL"
//             value={pasteUrl}
//             onChange={(e) => setPasteUrl(e.target.value)}
//           />
//           <Button size="sm" className="px-7" onClick={handleUploadFromUrl}>
//             Upload
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// });

// ProfilePicture.displayName = 'ProfilePicture'