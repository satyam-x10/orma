import LazyImage from "../Image/LazyImage";
import useOrmaFeed from "./hooks/useOrmaFeed"
import PostView from "./PostView";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import moment from "moment";
const MainOrmaFeed = (eventData: any) => {
    
    const {loading, event, containerRef, navigatePost, event_hash} = useOrmaFeed();
    const getClassName = (numberofphotos: number) => {
        switch(numberofphotos) {
            case 3:
                return {
                    grid: 'three-grid',
                    item: 'threeItem'
                }
            // case 4:
            //     return {
            //         grid: 'four-grid',
            //         item: 'four-item'
            //     }
            // case 5: 
            //     return {
            //         grid: 'five-grid',
            //         item: 'fiveItem'
            //     }
            case 6: 
                return {
                    grid: 'grid-timeline',
                    item: 'grid-item-timeline'
                }
            // case 7: 
            //     return {
            //         grid: 'three-grid',
            //         item: 'threeItem'
            //     }
            // case 8: 
            // return {
            //     grid: 'three-grid',
            //     item: 'threeItem'
            // }
            // case 9: 
            //     return {
            //         grid: 'nine-grid',
            //         item: 'nineItem'
            //     }
            default:
                return {
                    grid: 'grid-timeline',
                    item: 'grid-item-timeline'
                }
        
        }
    }
    let count = event && event.memories && event.memories.length > 6 ? 6 : event && event.memories && event.memories.length;
    let class_name = count < 3 ? { grid: 'normal-grid', item: 'normal-item'}: getClassName(count)

    return(
        <div style={{background: '#ededed', width: '100%', height: '100%', marginTop: '-10px'}}>
        <div className="timeLineFeed">
            {event && Object.keys(event).length === 0 && <p>There are no Orma to view</p>}
            <div>{event_hash && event && event.memories && event.memories.length !== 0 && 
            <div style={{ marginBottom: '10px', marginTop: '10px'}}>
            <div className='ormaFeedTitles' style={{fontSize: '20px'}}>
                Memories
                <p style={{fontSize: '11px', margin: 0, marginBottom: '5px', marginTop: '5px', color: "#7c7c7c"}}>{event?.memories && moment(event?.memories[0]?.original_photo_date).format('MMM DD, YYYY')} - {event?.memories && moment(event?.memories[event?.memories?.lenght-1]?.original_photo_date).format('MMM DD, YYYY')}</p>
            </div>
            
            <div className="pastOrma" style={{display: 'flex', flexDirection:'row', gap: '3px', height: '140px'}} onClick={() => {navigatePost('./memories/viewall')}} ref={containerRef}>
                {event_hash && event && event.memories && event.memories.length !== 0 && event.memories.slice(0,10).map((post: any, key: number) => key <= 5 && 
                    <LazyImage 
                            id={'orma_feed_ormas'+key}          
                            src={post?.image_url}
                            placeholder={post?.compressed_url} // Thumbnail or low-quality image placeholder
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 0
                            }}
                            className="grid_image" // "lazy" class to style the loading effect if needed
                        />)
                }
                </div></div>}
            </div>
            
            <div>
            <div style={{ marginBottom: '25px',  marginTop: '25px'}}>
                {/* <div style={{display: 'flex', justifyContent: 'center', margin: '0px'}}>                        
                        <img src={eventData?.event_profile_image_url} width={50} height={50} style={{borderRadius:'100px', objectFit: 'cover', border: '3px solid #fff'}} />
                </div> */}
            </div>
                {event && event && Object.keys(event).map((timeslot:string, index: number) => timeslot !== 'memories' && event[timeslot].length > 0 &&
                    
                    <div onClick={() => navigatePost(`/${event_hash}/timeslot/${timeslot}`)}  key={index} style={{margin: '0px -10px 30px 0px'}}>
                        <PostView navigatePost={navigatePost} event={event} containerRef={containerRef} index={index} timeslot={timeslot} />
                    </div>

                )}
            </div>
            <div>{loading ? <div>
        <div className="loadingPage">
           <FontAwesomeIcon style={{fontSize: '60px'}} icon={faSpinner} spin />
        </div></div>: null}</div>
        </div></div>
    )

}
export default MainOrmaFeed