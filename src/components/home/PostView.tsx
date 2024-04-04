
import moment from "moment"
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import SliderView from '../SliderView/SliderView';
import LazyImage from "../Image/LazyImage"

interface PostViewProps {
    event: any,
    containerRef: any,
    timeslot: string,
    index: number,
    navigatePost: any,
}

const getClassName = (numberofphotos: number) => {
    switch(numberofphotos) {
        case 3:
            return {
                grid: 'three-grid',
                item: 'threeItem'
            }
        case 6: 
            return {
                grid: 'grid-timeline',
                item: 'grid-item-timeline'
        }
        default:
            return {
                grid: 'grid-timeline',
                item: 'grid-item-timeline'
            }
    }
}

const getTitle = (index: number) => {
    switch(index) {
        case 1:
            return 'Day started out with'
    }
}

const PostView: React.FC<PostViewProps> = ({event, containerRef, index, timeslot, navigatePost}) => {
    const navigate = useNavigate();
    let count = event[timeslot].length;
    let class_name = count < 3 ? { grid: 'normal-grid', item: 'normal-item'}: getClassName(count)
    let time = moment(timeslot).format('MMMM DD,  YYYY');
    let hour = moment(timeslot).format('hh:mm A');
    // let title = getTitle(index);
    const viewAllHandler = () => {
        const fullyEncodedDatetime = timeslot.replace(/\./g, '%2E');
        const encodedDatetime = encodeURIComponent(fullyEncodedDatetime);
        navigate(`./timeslot/${encodedDatetime}`, {state: {timeslot}})
    }
    
    return (
    <div>
    {/* <div>
        <span>Bride looks beautiful</span> 
            <br />
            <span style={{fontSize: '10px'}}>{time}</span>
            
        <span style={{float: 'right', fontSize: '12px', marginTop: '-20px'}}>SHOW MORE</span></div> */}
                {/* <p className="smallTextUnderTitle" style={{ paddingTop:'5px'}}>{time} </p> */}
                                    {<div className='ormaFeedTitles' style={{fontSize: '20px'}}>
                                        {hour}  
                                        <p style={{fontSize: '12px', margin: 0, marginBottom: '10px', color: '#7c7c7c'}}>{time}</p>
                                        <div style={{float: "right", fontSize: '12px', marginRight: '10px', marginTop: '-45px'}}>
                                           
                                            </div>
                                    </div>}
            <div className={class_name?.grid} ref={containerRef}>
                {event && event[timeslot] && event[timeslot].map((or: any, key: number) => {
                        return (    <div className={class_name?.item}>
                            <LazyImage 
                              id={'orma_feed' + or.key} // Assuming 'or.key' exists and is unique
                              src={or.Post?.image_url}
                              placeholder={or.Post?.compressed_url}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              className="grid_image"
                            />
                          </div>)
                })}
                {/* {event && event[timeslot] && event[timeslot].length > 3 && event[timeslot].map((or: any, key: number) => {
                        return ( 
                            <div className={class_name?.item}>
                                <SliderView or={event[timeslot]} key={key} navigatePost={navigatePost} class_name={class_name}/>
                          </div>)
                })} */}
    
            </div>
    
        {/* {col === 1 && 
        <div className='grid' ref={containerRef} key={index}>
            {state.ormaFeed && state.ormaFeed[timeslot] && state.ormaFeed[timeslot].map((or: any, key: number) => <div className='horizontal-scroll-item' key={key}>
                <img 
                        key={key}
                        data-src={or.Post?.image_url}
                        src={or.Post?.compressed_url} // Thumbnail or low-quality image placeholder
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
        } */}
    </div>
    )
}

export default PostView;