import './style.css';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useImageStatus } from './hooks/useImageStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import CrossIcon from '../cross-icon/CrossIcon';
import CheckIcon from '../check-icon/check-icon';
import PopupModal from "../PopUpModal/PopupModal";
import PopupModalTwo from "../PopUpModal/PopupModalTwo";

import React, { useState, useContext, useEffect } from "react";
import { deletePost, getFlaggedPosts, updatePost } from '../home/services/homeApi';
import PostContext from '../../context/auth/PostContext';
import { ImageProcessorProps, NudityFlaggedPost, Post, PostContextProps } from '../../types';
import NudityFlaggedContext from '../../context/auth/NudityFlaggedContext';
import Button from '../Button';

const ImageProcessor = ({ event_hash }: { event_hash: string }) => {

    const { processingPost, loading } = useImageStatus();
    const [deletePopup, setDeletePopup] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [approveLoading, setApproveLoading] = useState<boolean>(false);
    const [approvePopup, setApprovePopup] = useState<boolean>(false);
    const [postIdToDelete, setPostIdToDelete] = useState<number | null>(null);
    const [postIdToApprove, setPostIdToApprove] = useState<string | null>('');
    const postContext = useContext(PostContext) as PostContextProps;
    const { removeProcessingPost } = postContext;
    // const ImageProcessorContext = useContext(NudityFlaggedContext) as ImageProcessorProps;
    // const { approvePost, fetchFlaggedPosts, } = ImageProcessorContext;
    // const [flaggedPosts, setFlaggedPosts] = useState<NudityFlaggedPost[]>([]);
    const { flaggedPosts, approvePost, rejectPost, setFlaggedPosts } = useContext(NudityFlaggedContext) as ImageProcessorProps;
    const [showNudeImage, setShowNudeImage] = useState<NudityFlaggedPost | null>(null);

    useEffect(() => {
        if(!event_hash) return;
        const fetchFlaggedPosts = async () => {
            const response = await getFlaggedPosts(event_hash);
            if (response.status === 200) {
                setFlaggedPosts(response.data.data);
            }
        }
        fetchFlaggedPosts();
    }, [event_hash]);

    // useEffect(() => {
    //     fetchFlaggedPosts(event_hash)
    //     // setFlaggedPosts();
    // }, [event_hash]);

    const postDeleteHandler = async (postId: number) => {
        setDeleteLoading(true);
        const deleteLocalPostResponse = await deletePost(event_hash, postId);
        if (deleteLocalPostResponse?.error) {
            setDeleteLoading(false);
            setDeletePopup(false);
        } else {
            setDeleteLoading(false);
            setDeletePopup(false);
            removeProcessingPost(postId);
            setFlaggedPosts(flaggedPosts.filter(post => post.id !== postId));
        }
    };

    const postApproveHandler = async (postId: string) => {
        setApproveLoading(true);
        const response = await updatePost(event_hash, postId);
        if (response?.error) {
            setApproveLoading(false);
            setApprovePopup(false);
        } else {
            setApproveLoading(false);
            setApprovePopup(false);
            approvePost(event_hash, postId);
            setFlaggedPosts(flaggedPosts.filter(post => post.id !== Number(postId)));
        }
    }

    const imagePopup = (post: NudityFlaggedPost) => {
        setShowNudeImage(post);
    }

    return (
        <div>
            {showNudeImage && <div>
        <div
        onClick={()=>setShowNudeImage(null)}
        className='popup-modal-backdrop-2'>
            <div 
            className='popup-modal-container-2'>
                <div 
                    onClick={()=>setShowNudeImage(null)}
                    style={{
                        cursor:'pointer',
                        float: 'right'
                    }}>
                    <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 3L3 9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M3 3L9 9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <img src={showNudeImage?.image_url} width={"100%"}/>
                <div style={{display: 'flex', gap: '10px', justifyContent: 'center', padding: '10px'}}>
                    <Button value="Approve" onClick={() => {
                                        setPostIdToApprove(String(showNudeImage.id));
                                        setApprovePopup(true);
                                        }} />
                <Button value="Reject" onClick={() => {
                                            setPostIdToDelete(showNudeImage.id);
                                            setDeletePopup(true);
                                        }} />
                </div>
            </div>
        </div></div>}
            {deletePopup && (
                <PopupModalTwo setShareModal={setDeletePopup}>
                    <div style={{ padding: "10px 0px", textAlign: 'center' }}>
                        <h3>Warning! </h3>
                        <p>This will delete the post. <br />Are you sure?</p>
                    </div>
                    <div
                        style={{
                            padding: "10px 10px",
                            display: "flex",
                            gap: "20px",
                            justifyContent: "center",
                        }}
                    >
                        {deleteLoading && (
                            <FontAwesomeIcon
                                style={{ fontSize: "40px" }}
                                icon={faSpinner}
                                spin
                            />
                        )}
                        {!deleteLoading && (
                            <>
                                <span
                                    className="delete-popup-button"
                                    onClick={() => postDeleteHandler(postIdToDelete!)}
                                >
                                    Yes
                                </span>
                                <span
                                    className="delete-popup-button"
                                    onClick={() => {
                                        setDeletePopup(false);
                                    }}
                                >
                                    Cancel
                                </span>
                            </>
                        )}
                    </div>
                </PopupModalTwo>
            )}
            {approvePopup && (
                <PopupModalTwo setShareModal={setApprovePopup}>
                    <div style={{ padding: "10px 0px", textAlign: 'center' }}>
                        <h3>Warning! </h3>
                        <p>Are you sure you want to accept the post?</p>
                    </div>
                    <div
                        style={{
                            padding: "10px 10px",
                            display: "flex",
                            gap: "20px",
                            justifyContent: "center",
                        }}
                    >
                        {approveLoading && (
                            <FontAwesomeIcon
                                style={{ fontSize: "40px" }}
                                icon={faSpinner}
                                spin
                            />
                        )}
                        {!approveLoading && (
                            <>
                                <span
                                    className="delete-popup-button"
                                    onClick={() => postApproveHandler(String(postIdToApprove!))}
                                >
                                    Yes
                                </span>
                                <span
                                    className="delete-popup-button"
                                    onClick={() => {
                                        setApprovePopup(false);
                                    }}
                                >
                                    Cancel
                                </span>
                            </>
                        )}
                    </div>
                </PopupModalTwo>

            )}
            {!loading && processingPost?.posts !== null && processingPost?.posts.length > 0 &&
                <div className="image-processor">
                    <div className="image-processor-title">Processing Status ({processingPost?.posts.length})</div>
                    <div className="image-processor-box">
                        {!loading && processingPost?.posts?.map((post, key) =>
                            <div key={key} style={{ position: "relative" }}>
                                <div className="image-processor-overlay">
                                    {post?.status === 'READYFORPROCESSING' && <FontAwesomeIcon style={{ color: '#f4f4f4', fontSize: '25px' }} icon={faSpinner} spin />}
                                    {post?.status !== 'READYFORPROCESSING' && <FontAwesomeIcon style={{ color: '#e74c3c', fontSize: '25px' }} icon={faTriangleExclamation} />}
                                </div>
                                <div style={{ position: "relative" }}>
                                    <LazyLoadImage className='image-processor-image' src={post.image_url} />
                                    <CrossIcon
                                        style={{
                                            position: 'absolute',
                                            top: -8,
                                            right: -14,
                                            zIndex: 1,
                                        }}
                                        onClick={() => {
                                            setPostIdToDelete(post.id);
                                            setDeletePopup(true);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                        {loading && <div>
                            <div className="loadingPage">
                                <FontAwesomeIcon style={{ fontSize: '60px' }} icon={faSpinner} spin />
                            </div>
                        </div>}
                    </div>
                </div>
            }
            {flaggedPosts.length > 0 &&
                <div className="image-processor">
                    <div className="image-processor-title">NSFW Content({flaggedPosts.length})</div>
                    <div className="image-processor-box">
                        {flaggedPosts.map((post, key) =>
                            <div  key={key} style={{ position: "relative" }}>
                                <div className="image-processor-overlay">
                                    {post?.status === 'FAILEDBYNUDITY' && <FontAwesomeIcon onClick={() => imagePopup(post)} style={{ color: '#e74c3c', fontSize: '25px' }} icon={faTriangleExclamation} />}
                                </div>
                                <div style={{ position: "relative" }}>
                                    <LazyLoadImage className='image-processor-image' src={post.image_url} />
                                    <CrossIcon
                                        style={{
                                            position: 'absolute',
                                            top: -8,
                                            right: -14,
                                            zIndex: 1,
                                        }}
                                        onClick={() => {
                                            setPostIdToDelete(post.id);
                                            setDeletePopup(true);
                                        }}
                                    />
                                    <CheckIcon
                                        style={{
                                            position: 'absolute',
                                            top: -10,
                                            left: -4,
                                            zIndex: 1,
                                        }}
                                        onClick={() => {
                                            setPostIdToApprove(String(post.id));
                                            setApprovePopup(true);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    )
}

export default ImageProcessor;
