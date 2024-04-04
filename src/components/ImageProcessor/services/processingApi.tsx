// apiService.ts
import { PostsResponse } from '../../../types';
import axiosInstance from '../../../api';
const API_URL = import.meta.env.VITE_API_URL;
import Cookies from 'js-cookie';
const fetchProcessingPosts = async (event_hash: string): Promise<PostsResponse> => {
  let token = Cookies.get('token');
  
  if(!token) {
    return { posts: null, error: 'Invalid token', status: 401 };
  }

  try {
    const response = await axiosInstance.get(API_URL+'/events/'+ event_hash+'/pending_posts', {
      headers: {
          'Authorization': token
      }
  });
    if(response.status === 200){
      return { posts: response.data, error: null, status: 200  };
    }
    if(response.status === 401){
      return { posts: null, error: 'Error fetching posts', status: 401 };
    }
    
    return { posts: null, error: 'Error fetching posts', status: 404  };
  } catch (error: any) {
    console.error(error);
    return { posts: null, error: error.message, status: 500 };
  }
};

export { fetchProcessingPosts };