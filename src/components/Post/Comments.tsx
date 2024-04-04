import React, { useContext, useEffect, useState, useRef } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import usePost from './hooks/usePost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faSpinner, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { AxiosResponse } from 'axios';
import Button from '../Button';
import {getTime} from '../../helper';
import PopupModal from "../PopUpModal/PopupModal";

interface CommentProps {
  showPopup: boolean;
  addComment: (event_hash: string, id: number, commentText: string) => Promise<any>;
  showCommentInput: boolean;
  post: any;
  toggleCommentInput: (post_id: number) => void;
  user: any;
  updateComment: (comment_id: number , content: string , user_id:number, post_id: number, event_hash: string) => any;
  removeComment: (comment_id: number , user_id:number, event_hash: string, post_id: number) => any;
  getallComments: (event_hash:string, id: number) => any;
  commentRef: any
}

///const Comments: React.FC<CommentProps> = ({ showPopup, addComment, showCommentInput}) => {
const Comments: React.FC<CommentProps> = ({ post, showCommentInput, showPopup, addComment, toggleCommentInput, user, updateComment, removeComment, getallComments, commentRef }) => {

  // const { user } = useContext(AuthContext);
  const [commentText, setCommentText] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeletingIndex] = useState<number | null>(null);

  const [editedContent, setEditedContent] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const [trackViewall, setTrackViewall] = useState<any>({});

  const [deletePopup, setDeletePopup] = useState(false);

  useEffect(() => {
    if (editInputRef.current && editingIndex !== null) {
      editInputRef.current.focus();
    }
  }, [editingIndex]);

  // const [showMoreValid, setshowMoreValid] = useState(false);
  // const [editContentMap, setEditContentMap] = useState<{ [key: string]: boolean }>({});
  // const [editedContent, setEditedContent] = useState('');
  // const [allcommentLoaded, setallComentLoaded] = useState(false);
  // const [pageNo , setPageNo] = useState<number>(1);
  // const [showMoreLoading ,setShowMoreLoading] = useState(false)
  // const [allCommentsLoaded, setAllCommentsLoaded] = useState(false);

  // useEffect(() => {
  //   if (totalCommnets) {
  //     setAllCommentsLoaded(totalCommnets <= 5 || totalCommnets === null);
  //   }
  // }, [totalCommnets]);
  // useEffect(()=>{
  //   if(comments === undefined || comments?.length < 5){
  //     setAllCommentsLoaded(true)
  //   }
  //   if (totalCommnets) {
  //     setAllCommentsLoaded(totalCommnets <= 5 || totalCommnets === null);
  //   }
  //   setPageNo(1);
  // },[])
  const submitHandler = async () => {
    setLoading(true);
    if (!commentText) {
      return;
    }
    if(commentText.length > 200){
      return;
    }
    try {
      await addComment(post?.event_hash, post?.id, commentText );
      toggleCommentInput(post?.id);
      setCommentText(''); // Clear the input after submitting
      setLoading(false);
    } catch (error) {
       toggleCommentInput(post?.id);
       setLoading(false);
      console.error('Error adding comment:', error);
    }
  };

  const startEdit = (index: number, content: string) => {
    setEditingIndex(index);
    setEditedContent(content);
  };
  
  const startDelete = (index: number) => {
    setDeletingIndex(index);
    setDeletePopup(true);
  }

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedContent('');
  };

  const saveEdit = async (commentId: number, content: string, post_id: number, event_hash: string) => {
    // Implement save logic here, similar to submitHandler but for updating
    setLoading(true);
    await updateComment (commentId, content, user?.id, post_id, event_hash);
    setLoading(false);
    // Reset editing state
    cancelEdit();
  };

  // const ShowMoreHandler = () => {
  //   setShowMoreLoading(true);
  //   getallComments(5, pageNo + 1)
  //     .then(() => {
  //       setShowMoreLoading(false);
  //       setPageNo((prevPageNo) => prevPageNo + 1);
  //       if(totalCommnets){
  //         if((totalCommnets/5) - 1 <= pageNo){
  //           setAllCommentsLoaded(true)
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching more comments:', error);
  //       setShowMoreLoading(false);
  //     });
  // };;

  // const deleteHandler = (comment_id: number , user_id: number) => {
  //   const updatedcomment = comments?.filter((comment) => comment?.id !== comment_id);
  //   setComments(updatedcomment);
  //   removeComment(comment_id , user_id);
  //   setEditContentMap((prevMap) => {
  //     const newMap = { ...prevMap };
  //     delete newMap[comment_id];
  //     return newMap;
  //   });
  // };

  // const cancelEditHandler = (comment_id: number) => {
  //   // Clear the edit state for the specific comment
  //   setEditContentMap((prevMap) => {
  //     const newMap = { ...prevMap };
  //     delete newMap[comment_id];
  //     return newMap;
  //   });
  // };

  // const editHandler = (comment_id: number, content: string , user_id:number) => {
  //   if (!content) {
  //     // If content is empty, do nothing
  //     return;
  //   }
  
  //   // Update the comment locally
  //   setComments((prevComments) => {
  //     const updatedComments = prevComments?.map((comment) => {
  //       if (comment?.id === comment_id) {
  //         // Update the content of the specific comment
  //         return { ...comment, content };
  //       }
  //       return comment;
  //     });
  //     return updatedComments;
  //   });
  
  //   updateComment(comment_id, content, user_id)
  //     .then(() => {
  //     })
  //     .catch((error) => {
  //       console.error('Error updating comment on the backend:', error);
  //       setComments((prevComments) => {
  //         const revertedComments = prevComments?.map((comment) => {
  //           if (comment?.id === comment_id) {
  //             return { ...comment, content: comment?.content };
  //           }
  //           return comment;
  //         });
  //         return revertedComments;
  //       });
  //     });
  
  //   // Clear edit state after editing
  //   setEditContentMap((prevMap) => {
  //     const newMap = { ...prevMap };
  //     delete newMap[comment_id];
  //     return newMap;
  //   });
  // };

  const getAll = async (event_hash:string, id: number) => {
    setTrackViewall((prevTrackViewall: any) => ({
      ...prevTrackViewall,
      [id]: true
    }));
    setLoading(true);
    await getallComments(event_hash, id);
    setLoading(false);
  }

  const deleteComment = async (comment_id: number, user_id: number, event_hash: string, post_id: number) => {
      setDeleteLoading(true);
      let data = await removeComment(comment_id, user_id, event_hash, post_id);
      setDeleteLoading(false);
      setDeletePopup(false);
      
  }

  return (
    <div className="comments">
      {commentRef === post?.id && !showPopup && showCommentInput && user && (
                <div className="comment-input">
                  <input
                        type="text"
                        maxLength={200}
                        placeholder='Enter a comment'
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                    <br />
                    <Button value={"Comment"} onClick={submitHandler} ml={2}>
                    
                  </Button>
                </div>
    )}  
   
    {post?.Comments &&  post?.Comments.length > 0 && <div className="existing-comments"> 
     {<p  style={{marginTop: '-10px'}}>
      <span>Comments</span>

      {!trackViewall[post?.id] && <span onClick={() => getAll(post?.event_hash, post?.id) } style={{ float: 'right', fontSize: '12px', marginTop: '4px', cursor: 'pointer'}}>View All</span>}
      </p>}
      {loading && <FontAwesomeIcon style={{ fontSize: '40px' }} icon={faSpinner} spin />}        
        {post && post?.Comments && post?.Comments?.map((comment: any, index: number) => {
          return(<div style={{}} key={index}>
                  <div className="comment-container-box
                  ">
             <div className="user-info">
                <div style={{display: 'flex', gap: '12px'}}>
                <div style={{border: '1px solid #000', background: '#000',color: "#fff", height: '40px', width: '40px', minWidth: '40px', textAlign: 'center', borderRadius: '100px', fontSize: '22px'}}>
                  <FontAwesomeIcon icon={faUser} style={{fontSize: '14px', color: '#fff'}}/> 
                </div>
                <div className="user-name">
                  <div>
                      <span style={{fontSize: '15px', color: '#000'}}> {comment.User?.name} </span>
                  </div>
                  <div>
                    <span style={{fontSize: '9px', color: '#545454', position: 'relative', top: '-5px'}}> {getTime(comment.createdAt) ?? ""}</span>
                  </div>
                  {editingIndex === index ? (
                      <>
                      <div style={{width: '100%', marginBottom: '12px'}}>
                        <input
                          ref={editInputRef}
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          width={'100%'}
                        />
                        <div style={{display: 'flex'}}>
                        <Button onClick={() => saveEdit(comment?.id, editedContent, post?.id, post?.event_hash) } value="Submit"></Button> &nbsp;
                        <Button onClick={cancelEdit} value="Cancel"></Button>
                        </div>
                        
                        </div>
                      </>
                    ) : (
                      <div style={{fontSize: '14px',  fontStyle: 'normal', color: '#000'}}>{comment?.content}</div>  
                    )}

                    {deleteIndex === index && deletePopup && 
                    <PopupModal  setShareModal={setDeletePopup}>
                      <div style={{padding: "10px 10px"}}>
                        <h3 style={{textAlign: 'center'}}>Warning!</h3> 
                        <p style={{fontSize: '15px', textAlign: 'center'}}>This will delete the comment permanently</p></div>
                      <div style={{padding: "10px 10px", display: "flex", gap: "20px", justifyContent: "center"}}>
                        {deleteLoading && <FontAwesomeIcon style={{ fontSize: '40px' }} icon={faSpinner} spin />}
                        {!deleteLoading && <><span className="delete-popup-button" onClick={() => deleteComment(comment?.id, user?.id, post?.event_hash, post?.id)}>Delete</span>
                        <span className="delete-popup-button" onClick={() => {setDeletePopup(false)}}>Cancel</span></>}
                      </div>
                    </PopupModal>}
                 
                 {editingIndex !== index && (comment?.User?.id === user?.id || post?.Event?.userId === user?.id) && (
                      <p style={{fontSize: '12px', color: '#8e8e8e', marginTop: '3px', marginBottom: '0',cursor: 'pointer'}}>
                        {comment?.User?.id === user?.id && <span onClick={() => startEdit(index, comment.content)}>edit <span>&nbsp; · &nbsp;</span></span> }
                        
                        <span onClick={() => startDelete(index)}>delete </span>
                      </p>
                    )}
                 
                </div>
      
                </div>
               </div>
            </div>
        </div>) 
      })}
      </div>}
    </div>
    // <div>
    //   {
    //     <div className="comments">
    //       <div className="comment-container">            
    //           
    //       </div>
    //       <div className="existing-comments">
  
    //             return (
    //               <div style={{ minHeight: '50px'}}key={index}>
    //                 <div className="comment-container-box">
    //                   <div className="user-info">
    //                     <p className="user-name">
    //                       <div style={{display: 'flex', gap: '13px'}}>
    //                         <span style={{fontSize: '13px', color: '#545454'}}> {comment.User?.name}</span>
    //                       </div>
    //                     <p  style={{fontSize: '15px', marginBottom: "-12px", fontStyle: 'normal', marginTop: '4px'}}>{comment?.content}</p>  
    //                     </p>
    //                   </div>
    //                   {/* {!isEditing && <p className="comment-content">{comment?.content}</p>} */}
    //                   {
    //                   ((comment.userId === user?.id) && !isEditing) ? (
    //                     <div style={{paddingBottom: '10px', fontWeight: '100'}}>
    //                       <span
    //                         style={{paddingTop: '11px', fontSize: '11px', cursor: 'hand', color: '#8e8e8e'}}
    //                         >
    //                         <span>edit</span>
    //                       </span> &nbsp;
    //                       <span style={{fontSize: '11px', cursor: 'hand', color: '#8e8e8e'}} onClick={() => deleteHandler(comment.id , comment.userId)}><span>delete</span></span>

    //                     </div>
    //                   ) : (
    //                     ""
    //                   )}
    //                   {isEditing && <div>
    //                       <input className="create-event-input" onChange={(e) => setEditedContent(e.target.value)} />
    //                       <div style={{display: 'flex', gap: '10px'}}>
    //                       <Button
    //                         value="Update"
    //                         onClick={() => {
    //                           editHandler(comment.id, editedContent, comment.userId);
    //                         }}
    //                       >
    //                       </Button>
    //                       <Button
    //                       backgroundColor={'white'}
    //                         marginLeft={'10px'}
    //                         variant="outline"
    //                         onClick={() => {
    //                           cancelEditHandler(comment.id);
    //                         }}
    //                         value="Cancel"
    //                       >
                            
    //                       </Button></div>
    //                     </div>}
    //                 </div>
    //               </div>
    //             );
    //           })
    //         )}
    //       </div>
    //       <div>
    //         {!showMoreLoading &&!commentLoading && !allCommentsLoaded  && (
    //           <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '30px' }}>
    //             <Button onClick={() => ShowMoreHandler()} value={'show more'}>Show More</Button>
    //           </div>
    //         )}
    //       </div>
    //       {showMoreLoading &&
    //         <div>
    //         <div className="loadingPage">
    //           <FontAwesomeIcon style={{ fontSize: '40px' }} icon={faSpinner} spin />
    //         </div>
    //       </div>
    //       }
    //     </div>
    //   }
    // </div>
  );
};

export default Comments;