// Home.jsx
import "./style.css"

import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from "../Button";
import Header from "../Header/header";
import AuthContext from "../../context/auth/AuthContext";
import MyOrmasMobileComponent from "./MyOrmasMobileComponent";
import axiosInstance from '../../api'
import Cookies from "js-cookie";
import {OrmaEvent} from '../../types'
import moment from "moment";
import { sendPageview, initGA } from '../../analytics'; 

const MainPage: React.FC = () => {

  const { ormas, user, fetchMyOrmas, myOrmas, setOrmas } = useContext(AuthContext);
  const [rececnt, setRecent] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      initGA(); // Initialize GA on app load
  }, []);

  const location = useLocation();

  useEffect(() => {
      sendPageview(location.pathname + location.search); // Send pageview on route change. this will trigger on every route change
  }, [location]);

  const login = () => {
    navigate('/login');
  }

  const getRecentOrmas = async () => {
    const token = Cookies.get('token');
    const API_URL = import.meta.env.VITE_API_URL;
    if (user) {
      const response = await axiosInstance.get(API_URL + '/users/getRecentlyViewed', {
        headers: {
          Authorization: token,
        }
      });
      return (response.data.recentlyViewed.map((item: any) => {
            let date = moment(item?.Event.event_date, "YYYY-MM-DD HH:mm:ss.SSS");
            // Formatting the date
            let formattedDate = date.format("dddd, MMMM Do, YYYY");
        return {...item.Event, event_date: formattedDate}
      })); 
    }
    else {
      return JSON.parse(localStorage.getItem('recent_ormas') || '[]');
    }    
  };

  useEffect(() => {
    //TODO: UDPATE LOCAL STORAGE EVERYTIME
    setLoadingRecent(true);
      const fetchOrmaEvents = async () => {
        let orma_events: OrmaEvent[] = await getRecentOrmas();
        setLoadingRecent(false);
        setOrmas(orma_events);
      };
      fetchOrmaEvents();
  }, [user])

  return (
    <div>
      <Header />
      <div className="mainPageMenu">
        <div className="menu">
          <div onClick={() => setRecent((data) => !data)} style={{ width: '50%', padding: '15px', borderBottom: rececnt ? '2px solid #000' : '' }}>
            <span style={{ color: '#000' }}>
              HOME
            </span>
          </div>
          <div onClick={() => {
            setRecent((data) => !data)
          }} style={{ width: '50%', padding: '15px', color: '#000', borderBottom: !rececnt ? '2px solid #000' : '' }}>MY ORMAS</div>

        </div>
      </div>
      {rececnt && <div className="mobilemarketingBlob">
        <h1 style={{ marginBottom: '10px', fontFamily: 'Playfair Display' }}>Howdy!</h1> Turn your moments turn into beautiful memories <div style={{ paddingTop: '15px' }}><Button onClick={() => navigate('/create/orma')} style={{ color: "#fff", backgroundColor: '#000', width: '120px', height: 'auto', borderRadius: '3px', padding: '5px', fontSize: '14px' }} value="Create an Orma" /></div>
      </div>}
      <div className="desktopMarketing">
        <div className="marketingBlob">
          <h1 style={{ marginBottom: '10px', fontFamily: 'Playfair Display' }}>Howdy!</h1> Turn your moments turn into beautiful memories <div style={{ paddingTop: '15px' }}><Button onClick={() => navigate('/create/orma')} style={{ color: "#fff", backgroundColor: '#000', width: '120px', height: 'auto', borderRadius: '3px', padding: '5px', fontSize: '14px' }} value="Create an Orma" /></div>
        </div>
      </div>

      <div className="main-page-panel">
        {rececnt && ormas && ormas.length > 0 &&<div className="recent_items">
          <div style={{ paddingTop: '15px', paddingBottom: '15px', paddingLeft: '10px', height: '15px', background: "#eee", }}>
            <span className="heading_recent_items">Recently viewed</span>
            {/* <span className="createOrmaButton" style={{float: 'right', height: '20px'}}><Button style={{ color: "#fff", backgroundColor: '#000', width: '100px', height: 'auto', borderRadius: '3px', padding: '5px',fontSize: '14px' }} value="Create Orma"/></span> */}
          </div>
          <div className="recent" style={{ background: "#eee", padding: '8px 12px' }}>
            {!loadingRecent && ormas && ormas?.map(event => (
              <div onClick={() => navigate('/' + event?.event_hash)} className='orma_recent_item'>
                <div className="orma_recent_image">
                  <img src={event?.event_profile_image_url} width={150} />
                </div>
                <div style={{ marginTop: '10px' }}>
                  <div className="banner-text">{event && event?.name}</div>
                  <div className="banner-text-small">{event && event.event_date}</div>
                  <div className="bottom-button"><Button style={{ backgroundColor: "#000", fontSize: '13px', color: "#fff", borderRadius: '5px' }} value="View" /></div>
                </div>
              </div>
            ))}
            {/* <div className="orma_recent_title_box"> 
            <span style={{paddingRight: '10px', marginTop: '-5px', display: 'flex', gap: '3px'}}>
              <Button style={{backgroundColor: "#000", fontSize: '13px', color: "#fff", borderRadius: '5px', width: '120px', height: '20px'}} value="Create an Orma" />
              <Button style={{backgroundColor: "#000", fontSize: '13px', color: "#fff", borderRadius: '5px', width: '120px', height: '20px'}} value="View my Orma's" />
              <Button style={{backgroundColor: "#000", fontSize: '13px', color: "#fff", borderRadius: '5px', width: '75px', height: '20px'}} value="Settings" />

              </span>
            </div> */}
            {/* {ormas && <span style={{display: 'flex', padding: '18px', height: '8px', paddingTop: '5px'}}>Recently viewed Ormas</span>} */}

          </div></div>}
        {!rececnt && <MyOrmasMobileComponent/>}
      </div>
    </div>

  );
};

export default MainPage;