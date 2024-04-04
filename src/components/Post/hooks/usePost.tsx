import { Post, PostContextProps, PostsResponse, User, Comment, Likes } from '../../../types';
import { useParams } from 'react-router-dom';
import { fetchPost, likePost, unlikePost, getLikePost , fetch5Comments ,fetchallComments} from '../../home/services/homeApi';
import { useEffect, useState, useRef } from 'react';
import { useEventPage } from '../../../context/auth/EventContext';
import AuthContext from '../../../context/auth/AuthContext'
import { useContext } from 'react'
import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import {fetchPosts} from '../../home/services/homeApi';

const API_URL = import.meta.env.VITE_API_URL;
interface CommentsResponse {
    comments: Comment[] | null;
    error: string | null;
  }
const usePost = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [localPost, setLocalPost] = useState<any | null>();
    const {event_hash, id} = useParams();
    const [showHeart, setShowHeart] = useState<boolean>(false);
    const { user } = useContext(AuthContext);
    const { state, dispatch } = useEventPage();
    const [currentPost, setCurrenPost] = useState<null | number>(null);
    
    const posts = (state && state?.events && event_hash && state.events[event_hash] && state.events[event_hash].postsResponse) ? state.events[event_hash].postsResponse : null;

    const [scrollPost, setScrollPost] = useState<any | null>([]);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const containerRef = useRef<null | HTMLDivElement>(null);
    const endOfPostsRef = useRef<null | HTMLDivElement>(null);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    //const [postLikes, setPostLikes] = useState(localPost?.Likes ? localPost?.Likes.length: []);
    const [comments, setComments] = useState<Comment[] | undefined>(undefined);
    const token = Cookies.get('token');
    const [commentLoading  , setcommentLoading] =useState(false);
    const [totalCommnets , setTotalCommentPages] = useState(null);
    const updatePageNumber = (event_hash: string, pageNumber: number, keep: boolean) => {
        dispatch({ type: 'UPDATE_PAGE', event_hash, pageNumber, keep });
      };

    const appendPosts = (postsResponse: PostsResponse) => {
        if (!event_hash) return;
        dispatch({ type: 'APPEND_POSTS', event_hash, postsResponse });
    };

    const getMorePosts = async () => {
        if (!event_hash) return;
        let pageNumber = (state?.events && state?.events[event_hash] && (state?.events[event_hash].pageNumber || state?.events[event_hash].pageNumber === 0)) ? state?.events[event_hash].pageNumber : 1;
        if (pageNumber === 0) return;
        setLoadMoreLoading(true);
        try {
          let newposts = await fetchPosts(event_hash ? event_hash : '', pageNumber + 1);
          setLoadMoreLoading(false);
          if (newposts?.posts?.length !== 0) {
            updatePageNumber(event_hash, pageNumber + 1, true)
            appendPosts(newposts)
            //addMorePosts(newposts);
          } else {
            updatePageNumber(event_hash, 0, true)
          }
        } catch (error) {
          setLoading(false);
        }
      };

    useEffect(() => {
        if (event_hash && id) {
           user !== undefined && getPost(event_hash, id);
         
        } else {
          setError("Invalid Url, we couldn't find that post.");
        }
    }, []);

    useEffect(() => {
        if(posts && posts?.posts && id){
            const startIndex = posts?.posts.findIndex(post => post.id === parseInt(id));
            if (startIndex !== -1){
              let newPost = posts?.posts.slice(startIndex);
              setScrollPost(newPost);
            }
          }
    }, [posts])
    
    useEffect(() => {
        if (!event_hash) return;
        let pageNumber = (state?.events && state?.events[event_hash] && state?.events[event_hash].pageNumber) ? state?.events[event_hash].pageNumber : 1;
        if (pageNumber === 0) return; // Do not set up the observer if page is 0
        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting && !loadMoreLoading) {
                getMorePosts();
              }
            });
          },
          { rootMargin: '0px 0px 500px 0px' }
        );
    
        if (endOfPostsRef.current) {
          observer.observe(endOfPostsRef.current);
        }
    
        return () => {
          observer.disconnect();
        };
      }, [posts, state]);
    
    useEffect(() => {
        setTimeout(() => {
            setShowHeart(false);
        }, 700)
    },[showHeart])

    const getPost = async (event_hash: string, id: string) => {
        let findPost = posts?.posts?.find((post) => post?.id === parseInt(id));
        if(!findPost){
            setLoading(true);
            try{
                let post = await fetchPost(event_hash, id);
                setLoading(false);
                if(post && post?.post) {
                    setLocalPost(post?.post);
                }else{
                    setError("Invalid Post, we couldn't find that post")
                }
            }catch(error){
                setLoading(false);
                console.error("Error fetching post:", error); // Log error for debugging
                setError("Failed to load post. Please try again."); 
            }
        } else {
            if(posts && posts?.posts && id){
                const startIndex = posts?.posts.findIndex(post => post.id === parseInt(id));
                if (startIndex !== -1){
                  let newPost = posts?.posts.slice(startIndex);
                  setScrollPost(newPost);
                }
              }
        }
    }

    const handleDoubleClick = (post_id: number) => {    
        if (user == null) {
            // Show Popup when there is no user
            setShowPopup(true);
            return;
        }
        setCurrenPost(post_id)
        setShowHeart(true);
        if (!scrollPost && !event_hash && !post_id) return;
        if(event_hash) {
            triggerLikePost(event_hash, post_id)
        }
    };
    // manual click on like button below
    const handleClick = (post_id: number) => {
        if (user === null) {
            // Show Popup when there is no user
            setShowPopup(true);
            return;
        }

        if (!event_hash && !post_id) return;

        //CHECK IF ALREADY LIKED 
        let current = scrollPost?.find((post: Post) => post.id === post_id);
        if(current){
            let getlike = current.Likes?.find((like: Likes) => like?.userId === user?.id);
            if(getlike){
                event_hash &&  triggerLikeUnlikePost(event_hash, post_id)
            }else{
                event_hash &&  triggerLikePost(event_hash, post_id)
            }
        }

        if(localPost){
            let getlike = localPost.Likes?.find((like: Likes) => like?.userId === user?.id);
            if(getlike){
                event_hash &&  triggerLikeUnlikePost(event_hash, post_id)
            }else{
                event_hash &&  triggerLikePost(event_hash, post_id)
            }
        }


    };

    const triggerLikePost = async (event_hash: string, id: number) => {
        if(!user){
            return;
        }
            try {
                let like = await likePost(event_hash, id);
                if(like.status === 200){
                    setShowHeart(true);
                    setCurrenPost(id);
                        let post_id = id;
                        let Likes = {
                            userId: user?.id,
                            post_id: id,
                            event_hash: event_hash
                        }
                        dispatch({ type: 'ADD_POST_REACTION', post_id, Likes, event_hash});
                        if(localPost){
                            const getLocalPost = localPost;
                            getLocalPost.Likes.push(Likes);
                        }
                } 
            } catch (error) {
                alert("there was error processing the request")
            }
    
    }
    
    const triggerLikeUnlikePost = async (event_hash: string, id: number) => {
        if(!user){
            return;
        }
        try {                 
            let unlike = await unlikePost(event_hash, id);
                if(unlike.status === 200){
                    let removeLike = {
                        userId: user?.id,
                        event_hash: event_hash,
                        post_id: id
                    }
                    dispatch({ type: 'ADD_POST_REACTION', post_id:id, Likes:removeLike, event_hash});
                    if(localPost){
                        const getLocalPost = localPost;
                        getLocalPost.Likes.length > 0 && getLocalPost?.Likes?.filter((like: any) => like?.userId === removeLike?.userId && like?.post_id !== removeLike?.post_id)
                        let unLike = localPost?.Likes?.filter((like: any) => like?.userId !== removeLike?.userId && like?.post_id !== removeLike?.post_id);
                        getLocalPost.Likes = unLike;
                    }
                }
        }catch(error) {
            console.log(error);
            alert("there was error processing the request")
        }
    }

    const addComment = async (event_hash: string, id: number, commentText: string): Promise<AxiosResponse<any, any>> => {
 
        if (!event_hash || !user || !id) {
            console.error('Local post or user not available');
            return Promise.reject(new Error('post or user not available'));
        }
        
        try {
            const response = await axios.post(
                `${API_URL}/events/${event_hash}/post/${id}/comment`,
                { content: commentText, event_hash:event_hash , post_id:id},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token || '',
                    },
                }
            );
            const comment = {
                ...response.data, ...{
                    User: {
                        id: user?.id,
                        name: user?.name
                    }
                }
            }
            dispatch({ type: 'ADD_POST_COMMENT', post_id:id, Comment:comment, event_hash});
            if(localPost){
                const getLocalPost = localPost;
                getLocalPost.Comments?.unshift(comment);
            }
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            return Promise.reject(error);
        }
    };

    const updateComment = async (comment_id: number , content: string , user_id:number, post_id: number, event_hash: string): Promise<AxiosResponse<any, any>> => {
        if (!post_id && !user) {
            console.error('Local post or user not available');
            return Promise.reject(new Error('Local post or user not available'));
        }
        try {
            const response = await axios.put(
                `${API_URL}/events/${event_hash}/post/${id}/comment/${comment_id}`,
                { content : content ,userId: user_id }, 
                {
                    headers: {
                        Authorization: token || '',
                    },
                }
            ); 
            dispatch({ type: 'UPDATE_POST_COMMENT', post_id: post_id,event_hash: event_hash,comment_id: comment_id,updatedCommentContent: content});
            if(localPost){
                const commentIndex = localPost.Comments.findIndex((comment: any) => comment.id === comment_id);

                if (commentIndex !== -1) {
                  // Clone the Comments array from the state
                  const updatedComments = [...localPost.Comments];
            
                  // Update the specific comment's content
                  updatedComments[commentIndex] = { ...updatedComments[commentIndex], content: content };
            
                  // Update the localPost state with the new Comments array
                  setLocalPost({ ...localPost, Comments: updatedComments });
                }
            }    
            
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            return Promise.reject(error);
        }
    };

    const removeComment = async (comment_id: number , user_id:number, event_hash: string, post_id: number): Promise<AxiosResponse<any, any>> => {
        if (!user) {
            console.error('Local post or user not available');
            return Promise.reject(new Error('Local post or user not available'));
        }
    
        try {
            //TODO: This needs to be delete call
            const response = await axios.post(
                `${API_URL}/events/${event_hash}/post/${id}/comment/${comment_id}`,
                { userId : user_id }, 
                {
                    headers: {
                        Authorization: token || '',
                    },
                }
            );
            dispatch({ type: 'REMOVE_POST_COMMENT', post_id: post_id,event_hash: event_hash,comment_id: comment_id});
            if (localPost) {
                // Create a new Comments array excluding the comment with the specified comment_id
                const updatedComments = localPost.Comments.filter((comment: any) => comment.id !== comment_id);
              
                // Update the localPost state with the new Comments array
                setLocalPost({ ...localPost, Comments: updatedComments });
              }
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            return Promise.reject(error);
        }
    };

    const getallComments = async (event_hash: string, id: number) => {
        try {
            const response = await axios.get(
                `${API_URL}/events/${event_hash}/post/${id}/comments/all`,
                 
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            dispatch({ type: 'ADD_POST_COMMENT', post_id:id, Comment:response?.data?.comments, event_hash});
            if(localPost){
                const getLocalPost = localPost;
                getLocalPost.Comments = response?.data?.comments
            }
            return response;
        } catch (error) {
            console.error('Error adding comment:', error);
       
            return Promise.reject(error);
        }
      }


      
    // useEffect(() => {
    //     getcommentsLength();
    //     get5Comments()
    //       .then(() => {
    //         setcommentLoading(false);
    //       })
    //       .catch((error) => {
    //         console.error('Error fetching comments:', error);
    //       });
    // }, [localPost, user]);

    // return {
    //     loading,
    //     error,
    //     handleDoubleClick,
    //     handleClick,
    //     showHeart,
    //     addComment,
    //     comments,
    //     getallComments,
    //     commentLoading,
    //     setComments,
    //     setcommentLoading,
    //     get5Comments,
    //     removeComment,
    //     updateComment,
    //     event_hash,
    //     totalCommnets,
    //     state,
    //     user,
    //     getcommentsLength,
    //     scrollPost
    // }

    return {  
        loading,
        error,
        scrollPost,
        handleDoubleClick,
        handleClick,
        showPopup,
        setShowPopup,
        showHeart,
        localPost,
        addComment,
        event_hash,
        user,
        updateComment,
        removeComment,
        getallComments,
        containerRef,
        endOfPostsRef,
        currentPost
    }

}

export default usePost;