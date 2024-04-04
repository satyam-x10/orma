import React, { useContext, useRef, useState} from 'react';
import Button from '../Button';
import useUpload from '../upload/hooks/useUpload';
import Upload from '../upload/upload';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faCamera} from '@fortawesome/free-solid-svg-icons'
import AuthContext from '../../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function CameraInput() {
  // Explicitly type the ref as HTMLInputElement
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [popup, setPopup] = useState(false);
  const {user} = useContext(AuthContext)
  const navigate = useNavigate()
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
  

  
  const toggleModal = () => {
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

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        style={{ display: 'none' }} // Hide the file input
        ref={fileInputRef}
      />
      <div style={{
        background: "#000",
        borderRadius:'3px'
      }} onClick={handleClick}>
        <FontAwesomeIcon icon={faCamera} style={{fontSize: '17', color: '#fff', padding: '7px'}}/>
      </div>
      
      
      {popup && <div>
      <div className="modal-cover" onClick={toggleModal}></div>
      <div id="slide-in-element" className="bottom-tab-container">
      <div onClick={toggleModal} className="modal-close"><FontAwesomeIcon icon={faClose} style={{fontSize: '18'}}/></div>
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
     </div></div> } 
    </div>
  );
}

export default CameraInput;
