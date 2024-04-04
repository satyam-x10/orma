import React, { SetStateAction, useRef, useState } from 'react'
import './style.css'
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faSpinner } from '@fortawesome/free-solid-svg-icons';
import PopupModal from '../PopupModal';
import EditModalContent from './EditModalContent';
import useUpdate from '../../home/hooks/useUpdate';


type Props = {
  currentName: string | undefined,
  currentDate: string | undefined,
  currentOrmaImage: any,
  currentBannerImage: any,
  eventHash: string | undefined,
  setEditModal: React.Dispatch<SetStateAction<boolean>>,
}

function EditModal({ currentName, currentDate, currentOrmaImage, currentBannerImage, eventHash, setEditModal }: Props) {
  
  const date = moment();
  const minDate = date.format('YYYY-MM-DD');
  const parsedDate = moment(currentDate, "dddd, MMMM Do, YYYY");
  const formattedDate = parsedDate.format("YYYY-MM-DD");

  const [ormaName, setOrmaName] = useState<string | undefined>(currentName);
  const [ormaDate, setOrmaDate] = useState(formattedDate);
  const [imageModal, setImageModal] = useState(false)
  const [bannerModal, setBannerModal] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState<any>(currentOrmaImage)
  const [banner, setBanner] = useState<any>(currentBannerImage);
  const [bannerPreview, setBannerPreview] = useState<any>(currentBannerImage);
  const [imagePreview, setImagePreview] = useState<any>(currentOrmaImage);
  const [detailsEdit, setDetailsEdit] = useState(true);
  const {updateOrmaDetails,loading,setLoading} = useUpdate()



 

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const selectedFile = e.target.files && e.target.files[0];

    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file.');
        setLoading(false)
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds the limit of 5MB.");
        setLoading(false)
        return;
      }

      if (e.target.files) {
        setError("")
        setLoading(false)
        setBannerPreview(URL.createObjectURL(e.target.files[0]));
        setBanner(e.target.files[0])
      }
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setLoading(false)
        setError('Please select an image file.');
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setLoading(false)
        setError("File size exceeds the limit of 5MB.");
        return;
      }
      if (e.target.files) {
        setLoading(false)
        setError("")
        setImagePreview(URL.createObjectURL(e.target.files[0]));
        setProfileImage(e.target.files[0]);
      }
    }
  };

  return (
    <div className='edit-modal-container'>
      <div className="modal-cover"></div>
      <div
        id="slide-in-edit-element" className="bottom-image-container">
          
        <div
          onClick={() => setEditModal(false)}
          className="modal-close-bottom-image"><FontAwesomeIcon icon={faClose} style={{ fontSize: '18' }} /></div>
        {loading ?
                <div>
                    <div className="loadingPage">
                        <FontAwesomeIcon style={{ fontSize: '30px' }} icon={faSpinner} spin />
                    </div>
                </div>:imageModal ? <EditModalContent
            eventBanner={banner}
            eventDate={ormaDate}
            eventHash={eventHash}
            eventName={ormaName}
            eventProfileImage={profileImage}
          error={error}
          setDetailsEdit={setDetailsEdit}
          imageLabel='profile'
          setImageModal={setImageModal}
          imagePreview={imagePreview}
          handleImageChange={handleProfileImageChange}
          setEditModal={setEditModal}
        /> : bannerModal ? <EditModalContent
        eventBanner={banner}
        eventDate={ormaDate}
        eventHash={eventHash}
        eventName={ormaName}
        eventProfileImage={profileImage}
          error={error}
          setDetailsEdit={setDetailsEdit}
          imageLabel='banner'
          setImageModal={setBannerModal}
          imagePreview={bannerPreview}
          handleImageChange={handleBannerChange}
          setEditModal={setEditModal}
        /> : <>
          <p className='edit-modal-heading'>Update This Orma</p>
          <p className='edit-modal-subheading'>change your orma settings below</p>
          <input
            type='text'
            value={ormaName}
            onChange={(e) => setOrmaName(e.target.value)}
          />
          <input
            type='date'
            style={{ outlineColor: 'black', borderColor: 'black' }}
            min={minDate}
            value={ormaDate}
            onChange={(e) => setOrmaDate(e.target.value)}
            className="create-event-input"
          />

          <button
            onClick={() => updateOrmaDetails(ormaName, ormaDate, banner, profileImage, eventHash)}
            className='update-orma'>UPDATE ORMA</button>

          <div className='edit-modal-footer'>
            <button className='update-banner'
              onClick={() => {
                setDetailsEdit(false)
                setBannerModal(true)
              }}
            >UPDATE BANNER</button>
            <button
              onClick={() => {
                setDetailsEdit(false)
                setImageModal(true)
              }}
              className='update-image'>UPDATE ORMA IMAGE</button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </>}
      </div>

      {imageModal ? <PopupModal
            setShareModal={setEditModal}
          >
            <EditModalContent
              eventBanner={banner}
              eventDate={ormaDate}
              eventHash={eventHash}
              eventName={ormaName}
              eventProfileImage={profileImage}
              error={error}
              setDetailsEdit={setDetailsEdit}
              imageLabel='profile'
              setImageModal={setImageModal}
              imagePreview={imagePreview}
              handleImageChange={handleProfileImageChange}
              setEditModal={setEditModal}
            />
          </PopupModal> :
          bannerModal ?
            <PopupModal
            setShareModal={setEditModal}
            >
              <EditModalContent
                eventBanner={banner}
                eventDate={ormaDate}
                eventHash={eventHash}
                eventName={ormaName}
                eventProfileImage={profileImage}
                error={error}
                setDetailsEdit={setDetailsEdit}
                imageLabel='banner'
                setImageModal={setBannerModal}
                imagePreview={bannerPreview}
                handleImageChange={handleBannerChange}
                setEditModal={setEditModal}
              />
            </PopupModal>
            : (<PopupModal
              setShareModal={setEditModal}
            ><div>
              <p className='edit-modal-heading'>Update This Orma</p>
              <p className='edit-modal-subheading'>change your orma settings below</p>
              <input
                type='text'
                value={ormaName}
                onChange={(e) => setOrmaName(e.target.value)}
              />
              <input
                type='date'
                style={{ outlineColor: 'black', borderColor: 'black' ,width:'93%'}}
                min={minDate}
                value={ormaDate}
                onChange={(e) => setOrmaDate(e.target.value)}
                className="create-event-input"
              />

              <button
                onClick={() => updateOrmaDetails(ormaName, ormaDate, banner, profileImage, eventHash)}
                className='update-orma'>UPDATE ORMA {loading ?
                  <div className="loadingSpinner-update">
                      <FontAwesomeIcon style={{ fontSize: '20px' }} icon={faSpinner} spin />
                  </div>:''}</button>

              <div className='edit-modal-footer'>
                <button className='update-banner'
                  onClick={() => {
                    setDetailsEdit(false)
                    setBannerModal(true)
                  }}
                >UPDATE BANNER</button>
                <button
                  onClick={() => {
                    setDetailsEdit(false)
                    setImageModal(true)
                  }}
                  className='update-image'>UPDATE ORMA IMAGE</button>
            
              </div>
            </div>
            </PopupModal>)}
    </div>
  )
}

export default EditModal;