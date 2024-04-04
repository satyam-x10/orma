// Home.jsx
import "./style.css"
import React, { useState, useEffect, RefObject, LegacyRef, useContext } from 'react';
import useHome from './hooks/useHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faSpinner } from '@fortawesome/free-solid-svg-icons'

import Button from "../Button";
import ImageProcessor from "../ImageProcessor";
import 'react-phone-number-input/style.css'
import Header from "../Header/header";
import LiveFeed from "./LiveFeed";
import VerticalFeed from "./VerticalFeed";
import MainOrmaFeed from "./OrmaFeed";
import { useRef } from "react";
import { faClose } from '@fortawesome/free-solid-svg-icons';
import UploadPage from "../upload/uploadPage";
import CameraInput from "../Camera";
import { useNavigate, useLocation } from "react-router-dom";
import Plus from "../../assets/svgs/plus";
import UploadSvg from "../../assets/svgs/upload";
import Camera from "../../assets/svgs/camera";
import useUpload from "../upload/hooks/useUpload";
import Upload from "../upload/upload";
import PopupModal from "../PopUpModal/PopupModal";
import Cog from "../../assets/svgs/cog";
import ShareModal from "../PopUpModal/ShareModal/ShareModal";
import AuthContext from "../../context/auth/AuthContext";
import EditModal from "../PopUpModal/EditModal/EditModal";
import EditOrmaSettings from "./settings";
import { sendEvent } from "../../analytics";

