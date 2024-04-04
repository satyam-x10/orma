import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import PostContext from "../../../context/auth/PostContext";
import { PostContextProps } from "../../../types";
import AuthContext from "../../../context/auth/AuthContext";
import { AuthContextProps } from "../../../types";

const useUpload = () => {
  const { event_hash } = useParams();
  const navigate = useNavigate();

  const [images, setImage] = useState<string[]>([]);
  const [videos, setVideo] = useState<string[]>([]);
  const [upload, setUpload] = useState<File[]>([]);
  const [uploadingProgress, setUploadingProgress] = useState<number[]>(
    Array(upload.length).fill(0)
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const [photoCategories, setPhotoCategories] = useState([]);
  const description = useRef<HTMLInputElement>(null);
  let fileCapure = useRef<HTMLInputElement | null>(null);
  const { addProcessingPost } = useContext(PostContext) as PostContextProps;
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    setErrorMessage("");
  }, [upload]);

  let takePhoto = () => {
    if (user !== null) {
      fileCapure.current?.click();
    } else {
      navigate(`/` + event_hash + "/login");
    }
  };

  let loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    let fileList = event.target.files;
    if (fileList) {
      if (fileList.length > 3) {
        setErrorMessage("Maximum of 3 images allowed.");
        return;
      }

      let newImages: string[] = [];
      let newVideos: string[] = [];
      let newUpload: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i];
        let type = file.type;
        newUpload.push(file);
        if (type.includes("video")) {
          newVideos.push(URL.createObjectURL(file));
        }
        if (type.includes("image")) {
          newImages.push(URL.createObjectURL(file));
        }
      }
      setUpload(newUpload);
      setImage(newImages);
      setVideo(newVideos);
      setShow(true);
    }
  };

  let uploadToEvent = async (event: any, uploads: any, description: any) => {
    event.preventDefault();
    const token = Cookies.get("token");

    if (!token) {
      alert("You must verify identity to upload");
      navigate("../login");
    }
    for (const [index, upload] of uploads.entries()) {
        let date = new Date(upload?.lastModified);
        const dateStr = date?.toISOString();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        if (upload && date) {
          setUploadingProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            newProgress[index] = 1;
            return newProgress;
          });
          const formData = new FormData();
          formData.append("image", upload);
          formData.append("description", "1");
          formData.append("original_date", dateStr);
          formData.append("timezone", timezone);
          

          try {
            const res = await axios.post(
              API_URL + "/events/" + event_hash + "/upload",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: token,
                },
              }
            );
            if (res?.data?.limitReached) {
              alert("Upload limit reached, please upgrade.");
            }
            addProcessingPost({ ...res?.data?.post, Likes: [] });
            localStorage.setItem("processing", "true");
        
            setUploadingProgress((prevProgress) => {
              const newProgress = [...prevProgress];
              newProgress[index] = 0;
              return newProgress;
            });
            if(index+1 === uploads.length){
              setErrorMessage("");
              navigate('/'+event_hash);
              window.location.reload();
            }
          } catch (err) {
            setUploadingProgress((prevProgress) => {
              const newProgress = [...prevProgress];
              newProgress[index] = 0; // Reset uploading progress for current element after successful upload
              return newProgress;
            });
            setErrorMessage("Failed to upload file, try again.");
          }
        } else {
          setErrorMessage("Missing image");
        }

    }
  };


  return {
    fileCapure,
    takePhoto,
    loadFile,
    uploadToEvent,
    event_hash,
    images,
    setImage,
    videos,
    setVideo,
    upload,
    setUpload,
    description,
    errorMessage,
    uploadingProgress,
    show,
    setShow,
    photoCategories
  };
};

export default useUpload;
