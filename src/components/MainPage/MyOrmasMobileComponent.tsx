import React, { useContext, useEffect } from 'react'
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';


function MyOrmasMobileComponent({}) {
    const navigate = useNavigate();
    const login = () => {
      navigate('/login');
    }
    const { user, fetchMyOrmas, myOrmas } = useContext(AuthContext);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const options: any = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };


    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    fetchMyOrmas()
  }, [])
  return (
    <div>
          {user && <div style={{ padding: '3px' }}>
            <div className='my-ormas-top'
            >
              <p></p>
              <Button onClick={() => navigate('/create/orma')} style={{ color: "#fff", backgroundColor: '#000', width: '120px', height: 'auto', borderRadius: '3px', padding: '5px', fontSize: '14px' }} value="Create an Orma" />
            </div>
            <div style={{ padding: '15px', height: '20px', background: "#eee" }}>
              <div className='my_ormas_list'>
                {myOrmas && myOrmas?.map(event => (
                  <div onClick={() => navigate('/' + event?.event_hash)} className='orma_recent_item my_orma_item'>
                    <div className="orma_recent_image">
                      <img src={event?.event_banner_url} width={150} />
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
          </div>}
          {!user && <div>
            <div style={{ backgroundColor: '#eee' }} className="loginModule-container">
              {/* <span className="logo">ORMA</span> <br />
                  <span className="logo-small-text">moments of memories</span> */}
              <div style={{ fontSize: '13px' }}>
                {/* <img src={verifyLogo} width="200"/> */}
                <h2>Sign Up or Sign in</h2>
                <p>Orma allows users to capture precious memories and moments.Please sign in or sign up to create your Orma.</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <Button value="Sign In" onClick={() => login()} />
                  <Button value="Sign Up" onClick={() => login()} /></div>
              </div>
              <div className="login-form">
              </div>
            </div>
          </div>}
        </div>
  )
}

export default MyOrmasMobileComponent