import React, { SetStateAction } from 'react'
import './style.css'

type ModalTypes ={
    children:any,
    setShareModal:React.Dispatch<SetStateAction<boolean>>
}

function PopupModal({setShareModal,children}:ModalTypes) {

    const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };
    return (
        <div
        onClick={()=>setShareModal(false)}
        className='popup-modal-backdrop'>
            <div 
            onClick={handleContainerClick}
            className='popup-modal-container'>
                <div 
                onClick={()=>setShareModal(false)}
                style={{
                    position:'absolute',
                    right:'20px',
                    top:'10px',
                    cursor:'pointer'
                }}>
                    <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 3L3 9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M3 3L9 9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                {children}
            </div>
        </div>
    )
}

export default PopupModal