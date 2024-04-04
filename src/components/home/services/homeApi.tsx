// apiService.ts

import { CommentsResponse, EventResponse, Post, PostResponse, PostsResponse } from '../../../types';

import Cookies from 'js-cookie';
import axiosInstance from '../../../api';

const API_URL = import.meta.env.VITE_API_URL;


const fetchPosts = async (event_hash: string, page: number = 1): Promise<PostsResponse> => {
  try {
    const response = await axiosInstance.get(API_URL + '/events/' + event_hash + '/posts/' + page);
    if (response.status === 200) {
      return { posts: response.data, error: null };
    }
    return { posts: null, error: 'Error fetching posts' };
  } catch (error: any) {
    console.error(error);
    return { posts: null, error: error.message };
  }
};

const fetchMyOrmas = async (event_hash: string, page: number = 1): Promise<PostsResponse> => {
  try {
    const response = await axiosInstance.get(API_URL + '/events/' + event_hash + '/posts/' + page);
    if (response.status === 200) {
      return { posts: response.data, error: null };
    }
    return { posts: null, error: 'Error fetching posts' };
  } catch (error: any) {
    console.error(error);
    return { posts: null, error: error.message };
  }
};

const fetchOrmaFeedTimeSlots = async (event_hash: string, page: number = 1) => {
  try {
    const response = await axiosInstance.get(API_URL + '/events/' + event_hash + '/ormafeed',
      {
        params: {
          pageNumber: page
        }
      });
    if (response.status === 200) {
      return { posts: response.data, error: null };
    }
    return { posts: null, error: 'Error fetching Orma Feed' };
  } catch (error: any) {
    console.error(error);
    return { posts: null, error: error.message };
  }
};
const fetchMemories = async (event_hash: string, page: number = 1) => {
  try {
    const response = await axiosInstance.get(API_URL + '/events/' + event_hash + '/ormafeed/memories',
      {
        params: {
          pageNumber: page
        }
      });
    if (response.status === 200) {
      return { posts: response.data, error: null };
    }
    return { posts: null, error: 'Error fetching Orma Feed' };
  } catch (error: any) {
    console.error(error);
    return { posts: null, error: error.message };
  }
};
const fetchOrmaFeedByTimeSlot = async (event_hash: string, timeslot: string, page: number = 1) => {
  try {
    const response = await axiosInstance.get(API_URL + '/events/' + event_hash + '/ormafeed/' + timeslot,
      {
        params: {
          pageNumber: page
        }
      });
    if (response.status === 200) {
      return { posts: response.data, error: null };
    }
    return { posts: null, error: 'Error fetching Orma Feed' };
  } catch (error: any) {
    console.error(error);
    return { posts: null, error: error.message };
  }
};


const fetchPost = async (event_hash: string, id: string): Promise<PostResponse> => {
  try {
    const response = await axiosInstance.get(API_URL + '/events/' + event_hash + '/post/' + id);
    if (response.status === 200) {
      return { post: response.data, error: null };
    }
    return { post: null, error: 'Error fetching post' };
  } catch (error: any) {
    console.error(error);
    return { post: null, error: error.message };
  }
};