const Home: React.FC = () => {

  const { event, pageLoading, errorPage, goUpload, updateVisitedEvent } = useHome();
  const { user } = useContext(AuthContext)

  const [vertial, setVertial] = useState(false);
  const [ormaFeed, setOrmaFeed] = useState(false);
  const [grid, setGrid] = useState(false);
  const observedImagesRef = useRef<Set<HTMLImageElement>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false);
  const [showFloats, setShowFloats] = useState(false)
  const cameraRef = useRef<HTMLButtonElement | null>(null);
  const uploadRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shareModal, setShareModal] = useState(false)
  const [editModal, setEditmodal] = useState(false)
  const [detailsEdit, setDetailsEdit] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  const locationpath = location

  useEffect(() => {
    if (locationpath?.hash === "#timeline") {
      sendEvent('Navigation', 'Click', 'Timeline Button');
      setOrmaFeed(true);
      setGrid(false)
      setVertial(false);
    }
    if (!locationpath?.hash) {
      setOrmaFeed(false);
      setGrid(true)
      setVertial(false);
    }

  }, [locationpath])

  useEffect(() => {
    const localEvents = JSON.parse(localStorage.getItem('recent_ormas') as string);
    const eventfound = localEvents?.find((e: any) => e.event_hash === event?.event_hash);

    const remoteEvents = JSON.parse((localStorage.getItem('recent_viewed_api') as string)|| "[]");
    const eventfoundremote = remoteEvents?.find((e: any) => e === event?.event_hash);
    
    if (event) {
      if (user && !eventfoundremote) {                
        const isEventAlreadyAdded = remoteEvents.some((e: any) => e === event?.event_hash);

        if (!isEventAlreadyAdded) {
          remoteEvents.push(event.event_hash);
          localStorage.setItem('recent_viewed_api', JSON.stringify(remoteEvents));
        }
        updateVisitedEvent(event.event_hash);
      }
      else if (eventfound){
        const updatedEvents = localEvents?.map((e: any) => e.event_hash === event?.event_hash ? event : e);  
        localStorage.setItem('recent_ormas', JSON.stringify(updatedEvents));
      }
      else if (!eventfound){
        localStorage.setItem('recent_ormas', JSON.stringify([event]));
      }
    }
  }, [event])


  const toggleModal = () => {
    if(!user){
      navigate('/login')
    }
    setShowModal(!showModal);
    showModal ? setGrid(true) : setGrid(false);
  }

  const setNav = (nav: string) => {
    switch (nav) {
      case 'grid':
        const newLocation = location.pathname.replace(/#.*$/, '');
        navigate(newLocation);
        setGrid(true);
        setVertial(false);
        setOrmaFeed(false);
        return;
      case 'ormaFeed':
        navigate('#timeline');
        setGrid(false);
        setVertial(false);
        setOrmaFeed(true);
        return;
      case 'vertical':
        setGrid(false);
        setVertial(true);
        setOrmaFeed(false);
        return;
    }
  }

  const openFloat = () => {
    setShowFloats(!showFloats);
    // if (cameraRef.current !== null && uploadRef.current !== null) {
    //   // const cameraButton = cameraRef.current;
    //   // const uploadButton = uploadRef.current;
    //   // cameraButton.style.bottom = '30%';
    //   // uploadButton.style.bottom = '18%';


    //  // const isFloated = cameraButton.style.bottom === '30%';

    // }
  };

  const [popup, setPopup] = useState(false);
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


  const togglePopup = () => {
    setPopup((pop) => !pop);
  }

  const handleClick = () => {
    if(!user){
      navigate('/login')
    }
    // TypeScript now understands that current is an HTMLInputElement or null
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(!user){
      navigate('/login')
    }
    // Handle the file selected event here
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      loadFile(event);
      setPopup(true);
      // You can also handle the file here, e.g., upload it to a server or display a preview
    }
  };

  const showUploadOption = (event: any, user: any) => {
    if(event?.User?.id === user?.id){
      return true;
    }
    if(event){
      const hoursSinceEvent = (new Date().getTime() - (new Date(event?.event_original_date)).getTime()) / (1000 * 3600);   
      return hoursSinceEvent<112;
    }
    return false;
  }

  return (
    <div>
      <div>
        {event?.event_banner_url && <meta property="og:image" content={event?.event_banner_url} />}

        <Header />
        <div className="orma-page-container">

          {pageLoading && !errorPage && <div>
            <div className="loadingPage">
              <FontAwesomeIcon style={{ fontSize: '30px' }} icon={faSpinner} spin />
            </div></div>}

          {errorPage &&
            <div>
              <div className="errorPage">
                <span>There was an error loading this page.Please try again!</span>
              </div></div>}

          <div style={{background: '#eee'}}>
            {pageLoading === false && !errorPage &&
              <div>
                <div className="banner">
                  <div className="banner-overlay"></div>
                  <div className="banner-image">
                    <img
                      src={event?.event_banner_url} />
                  </div>
                </div>
                <div className="rounded-body">
                <div className="title-body">
                    <div className="rounded-profile-image">
                      <img
                        src={event?.event_profile_image_url} />
                    </div>
                    <div className="rounded-profile-info">
                      <div className="banner-text">{event?.name}</div>
                      <div className="banner-text-small">{event?.event_date} </div>
                      <div style={{ display: "flex", gap: '5px' }} className="banner-button">
                        {(user?.id === event?.userId) && <div
                          onClick={
                            
                            () => setShareModal(true)
                          }
                          style={{
                            cursor: 'pointer',
                            backgroundColor: 'black',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: '5px',
                            paddingRight: '5px',
                            borderRadius: '3px'
                          }}>
                          <Cog />
                        </div>}
                        {showUploadOption(event, user) && <><Button onClick={toggleModal} value="Upload" /> <CameraInput /></>}
                      </div>
                    </div>
                  </div>
                  <div className="menu">
                    <div style={{ borderBottom: grid ? '2px solid #000' : '' }} onClick={() => setNav('grid')}>
                      <span style={{ color: grid ? '#000' : '#444242' }}>
                        Live Feed
                      </span>
                    </div>
                    <div onClick={() => setNav('ormaFeed')} style={{ color: ormaFeed ? '#000' : '#444242', borderBottom: ormaFeed ? '2px solid #000' : '' }}>Timeline</div>
                    {/* <div onClick={() => setNav('vertical')} style={{color: vertial ? '#000': '#444242', borderBottom: vertial ? '2px solid #000' : '' }}>Vertical Feed </div> */}
                    <div onClick={() => setNav('vertical')} style={{ color: vertial ? '#000' : '#444242', borderBottom: vertial ? '2px solid #000' : '' }}>Our Orma</div>
                  </div>
                </div>
                <div className="body">
                  <ImageProcessor event_hash={event?.event_hash ?? ''} />
                  {/* grid view */}
                  {isVisible && (
                    <>
                      {showFloats && <span>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleChange}
                            style={{ display: 'none' }} // Hide the file input
                            ref={fileInputRef}
                          />
                          <button
                            ref={cameraRef}
                            className="camera-circle"
                            onClick={handleClick}>
                            <Camera />
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={toggleModal}
                            className="upload-circle"
                            ref={uploadRef}>
                            <UploadSvg />
                          </button>
                        </div></span>}
                      {showUploadOption(event, user) && <button onClick={openFloat} className="add-photos-cicle">
                        <Plus />
                      </button>}</>
                  )}
                  {grid && <LiveFeed />}
                  {ormaFeed && <MainOrmaFeed {...event} />}
                  {vertial && <div
                  style={{display:'flex', justifyContent:'center', alignItems:'center'}}
                  >Coming soon</div>}
                </div>
              </div>
            }</div>
        </div>
        {showModal && <div>
          <div className="modal-cover" onClick={toggleModal}></div>
          <div id="slide-in-element" className="bottom-tab-container">
            <div onClick={toggleModal} className="modal-close"><FontAwesomeIcon icon={faClose} style={{ fontSize: '18' }} /></div>
            <div className="uploadContent"><UploadPage /></div>
            {/* <div className="tab" id="tab1">
                <FontAwesomeIcon icon={faHouse} /> 
                <div><span style={{fontSize:'12px'}}>HOME</span>
                </div>
            </div>
            <div className="tab" id="tab3">
                <FontAwesomeIcon icon={faImages} /> 
                
            </div>
            <div className="tab" id="tab_add_image">
                <FontAwesomeIcon icon={faCirclePlus} /> 
            </div>
            <div className="tab" id="tab3">
                <FontAwesomeIcon icon={faCog} /> 
            </div>
            <div className="tab" id="tab2">
                <FontAwesomeIcon icon={faUser} /> 
            </div> */}
          </div></div>}
        {popup && <div>
          <div className="modal-cover" onClick={toggleModal}></div>
          <div id="slide-in-element" className="bottom-tab-container">
            <div onClick={togglePopup} className="modal-close"><FontAwesomeIcon icon={faClose} style={{ fontSize: '18' }} /></div>
            <div className="uploadContent"> <Upload
              setShow={setShow}
              uploadToEvent={uploadToEvent}
              errorMessage={errorMessage}
              uploadingProgress={uploadingProgress}
              upload={upload}
              description={1}
              images={images}
              videos={videos}
              photoCategories={photoCategories}
            /></div>

          </div></div>}
      </div>
       {/* BAD CODE: TODO: Needs to fix this */}
        <div className="coveronMobile">
          {shareModal && <PopupModal
          setShareModal={setShareModal}>
          <ShareModal
            openEditModal={setEditmodal}
            closeShareModal={setShareModal}
            title={event?.name ?? ""}
          />
          </PopupModal>}
        </div>
      {shareModal && <div>
        <div className="modal-cover"></div>
        <div id="slide-in-share-element" className="bottom-share-container">
          <div onClick={() => setShareModal(!shareModal)} className="modal-close"><FontAwesomeIcon icon={faClose} style={{ fontSize: '18' }} /></div>
          <ShareModal
            openEditModal={setEditmodal}
            closeShareModal={setShareModal}
            title={event?.name ?? ""}
          />
        </div></div>}
        
      <EditOrmaSettings
        currentBannerImage={event?.event_banner_url}
        currentDate={event?.event_date}
        currentName={event?.name}
        currentOrmaImage={event?.event_profile_image_url}
        editModal={editModal}
        eventHash={event?.event_hash}
        setEditModal={setEditmodal}
      />
    </div>

  );
};

export default Home;