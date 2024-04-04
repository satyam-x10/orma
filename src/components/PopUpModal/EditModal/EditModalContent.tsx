import React, { SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faClose, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './style.css'
import useUpdate from '../../home/hooks/useUpdate';

type Props = {
    setImageModal: React.Dispatch<SetStateAction<boolean>>,
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    imagePreview: string,
    imageLabel: string,
    setEditModal: React.Dispatch<SetStateAction<boolean>>,
    setDetailsEdit: React.Dispatch<SetStateAction<boolean>>,
    error: string,
    eventName: any,
    eventBanner: string,
    eventHash: any,
    eventProfileImage: string,
    eventDate: any
}

function EditModalContent({ setImageModal, handleImageChange, error, imagePreview, imageLabel, setEditModal, setDetailsEdit, eventName, eventBanner, eventHash, eventProfileImage, eventDate }: Props) {

    const { loading, updateOrmaDetails } = useUpdate()

    return (
        <div className='edit-modal-content-container'>
            <div
                className='icon-back'
                onClick={() => {
                    setImageModal(false)
                    setDetailsEdit(true)
                }}><FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '18' }} /></div>
            <div
                className='modal-close-bottom-image'
                onClick={() => {
                    setImageModal(false)
                }}><FontAwesomeIcon icon={faClose} style={{ fontSize: '18' }} /></div>
            <p className='bottom-image-header'>Edit Orma {imageLabel} Image</p>
            <p className='bottom-image-subheader'>change your Orma {imageLabel} image</p>
            <img
                className='image-preview'
                src={imagePreview}
                alt='orma image'

            />
            <label
                htmlFor='imageInput'>
                <p className='choose-image'>
                    CHOOSE IMAGE
                </p>
                <input
                    accept="image/*"
                    type='file'
                    id='imageInput'
                    onChange={handleImageChange}
                />
            </label>
            <p
                onClick={() => {
                    updateOrmaDetails(eventName, eventDate, eventBanner, eventProfileImage, eventHash)
                }}
                className='update-image-orma'>UPDATE {imageLabel} IMAGE
                {loading ?
                    <div className="loadingSpinner-update">
                        <FontAwesomeIcon style={{ fontSize: '20px' }} icon={faSpinner} spin />
                    </div> : ''}
            </p>
            {error && <p style={{ paddingTop: '510x', textAlign: 'center' }} className="error-message">{error}</p>}
        </div>
    )
}

export default EditModalContent