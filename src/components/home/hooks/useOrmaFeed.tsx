import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation} from 'react-router-dom';
import { fetchOrmaFeedTimeSlots, fetchOrmaFeedByTimeSlot, fetchMemories } from "../services/homeApi";
import {useOrmaFeedContext} from '../../../context/auth/OrmaFeedContext';
import { useNavigate } from "react-router-dom";
interface RouteParams {
    event_hash: string;
}

const useOrmaFeed = () => {

    const { event_hash }:Partial<RouteParams> = useParams();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(0);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const containerRef = useRef<null | HTMLDivElement>(null);
    const endOfPostsRef = useRef<null | HTMLDivElement>(null);
    const navigate = useNavigate();
    const [currentTimeslot, setCurrentTimeslot] = useState<any>(null);
    const MemoryRef = useRef<null | HTMLDivElement>(null);
    const endOfMemoryRef = useRef<null | HTMLDivElement>(null);
    const [isMoreMemories, setisMoreMemories] = useState(true);

    const { state, dispatch } = useOrmaFeedContext();
    const event = event_hash && state?.ormaFeed && state?.ormaFeed[event_hash];
   
    useEffect(() => {
        const getTimeStamp = async () => {
            if(event_hash){
                setLoading(true)
                let memories = await fetchMemories(event_hash);
                let timeStamps = await fetchOrmaFeedTimeSlots(event_hash, page);


                if(memories?.error === null && memories?.posts && memories?.posts?.length > 0){
                    dispatch({ type: 'ADD_MEMORIES', event_hash: event_hash, memories: memories?.posts});
                }
                
                if(timeStamps?.error === null && timeStamps?.posts && timeStamps?.posts?.length > 0){
                    for(let timestamp of timeStamps?.posts){
                        if(!state?.ormaFeed || !state?.ormaFeed[timestamp]){
                            let posts = await fetchOrmaFeedByTimeSlot(event_hash, timestamp.timeslot);
                            if(timestamp.timeslot && posts?.posts){
                                dispatch({ type: 'ADD_TIMESLOT', event_hash: event_hash, timeslot: timestamp.timeslot, ormaFeed: posts?.posts});
                            }
                        }
                    }
                }
                setLoading(false)

            }
        }
        !event && getTimeStamp()
    }, []);
    // useEffect(() => {
    //     if(event){
    //         window.scrollTo({
    //             top: 300,
    //             behavior: 'smooth'
    //           }); 
    //     }

    // }, [event])

    useEffect(() => {
        const savedScrollPosition = sessionStorage.getItem('timelinescroll');
        if(savedScrollPosition){
            window.scrollTo({
                top: parseFloat(savedScrollPosition),
                behavior: 'smooth'
              }); 
            sessionStorage.setItem('timelinescroll', '0');
        }else{
            window.scrollTo(0, 0); 
        }  
    }, []);

    const handleScroll = () => {
     sessionStorage.setItem('timelinescroll', window.scrollY.toString())
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

    const updateCurrentTimeslot = (timeslot: any) => {
        setCurrentTimeslot(timeslot);
    }

    const getMorePosts = useCallback(async () => {
        if (!event_hash) return;
        if (page === 0) return;
        setLoadMoreLoading(true);
        try {
          let newPosts = await fetchOrmaFeedByTimeSlot(event_hash, currentTimeslot);
          setLoadMoreLoading(false);
          if(currentTimeslot && newPosts?.posts){
            dispatch({ type: 'ADD_TIMESLOT', event_hash: event_hash, timeslot: currentTimeslot, ormaFeed: newPosts?.posts});
            setPage((page) => page + 1);
          } else {
            setPage(0);
          }

        } catch (error) {
          setLoading(false);
        }
      },[event_hash, currentTimeslot]);
  

    useEffect(() => {
        if (!event_hash) return;
        if (page === 0) return; // Do not set up the observer if page is 0
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
      }, [event_hash, page, loadMoreLoading, getMorePosts, state]);

      const updateMoments = (event_hash: string, newMemories:any) => {
        dispatch({ type: 'ADD_MEMORIES', event_hash: event_hash, memories: newMemories?.posts });
     }

      const getMoreMemories = async () => {
    
        if (!event_hash||!isMoreMemories) return;
        let pageNumber = typeof event === 'object' ? Math.ceil((event?.memories?.length || 0) / 10) : 0;    
    
        if (pageNumber === 0) return;
        setLoadMoreLoading(true);
        if(isMoreMemories){try {
          let newMemories = await fetchMemories(event_hash ? event_hash : '', pageNumber + 1);
          
          if (newMemories?.posts?.length !== 0) {
            await updateMoments(event_hash, newMemories)
            if (newMemories?.posts?.length < 10) {
              setisMoreMemories(false);
            }
          } else {       
            setisMoreMemories(false);        
            }
          setLoadMoreLoading(false);
        } catch (error) {
          setLoading(false);
        }}
      };

      useEffect(() => {
        if (!event_hash) return;
        let pageNumber = (state?.ormaFeed && state?.ormaFeed[event_hash] && state?.ormaFeed[event_hash].pageNumber) ? state?.ormaFeed[event_hash].pageNumber : 1;
            
        if (pageNumber === 0) return; // Do not set up the observer if page is 0
        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting && !loadMoreLoading) {
               getMoreMemories();
              }          
            });
          },
          { rootMargin: '0px 0px 100px 0px' }
        );
    
        if (endOfMemoryRef.current) {
          observer.observe(endOfMemoryRef.current);
        }
    
        return () => {
          observer.disconnect();
        };
      }, [event, state]);
        
    const navigatePost = async (url: string) => {
        navigate(url);
      }

    return {
        loading,
        event,
        containerRef,
        navigatePost,
        event_hash,
        loadMoreLoading,
        endOfPostsRef,
        updateCurrentTimeslot,
        MemoryRef,
        endOfMemoryRef,
    }
}
export default useOrmaFeed;