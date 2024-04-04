import { useEffect, useState, useContext,useRef } from 'react';
import {fetchProcessingPosts} from '../services/processingApi';
import PostContext from '../../../context/auth/PostContext';
import { PostContextProps, Post } from '../../../types';
import { useParams } from 'react-router-dom';
import {useEventPage} from '../../../context/auth/EventContext'

interface RouteParams {
    event_hash: string;
  }


export const useImageStatus = () => {
    
    const { event_hash }:Partial<RouteParams> =  useParams();
    const [loading, setLoading] = useState(false);
    const { processingPost, setProcessing,removeProcessingPost } = useContext(PostContext) as PostContextProps;
    const pollingIntervalIdRef = useRef<ReturnType<typeof setInterval>>();
    const [statusPolling, setStatusPolling] = useState(false);
    const [error, setError] = useState<String | null>(null);
    let count = 0;
    const { dispatch } = useEventPage();

    const appendSinglePost = (event_hash: string, post: Post) => {
        dispatch({ type: 'ADD_SINGLE_POST', event_hash, post });
      };

    const getArrayDifference = (newarray: Array<Post>, oldarray: Array<any>) => {
    
        let notInArray2 = oldarray.reduce( function(acc, v) {
            if(!newarray.find(function (vInner) {
              return v.id === vInner.id;
            })){
              acc.push(v);
            }
            return acc
          }, []);
        
          return notInArray2;
    }

    const getPendingPosts = async () => {
        setLoading(true);
        try{
            let posts = await fetchProcessingPosts(event_hash ? event_hash:'');
            let processing = posts?.posts?.filter((filter) => filter.status === 'READYFORPROCESSING');
            setLoading(false);
            let post = {...posts, Likes: []};
            setProcessing(post)
           if(posts.status !== 401 && posts.status !== 500){
                if(processing?.length !== 0){
                    setStatusPolling(true)
                }else{
                    setStatusPolling(false);
                }
            }   

        }catch(error){
            setLoading(false);
        }  
    }

    const checkForUpdates = async () => {
        if(!event_hash) return
        count = count+1;
        if(count > 5) {
            setStatusPolling(false);
        }
        try{
            let posts = await fetchProcessingPosts(event_hash);
            let getreadyprocessing = posts?.posts?.filter((filter) => filter.status === 'READYFORPROCESSING');
            if(getreadyprocessing && processingPost?.posts){
                let postPublished = getArrayDifference(getreadyprocessing, processingPost?.posts);
                if(postPublished.length !== 0){
                    postPublished[0]['compressed_url'] = postPublished[0]['image_url']
                    postPublished[0]['status'] = 'COMPLETED';

                    removeProcessingPost(postPublished[0].id)
                    appendSinglePost(event_hash, postPublished[0]);
                    setStatusPolling(false);
                }

            }
        }catch(error){
            console.error(error)
        }  
    }

    useEffect(() => {
        getPendingPosts();
    }, [])

    useEffect(() => {
        if(statusPolling === true){
            const intervalId = setInterval(checkForUpdates, 10000);
            pollingIntervalIdRef.current  = intervalId;
        }else{
            clearInterval(pollingIntervalIdRef.current);
        }

    }, [statusPolling])

    return {
        processingPost,
        loading
    }
}