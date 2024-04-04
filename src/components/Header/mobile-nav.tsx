import React, { SetStateAction, useContext } from 'react'
import Home from '../../assets/svgs/home'
import User from '../../assets/svgs/user'
import Aperture from '../../assets/svgs/aperture'
import Settings from '../../assets/svgs/settings'
import Logout from '../../assets/svgs/logout'
import NewLogo from '../../assets/new-logo.png';
import './style.css'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/auth/AuthContext'

type Props = {
    sidebar: boolean,
    setSidebar: React.Dispatch<SetStateAction<boolean>>
}

export const MobileNav: React.FC<Props> = ({ sidebar,setSidebar}) => {
    const navigate = useNavigate();
    const {user,logout} = useContext(AuthContext);
    const {event_hash} = useParams();

    const signout = () => {
        logout();
        if(event_hash){
            navigate('/'+event_hash)
        }else{
            navigate('/')
        }
    }

    return (
        <div className={sidebar ? "sidebar sidebar-open" : "sidebar"}>
            <div className='sidebar-top'>
                <Link 
                to='/'
                onClick={()=>setSidebar(false)}
                className='sidebar-item'>
                    <Home /><p className='sidebar-text'>HOME</p>
                </Link>

                <Link
                to='/profile'
                onClick={()=>setSidebar(false)}
                className='sidebar-item'>
                    <User /><p className='sidebar-text'>PROFILE</p>
                </Link>
                <Link
                to=''
                onClick={()=>setSidebar(false)}
                className='sidebar-item'>
                    <Aperture /><p className='sidebar-text'>MY ORMAS</p>
                </Link>
                <Link
                to='/'
                onClick={()=>setSidebar(false)}
                className='sidebar-item'>
                    <Settings /><p className='sidebar-text'>SETTINGS</p>
                </Link>
                {user && <Link 
                onClick={()=>{
                    setSidebar(false)
                    signout()
                }}
                to='' 
                className='sidebar-item'>
                    <Logout /><p className='sidebar-text'>LOGOUT</p>
                </Link>}
                {!user && <Link 
                onClick={()=>{
                    setSidebar(false)
                    // navigate('/login');
                }}
                to='/login' 
                className='sidebar-item'>
                    <Logout /><p className='sidebar-text'>LOGIN</p>
                </Link>}
            </div>

            <div className='sidebar-footer'>
                <div className="" onClick={() => navigate('/')}>
                    {/* <span onClick={() => navigate('/')} className="logo_sidebar">orma<span className='dot-logo'>.</span></span> */}
                    <img src={NewLogo} alt="orma-logo" onClick={() => navigate('/')} className='logo_sidebar' />
                    {/* <p className='sidebar-footer-text'>Moments turn into memories</p> */}
                </div>
            </div>

        </div>
    )
}