// Login.js
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import { AuthContextProps } from '../../types';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from "../Button";
import useVerify from './hooks/useVerify';
import Header from "../Header/header";

const Login: React.FC = () => {
  const { verifyUser, setPhoneNumber, error, showCodeView, verifyDigitCode, code, setCode, nameVerify, setName , currentUrl } = useVerify();
  
  return (
      
      <div >
        <Header back={true} />
        {!showCodeView && <div className='loginModule'>
          <div className="loginModule-container">
          {/* <span className="logo">ORMA</span> <br />
          <span className="logo-small-text">moments of memories</span> */}
          <div style={{fontSize: '13px'}}>
            {/* <img src={verifyLogo} width="200"/> */}
            <h2>Verify Identity</h2>
            <p>Orma allows users to create passwordless account to upload content. Please enter your phone number to recieve a code.By providing your number, you are agreeing to allow Orma to send one time code via sms.</p>
          </div>
          <div className="login-form">
          <PhoneInput
            defaultCountry="US"
            placeholder="Phone number"
            onChange={(e) => setPhoneNumber(e ? e: '')}/>
            <Button onClick={() => verifyUser()} value="Verify" style={{padding: '12px', background: '#000', color: '#fff', borderRadius: '0px 10px 10px 0', fontSize: '14px',boxShadow: '0 0 1px #000', height: '18px'}} />
          </div>
          <div style={{padding: '8px', paddingLeft: '45px', fontSize: '13px', color: "#e74c3c"}}>
          <span>{error ? error : null}</span>
          </div>
          </div>
        </div>}
        {showCodeView && <div className={currentUrl.includes('login') ? 'loginModule' : 'loginModule popup-content'} >
          <div className="loginModule-container">
          {/* <span className="logo">ORMA</span> <br />
          <span className="logo-small-text">moments of memories</span> */}
          <div style={{fontSize: '13px', display: 'block'}}>
            {/* <img src={verifyLogo} width="200"/> */}
            <h2>Enter 4 digit code</h2>
            <p style={{padding:0, margin:0}}>Please enter 4 digit code that was sent from Orma to your phone number. It could take about 30 seconds to 1 minute. The code will expire after 5 mins.</p>
          </div>
          <div className="login-form" style={{display: 'block',}}>
          
          {nameVerify === false && <input
            type='text'
            placeholder="Enter your first name and last name"
            onChange={(e) => setName(e.target.value)}
          /> }
          <input
            type='text'
            maxLength={4}
            placeholder="Enter 4 digit code"
            onChange={(e) => setCode(e.target.value)}/>
            <Button onClick={() => verifyDigitCode()}style={{padding: '12px', background: '#000', color: '#fff',fontSize: '14px', width: '100px', borderRadius: '5px'}} value="Verify" />
          </div>
          <div style={{padding: '10px', fontSize: '14px', color: "#e74c3c"}}>
          <span>{error ? error : null}</span>
          </div>
          </div></div>}
        </div>
  );
};

export default Login;
