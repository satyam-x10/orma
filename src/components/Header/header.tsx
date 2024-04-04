import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUniversity, faUser, faCog, faAngleLeft, faBars} from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/auth/AuthContext'
import { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MobileNav } from './mobile-nav';
import Backdrop from './backdrop';
import Home from '../../assets/svgs/home'
import User from '../../assets/svgs/user'
import Aperture from '../../assets/svgs/aperture'
import Settings from '../../assets/svgs/settings'
import Logout from '../../assets/svgs/logout'
interface HeaderProps {
    back?: boolean;
    close?: boolean;
    closeShowPopup?: () => void;
}
  

const Header: React.FC<HeaderProps>  = ({back = false, close=false, closeShowPopup }) => {
    const {user,logout} = useContext(AuthContext);
    const navigate = useNavigate(); 
    const {event_hash} = useParams();
    const [sidebar,setSidebar] = useState(false)
    const [showBurgerMenu, setShowBurgerMenu] = useState(false)
    const handleBurgerMenu = () => {
        setShowBurgerMenu(!showBurgerMenu);
        if (!showBurgerMenu) {
            setTimeout(() => {
                document.querySelector('.burger-menu-items')?.classList.add('done');
            }, 700); //  0.7 second is  the animation time
        }
    }
    const toggleSidebar = () =>{
        setSidebar((prev)=>!prev)
    }

    const navigateUser = () => {
        if(user !== null){
            navigate('/profile');     
        }else{
            navigate('/login');
        }
    }
    const signout = () => {
        logout();
        navigate('/login')
    }
    return (
    <div>
    <MobileNav
    sidebar={sidebar}
    setSidebar={setSidebar}
    />
    <Backdrop
    setSidebar={setSidebar}
    sidebar={sidebar}
    />
    <div className="desktop-menu">
    <div className="header">
            <div className="header-inside">
                <div className="header-logo-left">
                <div className="" onClick={() => navigate('/')}>
                    <span onClick={() => navigate('/')} className="logo">orma<span className='dot-logo'>.</span></span>
                    </div>
                </div>
                <div className="right"> 
                    <span className="user_image">
                    <FontAwesomeIcon className='burger-icon' onClick={handleBurgerMenu} icon={faBars} />
                     </span>
                     {showBurgerMenu && 
                        <div className='burgermenu'>
                        <div className='menu-item' onClick={() => navigate('/')}>
                            <span>HOME</span>
                        </div>
                        <div className='menu-item' onClick={() => navigate('/profile')}>
                            <span>PROFILE</span>
                        </div>
                        <div className='menu-item' onClick={() => navigate('/myormas')}>
                            <span>MY ORMAS</span>
                        </div>
                        <div className='menu-item' onClick={() => navigate('/settings')}>
                            <span>SETTINGS</span>
                        </div>
                        {user && <div className='menu-item' onClick={signout}>
                            <span>LOGOUT</span>
                        </div>}
                        {!user && <div className='menu-item' onClick={() => navigate('/login')}>
                            <span>LOGIN</span>
                        </div>}
                    </div>}
                </div>
                {/* <div className="left">
                    {!close && back &&  <span onClick={() => navigate(-1)} className="burger-left-button"><FontAwesomeIcon icon={faAngleLeft} /></span> }
                    {!close && !back && <span className="burger-menu"><FontAwesomeIcon icon={faBars} /></span>}
                    {close && !back &&  closeShowPopup && <span onClick={() => closeShowPopup()} className="burger-left-button"><FontAwesomeIcon icon={faAngleLeft} /></span>}
                    </div> */}
                {/* <div className="center" onClick={() => navigate('/')}>
                    <span className="logo">ORMA</span>
                    </div> */}
                {/* <div className="right">  
                    <span onClick={() => navigateUser()} className="user_image">
                        <FontAwesomeIcon icon={faUser} />
                    </span>
                </div> */}
            </div>
        </div>
        {/* <div className="sideBarLogo">
        <div onClick={() => navigate('/')}>
            <span className="logo">ORMA</span>
            <div className="desktop-menu-items">
                <div className="menu-item"><span>HOME</span></div>
                <div className="menu-item"><span>ORMAS</span></div>
                <div className="menu-item"><span>PROFILE</span></div>
                <div className="menu-item"><span>SETTINGS</span></div>
            </div>
        </div>
        </div> */}
    </div>
        <div className='header_container'>
        <div className="header">
            <div className="header-inside">
                <div className="left">
                    {!close && back &&  <span onClick={() => navigate(-1)} className="burger-left-button"><FontAwesomeIcon icon={faAngleLeft} /></span> }
                    {!close && !back && <span className="burger-menu"><FontAwesomeIcon 
                    onClick={toggleSidebar}
                    icon={faBars} /></span>}
                    {close && !back &&  closeShowPopup && <span onClick={() => closeShowPopup()} className="burger-left-button"><FontAwesomeIcon icon={faAngleLeft} /></span>}
                    </div>
                <div className="center" onClick={() => navigate('/')}><span className="logo">orma<span className='dot-logo'>.</span></span></div>
                <div className="right">  
                    <span onClick={() => navigateUser()} className="user_image">
                        <FontAwesomeIcon icon={faUser} />
                    </span>
                </div>
            </div>
        </div>
        <div className="header-placeholder"></div> 
        </div>
        </div>
    )

}

export default Header;