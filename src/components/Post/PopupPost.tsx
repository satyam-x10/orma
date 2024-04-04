// Home.jsx
import "./style.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser} from '@fortawesome/free-solid-svg-icons'
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-phone-number-input/style.css'
import { Post } from "../../types";
import Header from "../Header/header";

interface PostInterface{
  post?: Post | null,
  closeShowPopup: () => void;
}

const PopupPost = ({post, closeShowPopup}: PostInterface) => {
    return (
    <div className="overlay">
      <Header close={true} closeShowPopup={closeShowPopup}/>
       <div>
        {post && 
        <div>
        <div className="posts">
          <div className="post-header">
            <div className="first-row">
              <div><FontAwesomeIcon icon={faUser} style={{color: "#000000", fontSize: '18px'}} /></div>
              <div className="first-row-name">{post?.user?.name}</div>
            </div>
          </div>
          <div><LazyLoadImage 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            className="grid_image"
            src={post?.image_url} 
            loading="lazy" 
            placeholderSrc={post?.compressed_url ? post?.compressed_url : ''}
            /></div>
          <div className="name">
            <div><b>0</b> Likes</div>
            <div className="name-time">2 minutes ago</div>
            </div>
          <div className="post-description">
          </div>
        </div> 
        </div>}
       </div>
     </div>
  );
};

export default PopupPost;