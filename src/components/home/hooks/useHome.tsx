import { useEffect, useState, useContext } from 'react';
import {fetchEvent} from '../services/homeApi';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import AuthContext from '../../../context/auth/AuthContext';
import axiosInstance from '../../../api';
import Cookies from 'js-cookie';
interface RouteParams {
    event_hash: string;
}
const API_URL = import.meta.env.VITE_API_URL;
const useHome = () => {
    
    const { event_hash }:Partial<RouteParams> = useParams();
    const [pageLoading, setPageLoading] = useState(false);
    const [errorPage, setErrorPage] = useState(false);
    const { user, setViewedEvents, event, setEvent } = useContext(AuthContext)

    let navigate = useNavigate();

    let goUpload = () => {
        if(user !== null){
            navigate(`./upload`)   
        }else{
            navigate(`./login`)
        }
    }

    const getEventDetails = async () => {
        if(event?.event_hash !== event_hash){
            setPageLoading(true);
            try{
                let getEventDetails = await fetchEvent(event_hash ? event_hash:''); 
                if(getEventDetails?.event){
                    let date = moment(getEventDetails?.event?.event_date, "YYYY-MM-DD HH:mm:ss.SSS");
                    // Formatting the date
                    let formattedDate = date.format("dddd, MMMM Do, YYYY");
                    
                    const myevent = {
                        ...getEventDetails?.event,
                        event_date: formattedDate,
                        event_original_date: getEventDetails?.event?.event_date ?? ''
                    }
                    setViewedEvents(myevent)
                    setEvent(myevent);
                }else{
                    setErrorPage(true);
                }
                setPageLoading(false);
            }catch(error){
                setPageLoading(false);
                setErrorPage(true)
            }  
        }
    }
    
    async function checkLimit() {
        const token = Cookies.get('token');
        const response = await axiosInstance.get(API_URL+'/events/'+ event_hash+'/checkLimit',{
            headers: {
                Authorization: token,
            },
            params: {
                event_hash: event_hash
            }
        }); 
        return response.data;
    }

 async function updateVisitedEvent(event_hash: string) {
    const token = Cookies.get('token');
    const response = await axiosInstance.post(API_URL + '/users/updateRecentlyViewed',{event_hash }, {      
        headers: { Authorization: `${token}` },      
    });
    return response.data;    
  }
    useEffect(() => {
        getEventDetails();
    }, []);

    return { 
        event,
        pageLoading,
        errorPage,
        goUpload,
        event_hash,
        checkLimit,
        updateVisitedEvent
    }
}

export default useHome;