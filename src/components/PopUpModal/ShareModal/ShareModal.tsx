
import React, { SetStateAction, useRef,useState, useEffect } from 'react'
        
import { QRCode } from 'react-qrcode-logo';
import { useLocation } from 'react-router-dom';
import './style.css'
import WhiteCog from '../../../assets/svgs/whitecog';
import {CopyToClipboard} from 'react-copy-to-clipboard';

type Props={
    openEditModal:React.Dispatch<SetStateAction<boolean>>
    closeShareModal:React.Dispatch<SetStateAction<boolean>>
    title:string,
}

function ShareModal({openEditModal,closeShareModal, title }:Props) {
    const downloadRef = useRef() as any;
    const { pathname } = useLocation();
    const [copy, setCopy] = useState('COPY PRIVATE URL');
    const [share, setShare] = useState(false);


    useEffect(() => {
        //@ts-ignore
       if(navigator.share){
        setShare(true);
       }else{

       }
    }, [])

        const run = async () => {
            if (navigator.share) {
                setShare(true)
                try {
                  await navigator.share({
                    title: title, // Correct property
                    text: 'You can upload content to ' +title+ ' Orma', // Correct property
                    url: `${window.location.origin}${location.pathname}`, // Correct property
                    // files: [file], // Optional, only in supported browsers and conditions
                  });
                } catch (error) {
                  console.error('Error sharing content:', error);
                }
              } else {
                console.log('Web Share API is not supported in this browser.');
              }
        }
    
    const download = () => {
        const canvasElement = document.querySelector('.qrcodecover canvas');
        // Explicitly cast the element to HTMLCanvasElement
        if (canvasElement instanceof HTMLCanvasElement) {
            const url = canvasElement.toDataURL('image/png');
            
            // Create a temporary link to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'QRCode.png'; // Setting the file name for download
            document.body.appendChild(link); // Append link to body
            link.click(); // Simulate click to trigger download
            document.body.removeChild(link); // Remove link after triggering download
        } else {
            console.error('Canvas element not found');
        }
    };

    const fullUrl = `${window.location.origin}${location.pathname}`;
    const qrValue = `${fullUrl}`;
    return (
        <div className='share-container'>
            <div className="qrcodecover" style={{padding: '15px;'}}>
                    {qrValue && <QRCode
                        qrStyle='dots'
                        size={150}
                        value={qrValue}
                        eyeRadius={5}
                        // viewBox={`0 0 256 256`}
                    />}
                </div>
            <div className='share-top'>
                <div className='share-inner'>
                    <h4>SHARE THIS ORMA WITH OTHERS</h4>
                    <div
                        className='share-right'>
                        {share && 
                        <button
                        onClick={run}
                        className='btn'
                        >SHARE PRIVATE URL</button>}
                        {!share && <CopyToClipboard
                        text={qrValue}
                        onCopy={() => setCopy("COPIED URL!")}
                        >
                        <button
                        className='btn'
                        >{copy }</button>
                        </CopyToClipboard>}
                        
                        <a
                           className='downloadQr'
                            ref={downloadRef}
                            onClick={download}
                        >
                            DOWNLOAD QR
                        </a></div>
                    <p>THIS ORMA IS PRIVATE, ONLY PEOPLE WITH LINK OR QR CODE CAN ACCESS THIS PAGE</p>
                </div>
            </div>
            <div 
            onClick={()=>{
                closeShareModal(false)
                openEditModal(true)}
            }
            className='share-footer'>
                <WhiteCog/><p style={{marginLeft:'10px', fontWeight: '100', fontSize:'14px',cursor:'pointer'}}>EDIT THIS ORMA</p>
            </div>
        </div>
    )
}

export default ShareModal