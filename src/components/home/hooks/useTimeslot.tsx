import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation} from 'react-router-dom';
import { fetchOrmaFeedTimeSlots, fetchOrmaFeedByTimeSlot, fetchMemories } from "../services/homeApi";
import {useTimeSlotContext } from "../../../context/auth/TimeSlotContext";
import { useNavigate } from "react-router-dom";
interface RouteParams {
    event_hash: string;
    timeslot: string;
}

const useTimeslot = () => {

    const { event_hash, timeslot }:Partial<RouteParams> = useParams();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const endRef = useRef<null | HTMLDivElement>(null);
    const navigate = useNavigate();
    const [stopLoadingMore, setStopLoadingMore] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    const { state, dispatch } = useTimeSlotContext();
    const event = timeslot && event_hash && state?.ormaFeed && state?.ormaFeed[event_hash] && state?.ormaFeed[event_hash][timeslot];
   
    useEffect(() => {
      // Reset images loaded counter when `event` changes
      setImagesLoaded(0);
    }, []);

    const handleImageLoad = () => {
      setImagesLoaded(prev => prev + 1);
    };
  
    useEffect(() => {
        const getTimeStamp = async () => {
          setLoadMoreLoading(true);
            if(event_hash && timeslot){
              //const fullyEncodedDatetime = timeslot.replace(/\./g, '%2E');
              const encodedDatetime = decodeURIComponent(timeslot);
                setLoading(true)
                let newPosts = await fetchOrmaFeedByTimeSlot(event_hash, encodedDatetime);
                setLoadMoreLoading(false);
                if(newPosts?.posts){
                  dispatch({ type: 'ADD_TIMESLOT', event_hash: event_hash, timeslot: timeslot, ormaFeed: newPosts?.posts});
                  setPage((page) => page + 1);
                } else {
                  setPage(0);
                }
                setLoading(false)

            }
        }
        getTimeStamp()
    }, []);


    const getMorePosts = async () => {
        if (!event_hash) return;
        if (page === 0) return;
        if(!timeslot) return;
        try {
          let newPosts = await fetchOrmaFeedByTimeSlot(event_hash, timeslot, page);
          if(newPosts?.posts && newPosts?.posts.length > 0) {
            dispatch({ type: 'APPEND_TO_TIMESLOT', event_hash: event_hash, timeslot: timeslot, ormaFeed: newPosts?.posts});
            setPage((page) => page + 1);
          } else {
            setStopLoadingMore(true)
          }
        } catch (error) {
          setStopLoadingMore(true)
          setLoading(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if(entry.isIntersecting && !stopLoadingMore && !loading){
                getMorePosts();
              }
            });
          },
          { rootMargin: '0px 0px 0px 0px' }
        );
  
        if (endRef.current) {
          observer.observe(endRef.current);
        }
  
        return () => {
          observer.disconnect();
        };
      
      }, [imagesLoaded, stopLoadingMore, loading]);

    
    
    const navigatePost = async (url: string) => {
        navigate(url);
      }

    return {
        loading,
        event,
        navigatePost,
        event_hash,
        loadMoreLoading,
        endRef,
        timeslot,
        getMorePosts,
        handleImageLoad,
        imagesLoaded,
        stopLoadingMore
    }
}
export default useTimeslot;