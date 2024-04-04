import React, { SetStateAction, useState } from 'react'
import PopupModal from '../PopUpModal/PopupModal'
import EditModal from '../PopUpModal/EditModal/EditModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

type Props = {
    editModal:boolean;
    setEditModal:React.Dispatch<SetStateAction<boolean>>,
    eventHash:string | undefined,
    currentName:string | undefined,
    currentBannerImage:string | undefined,
    currentDate:string | undefined,
    currentOrmaImage:string | undefined
}

function EditOrmaSettings({ editModal, setEditModal, eventHash, currentName, currentDate, currentBannerImage, currentOrmaImage }:Props) {
    return (
        <>
  {/* //edit modal for desktop */}
            {editModal &&
            <div className='edit-modal-desktop'>
                <PopupModal
                setShareModal={setEditModal}
            >
                <EditModal
                    setEditModal={setEditModal}
                    eventHash={eventHash}
                    currentName={currentName}
                    currentDate={currentDate}
                    currentBannerImage={currentBannerImage}
                    currentOrmaImage={currentOrmaImage}
                />
            </PopupModal>
            </div>
            }
            
            
    {/* //edit modal for mobile */}
            {editModal && <div className='mobile-edit-modal'>
                    <EditModal
                    setEditModal={setEditModal}
                        eventHash={eventHash}
                        currentName={currentName}
                        currentDate={currentDate}
                        currentBannerImage={currentBannerImage}
                        currentOrmaImage={currentOrmaImage}
                    />
                </div>
            }
        </>
    )
}

export default EditOrmaSettings