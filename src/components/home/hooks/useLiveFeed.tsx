import { PostContextProps, PostsResponse} from '../../../types';
import PostContext from '../../../context/auth/PostContext';
import {fetchPosts} from '../services/homeApi';
import { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventPage } from '../../../context/auth/EventContext';
import { likePost} from '../../home/services/homeApi';
import moment from 'moment';
import AuthContext from '../../../context/auth/AuthContext'
import Popup from '../../PopUp/PopUp';
interface RouteParams {
    event_hash: string;
}

const useLiveFeed = () => {
  
    const { event_hash, }: Partial<RouteParams> = useParams();
    const [loading, setLoading] = useState(false);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const containerRef = useRef<null | HTMLDivElement>(null);
    const endOfPostsRef = useRef<null | HTMLDivElement>(null);
    const [showHeart, setShowHeart] = useState<boolean>(false);
    const [likedPostId, setLikedPostId] = useState<number | null>(null);
    const observedImagesRef = useRef<Set<HTMLImageElement>>(new Set());
    const { user } = useContext(AuthContext);
    const [showPopup, setShowPopup] = useState<boolean>(false);

    const navigate = useNavigate();
    const { state, dispatch } = useEventPage();
    const posts = (state && state?.events && event_hash && state.events[event_hash] && state.events[event_hash].postsResponse) ? state.events[event_hash].postsResponse : null;

    useEffect(() => {
      setTimeout(() => {
        setShowHeart(false);
        setLikedPostId(null);
      }, 700)
    }, [showHeart])

    const updatePageNumber = (event_hash: string, pageNumber: number, keep: boolean) => {
      dispatch({ type: 'UPDATE_PAGE', event_hash, pageNumber, keep });
    };

    const addPosts = (postsResponse: PostsResponse) => {
      if (!event_hash) return;
      dispatch({ type: 'ADD_POSTS', event_hash, postsResponse });
    };
    const appendPosts = (postsResponse: PostsResponse) => {
      if (!event_hash) return;
      dispatch({ type: 'APPEND_POSTS', event_hash, postsResponse });
    };

    const handleDoubleClick = (id: number) => {
      if (user == null) {
        setShowPopup(true);
      }
      triggerLikePost(id);
      setLikedPostId(id);

    } 


    useEffect(() => {
      const savedScrollPosition = sessionStorage.getItem('livefeedscrool');
      if(savedScrollPosition){
          window.scrollTo({
            top: parseFloat(savedScrollPosition),
            behavior: 'smooth'
          }); 
          sessionStorage.setItem('livefeedscrool', '0');
      }else{
          window.scrollTo(0, 0); 
      }  
  }, []);

  const handleScroll = () => {
      sessionStorage.setItem('livefeedscrool', window.scrollY.toString())  
  }

  useEffect(() => {
      // Attach the event listener to the window object when the component mounts
      window.addEventListener('scroll', handleScroll);

      // Return a cleanup function that removes the event listener
      // This will be called when the component unmounts
      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, []); 

    const triggerLikePost = async (id: number) => {
      if (!event_hash) return;
      try {
        let like = await likePost(event_hash, id);
        //if(like.status === 200){
        setShowHeart(true);

        //}
      } catch (error) {
        alert("there was error processing the request")
      }
    }


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

    //   useEffect(() => {
    //     if (!containerRef.current) return;

    //     const images = Array.from(containerRef.current.querySelectorAll<HTMLImageElement>('.grid_image'))
    //       .filter(image => {
    //         // Only select images that haven't been loaded or observed.
    //         return !image.getAttribute('data-loaded') && !observedImagesRef.current.has(image);
    //       });

    //     const observer = new IntersectionObserver(
    //       entries => {
    //         entries.forEach(entry => {
    //           if (entry.isIntersecting) {
    //             const lazyImage = entry.target as HTMLImageElement;
    //             if (lazyImage.getAttribute('data-loaded')) return; // The image has already been loaded.

    //             const src = lazyImage.dataset.src || '';
    //             if (lazyImage.src !== src) {
    //               lazyImage.src = src;
    //               lazyImage.setAttribute('data-loaded', 'true'); // Mark the image as loaded
    //               observer.unobserve(lazyImage);
    //               observedImagesRef.current.delete(lazyImage); // Remove it from our observed images set
    //             }
    //           }
    //         });
    //       },
    //       { rootMargin: '0px 0px 0px 0px'}
    //     );

    //     images.forEach(image => {
    //       observedImagesRef.current.add(image); // Add the image to our set of observed images
    //       observer.observe(image);
    //     });

    //     return () => {
    //       observer.disconnect();
    //     };
    // }, [posts]);




    const getPosts = async () => {
      let findPost = posts?.posts?.find((post) => post?.event_hash === event_hash);
      if (!findPost) {
        setLoading(true);
        try {
          let posts = await fetchPosts(event_hash ? event_hash : '');
          addPosts(posts)
          setLoading(false);

        } catch (error) {
          setLoading(false);
        }
      }
    }

    useEffect(() => {
      getPosts();
    }, [])

    const navigatePost = async (url: string) => {
      navigate(url);
    }

    const getTime = (time: Date) => {
      const someTimeInThePast: moment.Moment = moment(time);
      const relativeTime: string = someTimeInThePast.fromNow();
      return relativeTime;
    }

    return {
      loading,
      posts,
      containerRef,
      endOfPostsRef,
      loadMoreLoading,
      navigatePost,
      state,
      showHeart,
      handleDoubleClick,
      getTime,
      likedPostId,
      showPopup,
      setShowPopup
    }
}
export default useLiveFeed;