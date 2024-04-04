// import { LazyLoadImage } from "react-lazy-load-image-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faUser, faHeart} from '@fortawesome/free-solid-svg-icons'
import useLiveFeed from "./hooks/useLiveFeed";
import PopUp from '../PopUp/PopUp';
const VerticalFeed = () => {
    const {posts, loading, endOfPostsRef, containerRef, loadMoreLoading, handleDoubleClick, showHeart, getTime, likedPostId, showPopup, setShowPopup } = useLiveFeed();
  
    return (
        <div>
        {loading && 
        <div>
            <div className="loadingPage">
                <FontAwesomeIcon style={{fontSize: '30px'}} icon={faSpinner} spin />
            </div>
        </div>}
        {posts?.error !== null && posts && posts?.posts?.length === 0  && <div>There are no posts for this feed</div>}
        {posts?.error !== null  && <div>There was an error loading your feed</div>}
        {posts?.posts && posts?.posts?.length !== 0 &&  posts?.posts?.map((post, key) => 
        <div  ref={containerRef} className="posts" key={post?.id}>
          <div className="post-header">
            <div className="first-row">
              <div><FontAwesomeIcon icon={faUser} style={{color: "#000000", fontSize: '18px'}} /></div>
              <div className="first-row-name">{post?.user?.name}</div>
            </div>
          </div>
          <div className='image-container' onDoubleClick={() => handleDoubleClick(post?.id)}>
          {showPopup && <PopUp message="You must be logged in to like a post" showPopup={showPopup} setShowPopup={setShowPopup} />}
  
          {post?.id === likedPostId && 
                <div className="like-cover">
                  <FontAwesomeIcon     
                      style={{
                        fontSize: '3em', 
                        color: '#fff', 
                        textShadow: '0 0 5px rgba(0, 0, 0, 0.5)', 
                        animation: 'scaleAndFade 1s forwards'
                      }}  
                      icon={faHeart} 
                  />
                </div>
              }
              <img 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              className="grid_image"
              src={post?.image_url} // Thumbnail or low-quality image placeholder
            />
            </div>
          <div className="name">
            <div><b>{post?.Likes?.length}</b> &nbsp; <FontAwesomeIcon icon={faHeart} /> </div>
            <div className="name-time">{getTime(post?.createdAt)}</div>
            </div>
          <div className="post-description">
          </div>
          <div ref={endOfPostsRef} className="end-of-posts"></div>
        </div> 
        )}
        {loadMoreLoading && 
             <div>
            <div style={{display: 'flex', justifyContent: 'center', margin: 40}}>
                <FontAwesomeIcon style={{fontSize: '30px'}} icon={faSpinner} spin />
            </div>
            </div>}
        </div>
    )

}
export default VerticalFeed;

