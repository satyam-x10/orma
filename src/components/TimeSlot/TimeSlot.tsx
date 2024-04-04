import "./style.module.css"
import Header from '../Header/header'

import useTimeslot from '../home/hooks/useTimeslot'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import moment from "moment"

const getClassName = (numberofphotos: number) => {
	switch (numberofphotos) {
		case 3:
			return {
				grid: 'three-grid',
				item: 'threeItem'
			}
		case 4:
			return {
				grid: 'four-grid',
				item: 'four-item'
			}
		case 5:
			return {
				grid: 'five-grid',
				item: 'fiveItem'
			}
		case 6:
			return {
				grid: 'three-grid',
				item: 'threeItem'
			}
		case 7:
			return {
				grid: 'seven-grid',
				item: 'sevenItem'
			}
		case 8:
			return {
				grid: 'normal-grid',
				item: 'normal-item'
			}
		case 9:
			return {
				grid: 'nine-grid',
				item: 'nineItem'
			}
		default: 
			return { grid: 'grid', item: 'grid-item'}

	}
}

const TimeSlot = () => {
	
	const { loading, event, navigatePost, event_hash, loadMoreLoading, endRef, timeslot, stopLoadingMore, handleImageLoad, imagesLoaded } = useTimeslot();
	const count = timeslot && event && event[timeslot] && event[timeslot].length;
  	const class_name = count < 3 ? { grid: 'normal-grid', item: 'normal-item'}: getClassName(count)
	const time = moment(timeslot).format('MMMM DD,  YYYY hh:mm A');

	return (
		<div>
			<div>
				<Header back={true} />
			</div>
			<div className='orma-page-container' style={{ display: 'flex', flexDirection: 'row', padding: '10px', marginBottom: '10px' }}>
				<div>
					<span className='ormaFeedTitles' style={{ fontSize: '20px' }}>
						
					</span>
					{/* <p className="smallTextUnderTitle"> {time} </p> */}
				</div>
			</div>
			{loading &&
				<div>
					<div className="loadingPage">
						<FontAwesomeIcon style={{ fontSize: '60px' }} icon={faSpinner} spin />
					</div>
				</div>
			}
			<div className='orma-page-container' style={{marginTop: '0px'}}>
				<div style={{ margin: '20px', marginBottom: '60px'}}>
				{ event && event[0] && <div><img 
                        src={event[0].Post?.image_url}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                       // "lazy" class to style the loading effect if needed
                    /></div>}
				</div>
				<div className={class_name?.grid}>
					{event && event.map((or: any, key: number) => 
					<div 
						onClick={() => navigatePost(`../${event_hash}/post/`+ or?.Post?.id)} className={class_name?.item} key={key}>
						<img 
							id={'orma_feed'+key}
							key={key}
							src={or.Post?.image_url}
							onLoad={handleImageLoad}
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'cover'
							}}
							className="grid_image" // "lazy" class to style the loading effect if needed
						/>

                	</div>)
            		}
				</div>
				{event && event.length > 0 && imagesLoaded === event.length && 
					<div style={{display: 'flex', justifyContent: 'center'}}className="endOfPage" ref={endRef}>
						{!stopLoadingMore && <p>Loading more...</p>}
					</div>
				}
			</div>
			{loadMoreLoading && 
			<div>
			<div style={{display: 'flex', justifyContent: 'center', margin: 40}}>
				<FontAwesomeIcon style={{fontSize: '30px'}} icon={faSpinner} spin />
				</div>
			</div>
				}
		</div>
	)
}

export default TimeSlot