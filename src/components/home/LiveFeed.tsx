import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'
import useLiveFeed from "./hooks/useLiveFeed";
import LazyImage from '../Image/LazyImage';

const OrmaFeed = () => {
    const {posts, loading, endOfPostsRef, containerRef, loadMoreLoading, navigatePost} = useLiveFeed();

    return (
        <div style={{padding: '5px'}}>
        {loading && 
        <div>
            <div className="loadingPage">
                <FontAwesomeIcon style={{fontSize: '30px'}} icon={faSpinner} spin />
            </div>
        </div>}
        {!loading && posts?.error !== null && posts && posts?.posts?.length === 0  && <div>There are no posts for this feed</div>}
        {!loading && posts?.error !== null  && <div>There was an error loading your feed</div>}
        {!loading && posts?.error === null && !loading && posts && posts?.posts?.length !== 0  && 
            <div ref={containerRef} className="grid">
                {posts?.posts?.map((post, key) => 
                    <div onClick={() => navigatePost('./post/'+post?.id)} className="grid-item" key={post?.id}>
                        <LazyImage 
                            id={'grid_image'+key}
                            key={key}
                            src={post?.image_url}
                            placeholder={post?.compressed_url} // Thumbnail or low-quality image placeholder
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            className="grid_image" // "lazy" class to style the loading effect if needed
                            />
                        </div>
                )}
                <div ref={endOfPostsRef} className="end-of-posts"></div> {/* Add this line */}
            </div>}
            {loadMoreLoading && 
             <div>
            <div style={{display: 'flex', justifyContent: 'center', margin: 40}}>
                <FontAwesomeIcon style={{fontSize: '30px'}} icon={faSpinner} spin />
            </div>
            </div>}
        </div>
    )

}
export default OrmaFeed;

