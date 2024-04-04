import React, { useState, useEffect } from 'react';
import useHome from './hooks/useHome';
import useLiveFeed from './hooks/useLiveFeed';
import './style.css';
import img from '../../../src/assets/img.jpg';
import { QRCode } from 'react-qrcode-logo';
import LazyImage from '../Image/LazyImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { fetchPosts } from './services/homeApi';

export default function Slideshow() {
    const { event, event_hash } = useHome();
    const { posts } = useLiveFeed();
    const [slideposts, setSlidePosts] = useState(posts);
    const fullUrl = `${window.location.origin}${location.pathname}`;
    const qrValue = `${fullUrl}`;
    const [startIndex, setStartIndex] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [postOver, setPostOver] = useState(false);
    const [loading, setLoading] = useState(false);
    async function getNewPosts() {
        if (event_hash && !postOver) {
            setLoading(true);
            const newPosts = await fetchPosts(event_hash, pageNumber + 1);
            if (newPosts?.posts) {
                setSlidePosts(prevSlidePosts => ({
                    ...prevSlidePosts,
                    posts: [...(prevSlidePosts?.posts) || [], ...(newPosts?.posts) || []]
                }));
                setLoading(false);
                if (newPosts?.posts?.length < 9) {
                    setPostOver(true);
                }
            }

        }
    }
    useEffect(() => {
        if (posts) {
            setSlidePosts(posts);
        }
    }, [posts]);
    useEffect(() => {
        setPageNumber(((slideposts?.posts?.length) || 9) / 9);
        if (slideposts?.posts && !loading) {
            const fetchData = async () => {
                if (postOver) {
                    return;
                }
                await getNewPosts();
            };    
            fetchData();
        }       

    }, [slideposts]);
    function arraysEqual(arr1, arr2) {
        // Check if arrays have same length
        if (arr1.length !== arr2.length) {
            return false;
        }
    
        // Sort both arrays
        const sortedArr1 = arr1.slice().sort();
        const sortedArr2 = arr2.slice().sort();
    
        // Compare each element
        for (let i = 0; i < sortedArr1.length; i++) {
            if (sortedArr1[i] !== sortedArr2[i]) {
                return false;
            }
        }
    
        return true;
    }
    useEffect(() => {
        if (posts){
            const interval = setInterval(() => {
                setStartIndex(prevIndex => (prevIndex + 2) % slideposts?.posts?.length);
            }, 2000); 
            return () => clearInterval(interval);
        }
    }, [slideposts]);
    
    useEffect(() => {
        const fetchData = async () => {
            if (posts) {
                const checknewPosts = await fetchPosts(event_hash ?? '', 1);
                const checknewIDs = checknewPosts?.posts?.map(post => post.id);
                const postsIDs = posts?.posts?.map(post => post.id);

                const isNewPosts = (arraysEqual(checknewIDs,postsIDs)) ? false : true;
                
                if (isNewPosts) {
                    // Filter checknewPosts?.posts to exclude posts with IDs already present in slidePosts.posts
                    const newPostsToAdd = checknewPosts?.posts?.filter(post => !slideposts?.posts?.some(existingPost => existingPost.id === post.id));
                
                    // Update slidePosts.posts by appending newPostsToAdd
                    setSlidePosts(prevSlidePosts => ({
                        ...prevSlidePosts,
                        posts: [...(prevSlidePosts?.posts) || [], ...newPostsToAdd]
                    }));
                }
            }
        }; const intervalId = setInterval(fetchData, 3000);

        return () => clearInterval(intervalId);
    }, [posts]);
    return (

        <div className='slideshow-container'>
            <div className='event-name'>{event?.name}</div>
            <div className='event-date'>{event?.event_date}</div>

            <div className='slides'>
                <div className='images'>
                    {posts&&<>{slideposts?.posts?.slice(startIndex, startIndex + 2).map((post, index) => (
                        <Slides key={index} post={post} />
                    ))}</>}
                </div>
                <div className='qr-code'>
                    <span className="logo">orma<span className='dot-logo'>.</span></span>
                    <span >Moments into memories</span>
                    <span className='qr' >
                        <div className="qrcodecover" style={{ padding: '15px' }}>
                            {qrValue && <QRCode
                                qrStyle='dots'
                                size={200}
                                value={qrValue}
                                eyeRadius={5}
                            />}
                        </div>
                    </span>
                    <span >Scan QR code to add photos</span>
                </div>
            </div>
        </div>

    );
}

function Slides({ post }: { post: any }) {
    return (
        <div className='img' >
            <div><img src={post.image_url} alt="img" /></div>
            <div className='info'>
                <div>{post.User.name}</div>
                <div>{post.Likes.length}<FontAwesomeIcon className='icon' icon={faHeart} /></div>
            </div>
        </div>
    );
}
