import React, { useState } from "react";
import "./style.css";
import Button from "../Button";
import Header from "../Header/header";
import image_photographer from "../upload/upload_image.png";
import useUpload from "../upload/hooks/useUpload";
import Upload from "./upload";

const UploadPage = () => {
  const [error, setError] = useState("");
  const {
    fileCapure,
    takePhoto,
    loadFile,
    images,
    videos,
    description,
    upload,
    show,
    setShow,
    uploadingProgress,
    errorMessage,
    uploadToEvent,
    photoCategories,    
  } = useUpload();

  function handleFileSelection(event: any) {
    const selectedFiles = event.target.files;
    const maxFilesAllowed = 3;

    if (selectedFiles.length > maxFilesAllowed) {
      setError(`Please select a maximum of ${maxFilesAllowed} images at a time.`);

      event.target.value = "";

      return;
    }

    loadFile(event);
    setError("");
  }


  return (
    <div style={{ background: "transparent" }}>
      {show && (
        <Upload
          setShow={setShow}
          uploadToEvent={uploadToEvent}
          errorMessage={errorMessage}
          uploadingProgress={uploadingProgress}
          upload={upload}
          description={1}
          images={images}
          videos={videos}
          photoCategories={photoCategories}
        />
      )}
      {!show && (
        <div style={{ marginTop: "6%" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {" "}
            <img src={image_photographer} width={'70%'} />
          </div>
          <div className="upload-page-round-box">
            <div
              style={{
                marginRight: "auto",
                marginLeft: 'auto',
                textAlign:"center"
              }}
            >
              <span className="upload-title">Add to this Orma</span>
              <p style={{ marginTop: "10px", fontSize: "13px", marginBottom: '15px' }}>
                Upload your beautiful moments to this an Orma
              </p>
              {error ? <p style={{ color: "#c0392b" }}>{error}</p> : null}
              <Button
                onClick={() => takePhoto()}
                style={{
                  color: "#fff",
                  backgroundColor: "#000",
                  width: "95%",
                  borderRadius: "3px",
                  padding: "6px",
                  fontSize: "17px",
                  marginLeft:"auto",
                  marginRight:"auto",
                  height: "44px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                value="Upload Your Moment"
              />
                    <p style={{ marginTop: "10px", fontSize: "12px", marginBottom: '15px' }}>
                    Please upload only 3 Images at a time
              </p>
              
              <input
                multiple
                style={{ display: "none" }}
                onChange={handleFileSelection}
                ref={fileCapure}
                type="file"
                accept="image/*"
                id="file"
                name="file"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
