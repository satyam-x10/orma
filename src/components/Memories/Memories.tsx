import Header from '../Header/header'
import "./style.module.css"
import useOrmaFeed from '../home/hooks/useOrmaFeed'
import LazyImage from '../Image/LazyImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'
const Memories = () => {
	const { loading, event, containerRef, navigatePost, event_hash,MemoryRef,endOfMemoryRef,loadMoreLoading } = useOrmaFeed();
	return (
		<div>
			<div>
				<Header back={true} />
			</div>
			<div className='orma-page-container' style={{display: 'flex', flexDirection: 'row', padding: '10px', marginBottom: '10px'}}>
                <div style={{margin: '10px'}}>
                    <span className='ormaFeedTitles' style={{fontSize: '20px'}}>
                        Memories from the past          
                    </span>
                    <p className="smallTextUnderTitle">Collection of memories from the event </p>
                </div>
            </div>
			{loading &&
				<div>
					<div className="loadingPage">
						<FontAwesomeIcon style={{ fontSize: '30px' }} icon={faSpinner} spin />
					</div>
				</div>
			}
			<div>
				{!loading && <div className='orma-page-container' style={{marginTop: '0px'}}>
					<div ref={MemoryRef} className='grid'>
						{event_hash && event && event.memories && event.memories.length !== 0 && event.memories.map((post: any, key: number) =>
							<Link to={`/${event_hash}/post/${post?.id}`} className='grid-item'
								>
								<LazyImage
									id={'orma_feed_ormas' + key}
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
							</Link>


						)}
					</div>
					<div ref={endOfMemoryRef} className="end-of-posts"></div> {/* Add this line */}
					{loadMoreLoading &&
					<div>
						<div style={{ display: 'flex', justifyContent: 'center', margin: 40 }}>
							<FontAwesomeIcon style={{ fontSize: '30px' }} icon={faSpinner} spin />
						</div>
					</div>}
				</div>}
			</div>
		</div>
	)
}

export default Memories