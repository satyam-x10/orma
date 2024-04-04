import React, { useContext, useEffect } from 'react'
import AuthContext from '../../context/auth/AuthContext';
import Button from '../Button';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import useQuery from './hooks/useQuery';

function MyOrmas() {
    const {ormas, user,fetchMyOrmas,myOrmas,loading} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const {width} = useQuery()

    
    useEffect(()=>{
        if(width < 786){
            navigate('/')
        }
        fetchMyOrmas()
      },[])

    const formatDate = (dateString:string) => {
        const date = new Date(dateString);
        
        const options:any = {
            weekday: 'long', 
            year: 'numeric',
            month: 'long',
            day: 'numeric' 
        };
        
        return date.toLocaleDateString('en-US', options);
    };
  
  return (
    <div className='my-ormas-background'>
    <Header/>
    {
    loading ? 
    <div>
        <div className="loadingPage">
            <FontAwesomeIcon style={{fontSize: '30px'}} icon={faSpinner} spin />
        </div>
    </div>:
      user && location.pathname === '/myormas' && (
        <div className='my-ormas-container'>
        <div className='my-ormas-top'>
            <p></p>

            <Button onClick={() => navigate('/create/orma')} style={{ color: "#fff", backgroundColor: '#000', width: '120px', height: 'auto', borderRadius: '3px', padding: '5px', fontSize: '14px' }} value="Create an Orma" />
        </div>
          <div style={{ padding: '15px', height: '20px', background: "#eee" }}>
            <div className='my_ormas_list'>
              {myOrmas && myOrmas?.map(event => (
                <div onClick={() => navigate('/' + event?.event_hash)} className='orma_recent_item my_orma_item'>
                  <div className="orma_recent_image">
                    <img src={event?.event_profile_image_url} width={150} />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <div className="banner-text">{event?.name}</div>
                    <div className="banner-text-small">{formatDate(event?.event_date)} </div>
                    <div className="bottom-button"><Button style={{ backgroundColor: "#000", fontSize: '13px', color: "#fff", borderRadius: '5px' }} value="View" /></div>
                  </div>
                </div>
              ))}
            </div>
           
          </div>
        </div>
      )
    }
  </div>
  )
}

export default MyOrmas