import React, { FC, useState } from 'react';
import './style.css';
import { useNavigate ,useParams } from 'react-router-dom'
import Login from '../login/login';
interface PopupProps {
  message: string;
  showPopup: boolean;
  setShowPopup: (showPopup: boolean) => void;
  // onClose: () => void;

}

const Popup: FC<PopupProps> = ({ message, showPopup, setShowPopup }) => {
  const [login, setLogin] = useState(false);
  return (
    <div className="popup-container">
      <div className="popup-content">
        {login && <Login />}
        {!login && <h4>{message}</h4>}
        <div className='popup-btns'>
          {!login && <button onClick={() => {
            setLogin(true);
            
          }}>Login</button>}
          <button onClick={() => {setShowPopup(false);
           }}>Close</button>
        </div>

      </div>
    </div>
  );
};

export default Popup;
