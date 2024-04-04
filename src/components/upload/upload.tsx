import "./style.css";
import Button from "../Button";
import useHome from "../home/hooks/useHome";
import { useEffect, useState } from "react";
import loading from "../Loading/loading";
import useUpload from "./hooks/useUpload";
const Upload = ({
  images,
  videos,
  upload,
  description,
  uploadingProgress,
  errorMessage,
  uploadToEvent,
  setShow,
  photoCategories,
}: {
  images: string[];
  videos: string[];
  upload: File[];
  description: any;
  uploadingProgress: number[];
  errorMessage: string;
  uploadToEvent: any;
  setShow: any;
  photoCategories: any;
}) => {
  return (
    <div style={{ marginBottom: "8%" }}>
      {(images.length > 0 || videos.length > 0) && (
        <div>
          <div className="upload-page-round-box2">
            {uploadingProgress.some((progress) => progress > 0) ? (
              <div style={{ width: '100%', marginTop: '-20px' }}>
                <div style={{ paddingLeft: '20px' }}>
                  <span className="upload-title">Uploading Items</span>
                  <p style={{ marginTop: "2px", fontSize: "13px", marginBottom: '15px' }}>
                    Please <b>don't </b>leave the page or reload
                  </p>
                </div>
                {images.map((image, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", flexDirection: "row", paddingLeft: '20px', gap: 10 }}
                  >
                    <div style={{ width: '20%' }}>
                      <img
                        src={image}
                        alt={`image_${index}`}
                        width={"100%"}
                        style={{ borderRadius: "5px", objectFit: "cover", marginBottom: "10px", minHeight: "100px", maxHeight: "100px" }}
                      />
                    </div>
                    <div style={{ width: '70%' }}>
                      {uploadingProgress[index] > 0 && (
                        // <div
                        //   className="loading-bar"
                        //   // style={{ width: `${uploadingProgress[index]}%`, position: "absolute", bottom: 0, left: 0 }}
                        // ></div>
                        <div style={{ paddingTop: "10px" }}>
                          <span>Uploading...</span>
                          <div className="loading-bar"></div>
                        </div>
                      )}
                      {uploadingProgress[index] === 0 && (
                        // <div
                        //   className="loading-bar"
                        //   // style={{ width: `${uploadingProgress[index]}%`, position: "absolute", bottom: 0, left: 0 }}
                        // ></div>
                        <div style={{ paddingTop: "10px" }}>
                          <span>Uploaded</span>
                          <div className="loaded-bar"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {/* {videos.map((video, index) => (
                    <video
                      key={index}
                      controls
                      src={video}
                      width={100}
                      height={100}
                      style={{ borderRadius: "5px", objectFit: "cover" }}
                      autoPlay
                      loop
                    />
                  ))} */}

              </div>
            ) : (
              <div>
                <div style={{ marginLeft: "15px", marginTop: '-25px' }}>
                  <span className="upload-title">Add to this Orma</span>
                  <p style={{ marginTop: "0px", fontSize: "13px", marginBottom: '15px' }}>
                    Upload your beautiful moments to this an Orma
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    overflowX: 'scroll',
                    justifyContent: images?.length === 1 ? 'center' : 'space-between'
                  }}
                >
                  {images.map((image, index) => (
                    <img
                      src={image}
                      alt={`image_${index}`}
                      width={"55%"}
                      style={{ borderRadius: "5px", objectFit: "cover", minHeight: "330", maxHeight: "330px" }}
                    />
                  ))}
                  {/* {videos.map((video, index) => (
                    <video
                      key={index}
                      controls
                      src={video}
                      width={100}
                      height={100}
                      style={{ borderRadius: "5px", objectFit: "cover" }}
                      autoPlay
                      loop
                    />
                  ))} */}
                </div>

                <div className="upload-description">
                  <div style={{ display: "flex", gap: "10px", margin: '25px', flexDirection: 'column' }}>
                    <Button
                      style={{
                        color: "#fff",
                        backgroundColor: "#000",
                        width: "95%",
                        borderRadius: "3px",
                        padding: "6px",
                        fontSize: "17px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        height: "44px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                      onClick={async (e: any) => {
                        uploadToEvent(e, upload, description);
                      }}
                      value="UPLOAD NOW"
                    />
                  </div>

                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: 0,
                      fontSize: "15px",
                      paddingTop: "5px",
                      color: "#e74c3c",
                    }}
                  >
                    {!uploadingProgress && errorMessage && (
                      <span>{errorMessage}</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