const deletePost = async (event_hash: string, post_id: Number) => {
  let token = Cookies.get('token');

  if (!token) {
    return { posts: null, error: 'Invalid token', status: 401 };
  }
  try {
    const response = await axiosInstance.delete(API_URL + `/events/${event_hash}/post/${post_id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
    })
    if (response.status === 204) return { error: null, success: true }
  } catch (err: any) {
    console.log("error in deleting post: ", err)
    return { error: err.message, success: false }
  }
};

const getFlaggedPosts = async (event_hash: string): Promise<any> => {
  let token = Cookies.get('token');

  if (!token) {
    return { error: 'Invalid token', status: 401 };
  }

  try {
    const response = await axiosInstance.get(`${API_URL}/events/${event_hash}/getfailedbynudity`, {
      headers: {
        'Authorization': token // Ensure your API expects the token in this format
      }
    });
    if (response.status === 200) {
      return { data: response.data, error: null, status: 200 };
    }
    // Handle other statuses as needed
    return { data: null, error: 'Error fetching flagged posts', status: response.status };
  } catch (error: any) {
    console.error(error);
    return { data: null, error: error.message, status: 500 };
  }
};

const updatePost = async (event_hash: string, post_id: string): Promise<any> => {
  let token = Cookies.get('token');

  if (!token) {
    return { error: 'Invalid token', status: 401 };
  }

  try {
    const response = await axiosInstance.put(`${API_URL}/events/${event_hash}/getfailedbynudity/${post_id}`, {}, {
      headers: {
        'Authorization': token
      }
    });
    if (response.status === 200) {
      return { data: response.data, error: null, status: 200 };
    }
    // Handle other statuses as needed
    return { data: null, error: 'Error approving post', status: response.status };
  } catch (error: any) {
    console.error(error);
    return { data: null, error: error.message, status: 500 };
  }
};

const fetch5Comments = async (event_hash: string, id: string): Promise<CommentsResponse> => {
  try {
    const response = await axiosInstance.get(API_URL + '/events/' + event_hash + '/post/' + id + '/comments/last5',);
    if (response.status === 200) {
      return { comments: response.data.comments, error: null };
    }
    return { comments: null, error: 'Error fetching comments' };
  } catch (error: any) {
    console.error(error);
    return { comments: null, error: error.message };
  }
};
const fetchallComments = async (event_hash: string, id: string): Promise<CommentsResponse> => {
  try {
    const token = Cookies.get('token');
    const response = await axiosInstance.get(API_URL + '/events/' + event_hash + '/post/' + id + '/comments/all', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
    });
    if (response.status === 200) {
      return { comments: response.data.comments, error: null }; // Assuming comments are nested under 'comments' property
    }
    return { comments: null, error: 'Error fetching comments' };
  } catch (error: any) {
    console.error(error);
    return { comments: null, error: error.message };
  }
};


const fetchEvent = async (event_hash: string): Promise<EventResponse> => {
  try {
    const response = await axiosInstance.get(API_URL + '/events/' + event_hash);
    if (response.status === 200) {
      return response?.data;
    }
    return { event: null, error: 'Error fetching posts' };
  } catch (error: any) {
    console.error(error);
    return { event: null, error: 'Error fetching posts' };
  }
};

const likePost = async (event_hash: string, post_id: number) => {
  let token = Cookies.get('token');

  if (!token) {
    return { posts: null, error: 'Invalid token', status: 401 };
  }

  try {
    const response = await axiosInstance.post(API_URL + '/events/' + event_hash + '/post/like', { post_id: post_id }, {
      headers: {
        'Authorization': token
      }
    });
    if (response.status === 200) {
      return { posts: response.data, error: null, status: 200 };
    }
    if (response.status === 401) {
      return { posts: null, error: 'Error liking posts', status: 401 };
    }

    return { posts: null, error: 'Error liking posts', status: 404 };
  } catch (error: any) {
    console.error(error);
    return { posts: null, error: error.message, status: 500 };
  }
};



const unlikePost = async (event_hash: string, post_id: number) => {
  let token = Cookies.get('token');

  if (!token) {
    return { posts: null, error: 'Invalid token', status: 401 };
  }

  try {
    const response = await axiosInstance.post(API_URL + '/events/' + event_hash + '/post/unlike', { post_id: post_id }, {
      headers: {
        'Authorization': token
      }
    });
    if (response.status === 200) {
      return { posts: response.data, error: null, status: 200 };
    }
    if (response.status === 401) {
      return { posts: null, error: 'Error liking posts', status: 401 };
    }

    return { posts: null, error: 'Error liking posts', status: 404 };
  } catch (error: any) {
    console.error(error);
    return { posts: null, error: error.message, status: 500 };
  }
};

const getLikePost = async (event_hash: string, post_id: number) => {
  let token = Cookies.get('token');

  if (!token) {
    return { posts: null, error: 'Invalid token', status: 401 };
  }

  try {
    const response = await axiosInstance.post(API_URL + '/events/' + event_hash + '/post/getlikes', { post_id: post_id }, {
      headers: {
        'Authorization': token
      }
    });
    if (response.status === 200) {
      return { posts: response.data, error: null, status: 200 };
    }
    if (response.status === 401) {
      return { posts: null, error: 'Error liking posts', status: 401 };
    }

    return { posts: null, error: 'Error liking posts', status: 404 };
  } catch (error: any) {
    console.error(error);
    return { posts: null, error: error.message, status: 500 };
  }
};


export { fetch5Comments, fetchallComments, fetchPosts, fetchEvent, fetchPost, deletePost, likePost, unlikePost, getLikePost, updatePost, getFlaggedPosts, fetchOrmaFeedTimeSlots, fetchOrmaFeedByTimeSlot, fetchMemories };