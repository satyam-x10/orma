import './style.css';
import Button from '../Button';
import Header from "../Header/header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import AuthContext from '../../context/auth/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { useNavigate, useParams } from 'react-router-dom';
import useVerify from '../login/hooks/useVerify';
import { changeUserName } from '../login/services/authApi';
const Profile = () => {

    const {user, logout, fetchName} = useContext(AuthContext);
    const phone = user?.phone ? parsePhoneNumberFromString("+"+user?.phone): null;
    const navigate = useNavigate();
    const { event_hash} = useParams();
    const { userName, setUserName } = useContext(AuthContext);
    const [updateNameForm, setUpdateNameForm] = useState(false);
    
    const signout = () => {
        logout();
        if(event_hash){
            navigate('/'+event_hash)
        }else{
            navigate('/')
        }
    }

    const changeName = (name: string) => {
        setUserName(name);
        changeUserName( name );
        setUpdateNameForm(false);        
    }
    useEffect(() => {
        fetchName();
    }, []);
    return (
        <div>
            <Header back={true} />
            {user && <div style={{marginTop: '20%'}}>
                <div  style={{display: 'flex', justifyContent: 'center'}}> 
                    
                    <div className='user-big-logo'>
                        <FontAwesomeIcon className="circle-icon" icon={faUser} />
                    </div>
                
                </div>
                
                <div style={{ height: "35vh" }} className="upload-page-round-box">
                    {!updateNameForm && <div style={{ marginTop: '60px' }}>
                        <span className="upload-title">{ userName?userName:user.name}</span>
                        <p style={{ marginTop: '5px', fontSize: '13px' }}>Your name radiates charm, just like you!</p>
                        <Button onClick={() => setUpdateNameForm(true)} style={{ margin: '10px auto', width: '100%', color: "#fff", backgroundColor: '#000', height: 'auto', borderRadius: '3px', padding: '6px', fontSize: '14px' }} value="CHANGE NAME" />

                        {phone &&
                            <div>
                                <span className="upload-title">{phone.formatNational()}</span>
                                <p style={{ marginTop: '5px', fontSize: '13px' }}>No need to stress, we don't sell your data.</p>
                            </div>
                        }

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '20px' }}>
                            <Button onClick={() => signout()} style={{ margin: '10px auto', width: '100%', color: "#fff", backgroundColor: '#000', height: 'auto', borderRadius: '3px', padding: '6px', fontSize: '14px' }} value="SIGN OUT" />
                        </div>
                        <div>


                        </div>
                    </div>}

                    {updateNameForm &&
                        <div>
                            <input
                                type='text'
                                placeholder="Enter your new Full Name"
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <Button onClick={() => changeName(userName?userName:user.name) } style={{ margin: '10px auto', width: '100%', color: "#fff", backgroundColor: '#000', height: 'auto', borderRadius: '3px', padding: '6px', fontSize: '14px' }} value="UPDATE NAME" />
                        </div>
                    }

                </div>
            </div>}

        </div>)
};

export default Profile;
