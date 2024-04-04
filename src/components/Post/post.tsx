import "./style.css";
import 'react-phone-number-input/style.css';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { deletePost, fetchEvent } from "../home/services/homeApi";
import { faComment, faHeart, faSpinner, faUser, faTrash } from '@fortawesome/free-solid-svg-icons';
import {useNavigate, useParams} from 'react-router-dom'

import Comments from './Comments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from "../Header/header";
import PopUp from '../PopUp/PopUp';
import PopupModal from "../PopUpModal/PopupModal";
import PopupModalTwo from "../PopUpModal/PopupModalTwo";

import moment from 'moment';
import { useEventPage } from '../../context/auth/EventContext';
import usePost from './hooks/usePost';

interface RouteParams {
  event_hash: string;
}

const Post: React.FC = () => {
  // const { scrollPost, loading, error, handleDoubleClick, handleClick, showHeart, showPopup, setShowPopup, state, user , event_hash, comments ,addComment } = usePost();
  const { scrollPost, loading, error, handleDoubleClick, handleClick, showHeart, showPopup, setShowPopup, localPost, addComment, user, updateComment, removeComment, getallComments, endOfPostsRef, containerRef, currentPost} = usePost();

  const imageRef = useRef<HTMLImageElement | null>(null);
  const [commentRef, setCommentRef] = useState<number | null>(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [deletePopup, setDeletePopup] = useState<boolean>(false)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const navigate = useNavigate();

  const getTime = (time: string) => {
    console.log(time, "TIME")
    const someTimeInThePast: moment.Moment = moment(time);
    const relativeTime: string = someTimeInThePast.fromNow();
    return relativeTime;
  }
 
  const toggleCommentInput = (post_id: number) => {
    if(!user){
      setShowPopup(true)
    }
    setShowCommentInput(true);
    setCommentRef(post_id)
  }

  useEffect(() => {
    if (!imageRef.current) return;
    const lazyImage = imageRef.current;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            lazyImage.src = lazyImage.dataset.src || '';
            observer.unobserve(lazyImage);
          }
        });
      },
      { rootMargin: '0px 0px -100px 0px' }
    );

    observer.observe(lazyImage);

    return () => {
      observer.disconnect();
    };
  }, [scrollPost]);


    // Create a state to hold refs for each image
    const [scrollImageRefs, setScrollImageRefs] = useState<React.RefObject<HTMLImageElement>[]>([]);
    
    useEffect(() => {
      // Initialize an array of refs
      setScrollImageRefs(scrollPost.map(() => React.createRef<HTMLImageElement>()));
    }, [scrollPost]);
  
    useEffect(() => {
      if (scrollPost && scrollPost.length > 0) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const lazyImage = entry.target as HTMLImageElement; // Type assertion here
                lazyImage.src = lazyImage.dataset.src || '';
                observer.unobserve(lazyImage);
              }
            });
          },
          { rootMargin: '0px' }
        );
  
        scrollImageRefs.forEach((ref) => {
          if (ref.current) {
            observer.observe(ref.current);
          }
        });
  
        return () => observer.disconnect();
      }
    }, [scrollPost, scrollImageRefs]);
    
    useEffect(() => {
      if (!imageRef.current) return;
      const lazyImage = imageRef.current;
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              lazyImage.src = lazyImage.dataset.src || '';
              observer.unobserve(lazyImage);
            }
          });
        },
        { rootMargin: '0px 0px -100px 0px' }
      );
  
      observer.observe(lazyImage);
  
      return () => {
        observer.disconnect();
      };
    }, [localPost]);

    const postDeleteHandler = async (event_hash: string, id: number) => {
      setDeleteLoading(true)
      const deleteLocalPostResponse = await deletePost(event_hash, id)
      if(deleteLocalPostResponse?.error) {
        setDeleteLoading(false)
        alert(`Error: ${error}`)
        setDeletePopup(false)
      }
      else {
        setDeleteLoading(false)
        // alert("Post deleted successfully!")
        setDeletePopup(false)
        navigate(`/${event_hash}`)
        window.location.reload();
      }
      setDeletePostData(null);
    }

    const [deletePostData, setDeletePostData] = useState<any | null>(null);

    const deletePostCurrent = (event_hash: string, id: number) => {
      setDeletePostData({
        event_hash: event_hash,
        id: id,
      })
      setDeletePopup(true)

    }


  return (
    <div>
      <Header back={true} />
      {showPopup && <PopUp message="You must be logged in to do this action" showPopup={showPopup} setShowPopup={setShowPopup} />}
      <div className="postViewPage">
        {error && <p>{error}</p>}
        {loading && <div>
          <div className="loadingPage">
            <FontAwesomeIcon style={{ fontSize: '40px' }} icon={faSpinner} spin />
          </div></div>}
        <div>


      {/* 
          WHEN USER LOADS PAGE FROM CONTEXT 
          TODD: Needs to move it out here 
      
      */}
      <div ref={containerRef}>
        {!error && !loading && !localPost && scrollPost.map((post: any, index: number) => (
        <div>
            <div className="posts">
              <div className="localPost-header">
                <div className="first-row">
                  <div><FontAwesomeIcon icon={faUser} style={{color: "#000000", fontSize: '18px'}} /></div>
                  <div className="first-row-name">{post.user?.name}</div>
                </div>
              </div>
              <div className='image-container' onDoubleClick={() => handleDoubleClick(post?.id)}>
                { post?.id === currentPost && showHeart && <div className="like-cover">
                  <FontAwesomeIcon
                    style={{
                      fontSize: '3em',
                      color: '#fff',
                      textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                      animation: 'scaleAndFade 1s forwards'
                    }}
                    icon={faHeart} />
                </div>}
                <img
                  key={index}
                  ref={scrollImageRefs[index]}
                  data-src={post.image_url}
                  src={post.compressed_url}
                  // You can use a thumbnail or low-quality image placeholder here
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  className="grid_image" // "lazy" class to style the loading effect if needed
                />
              </div>
              {deletePopup && deletePostData && 
              <PopupModalTwo setShareModal={setDeletePopup}>
                <div style={{padding: "10px 10px", textAlign: 'center'}}><h3>Warning!</h3> <p>This will delete the post permanently</p></div>
                <div style={{padding: "10px 10px", display: "flex", gap: "20px", justifyContent: "center"}}>
                  {deleteLoading && <FontAwesomeIcon style={{ fontSize: '40px' }} icon={faSpinner} spin />}
                  {!deleteLoading && <><span className="delete-popup-button" onClick={() => postDeleteHandler(deletePostData?.event_hash, deletePostData?.id)}>Delete</span>
                  <span className="delete-popup-button" onClick={() => {setDeletePopup(false)}}>Cancel</span></>}
                </div>
              </PopupModalTwo>}
              <div className="reactions">
                {post && <div className="name">
                    <div className="like-section">
                        <div><b>{post?.Likes?.length}</b></div> &nbsp; <div className='heart-icon' onClick={() => handleClick(post?.id)}><FontAwesomeIcon icon={faHeart} /></div>
                      <div> &nbsp; &nbsp;</div> &nbsp; <div className='heart-icon' onClick={() => toggleCommentInput(post?.id)}><FontAwesomeIcon icon={faComment} /></div> 
                      <div style={{marginLeft: 'auto'}}>
                        {(user && (post?.User?.id === user.id) || (post?.Event?.userId === user?.id)) && <span onClick={() => deletePostCurrent(post?.event_hash, post?.id)}><FontAwesomeIcon style={{ fontSize: '15px' }} icon={faTrash} /></span>}
                      </div>
                    </div>      
                  
                  <div className="name-time">{getTime(post?.createdAt)}</div>
                </div>}
                <Comments commentRef={commentRef} getallComments={getallComments} removeComment={removeComment} updateComment={updateComment} user={user} addComment={addComment} showCommentInput={showCommentInput} showPopup={showPopup} toggleCommentInput={toggleCommentInput} post={post} />
                {/* <Comments /> */}
                {/* {localPost && } */}
              </div>
              <div className="localPost-description">
              </div>
            </div>
        </div>
        ))}
        <div ref={endOfPostsRef} className="end-of-posts"></div> {/* Add this line */}

      </div>
      {/* 
          WHEN USER LOADS PAGE DIRECTLY 
          TODD: Needs to move it out here 
      */}
      {!error && !loading && localPost && <div>
          <div className="posts">
          {deletePopup && 
        <PopupModalTwo  setShareModal={setDeletePopup}>
          <div style={{padding: "10px 10px", textAlign: 'center'}}><h3>Warning!</h3> <p>This will delete the post permanently</p></div>
          <div style={{padding: "0px 10px", display: "flex", gap: "20px", justifyContent: "center"}}>
            {deleteLoading && <FontAwesomeIcon style={{ fontSize: '40px' }} icon={faSpinner} spin />}
            {!deleteLoading && <><span className="delete-popup-button" onClick={() => postDeleteHandler(localPost?.event_hash, localPost?.id)}>Delete</span>
            <span className="delete-popup-button" onClick={() => {setDeletePopup(false)}}>Cancel</span></>}
          </div>
        </PopupModalTwo>}
            <div className="localPost-header">
              <div className="first-row">
                <div><FontAwesomeIcon icon={faUser} style={{color: "#000000", fontSize: '18px'}} /></div>
                <div className="first-row-name">{localPost.user?.name}</div>
              </div>
            </div>
            <div className='image-container' onDoubleClick={() => handleDoubleClick(localPost?.id)}>
              {localPost?.id === currentPost && showHeart && <div className="like-cover">
                <FontAwesomeIcon
                  style={{
                    fontSize: '3em',
                    color: '#fff',
                    textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                    animation: 'scaleAndFade 1s forwards'
                  }}
                  icon={faHeart} />
              </div>}
              <img
                ref={imageRef}
                data-src={localPost.image_url}
                src={localPost.compressed_url}
                // You can use a thumbnail or low-quality image placeholder here
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                className="grid_image" // "lazy" class to style the loading effect if needed
              />
            </div>
            <div className="reactions">
              {localPost && <div className="name">
                  <div className="like-section">
                      <div><b>{localPost?.Likes?.length}</b></div> &nbsp; <div className='heart-icon' onClick={() => handleClick(localPost?.id)}><FontAwesomeIcon icon={faHeart} /></div>
                    <div> &nbsp; &nbsp;</div> &nbsp; <div className='heart-icon' onClick={() =>  toggleCommentInput(localPost?.id)}><FontAwesomeIcon icon={faComment} /></div> 
                    <div style={{marginLeft: 'auto'}}>
                      {(user && (localPost?.User?.id === user.id) || (localPost?.Event?.userId === user?.id)) && <span onClick={() => setDeletePopup(true)}><FontAwesomeIcon style={{ fontSize: '15px' }} icon={faTrash} /></span>}
                    </div>
                  </div>      
                
                <div className="name-time">{getTime(localPost?.createdAt)}</div>
              </div>}
              <Comments commentRef={commentRef}  getallComments={getallComments} removeComment={removeComment} user={user} toggleCommentInput={toggleCommentInput} addComment={addComment} showPopup={showPopup} showCommentInput={showCommentInput} post={localPost} updateComment={updateComment}  />
              {/* <Comments showCommentInput={showCommentInput} showPopup={showPopup} /> */}
              {/* {localPost && } */}
            </div>
            <div className="localPost-description">
            </div>
          </div>
      </div>}


    </div>  
      </div>
    </div>

  );
};

export default Post;