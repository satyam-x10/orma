import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Post, PostsResponse, Likes } from '../../types';

interface EventState {
  pageNumber: number;
  keep: boolean;
  postsResponse?: PostsResponse;
}
interface PostReaction {
  Likes: Likes[]
}
interface State {
  events: { [event_hash: string]: EventState };
  post_reactions : { [post_id: number]: PostReaction };
}

// Define the actions
interface UpdatePageAction {
  type: 'UPDATE_PAGE';
  event_hash: string;
  pageNumber: number;
  keep: boolean;
}

interface AddPostsAction {
  type: 'ADD_POSTS';
  event_hash: string;
  postsResponse: PostsResponse;
}

interface AppendPostsAction {
  type: 'APPEND_POSTS';
  event_hash: string;
  postsResponse: PostsResponse;
}

interface AddSinglePost {
  type: 'ADD_SINGLE_POST';
  event_hash: string;
  post: Post;
}

interface AddPostReaction {
  type: 'ADD_POST_REACTION';
  post_id: number;
  Likes: Likes;
  event_hash: string;
}
interface AddPostReaction {
  type: 'ADD_POST_REACTION';
  post_id: number;
  Likes: Likes;
  event_hash: string;
}
interface UpdatePostReaction {
  type: 'UPDATE_POST_REACTION';
  post_id: number;
  Likes: Likes;
}
interface AddPostComment {
  type: 'ADD_POST_COMMENT';
  post_id: number;
  event_hash: string;
  Comment: any;
}
interface UpdatePostComment {
  type: 'UPDATE_POST_COMMENT';
  post_id: number;
  event_hash: string;
  comment_id: number,
  updatedCommentContent: string;
}
interface RemovePostComment {
  type: 'REMOVE_POST_COMMENT';
  post_id: number;
  event_hash: string;
  comment_id: number,
}


interface RemovePostReaction {
  type: 'REMOVE_POST_REACTION';
  post_id: number;
  Likes: Likes;
}

type Action = UpdatePageAction | AddPostsAction | AppendPostsAction | AddSinglePost | AddPostReaction | UpdatePostReaction | RemovePostReaction | AddPostComment | UpdatePostComment | RemovePostComment;

const initialState: State = {
  events: {},
  post_reactions: {}
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UPDATE_PAGE':
      return {
        ...state,
        events: {
          ...state.events,
          [action.event_hash]: { ...state.events[action.event_hash], pageNumber: action.pageNumber, keep: action.keep }
        }
      };
    case 'ADD_POSTS':
      return {
        ...state,
        events: {
          ...state.events,
          [action.event_hash]: { ...state.events[action.event_hash], postsResponse: action.postsResponse }
        }
      };
    case 'APPEND_POSTS':
      const existingEventState = state.events[action.event_hash] || {};
      const existingPosts = existingEventState.postsResponse?.posts || [];
      const newPosts = action?.postsResponse?.posts || [];

      return {
        ...state,
        events: {
          ...state.events,
          [action.event_hash]: {
            ...existingEventState,
            postsResponse: {
              ...existingEventState.postsResponse,
              posts: [...existingPosts, ...newPosts],
              error: null,
              status: 200
            }
          }
        }
      };
    case 'ADD_SINGLE_POST':
        const existingEvent = state.events[action.event_hash] || {};
        const existingPostsSingle = existingEvent.postsResponse?.posts || [];
      
        // Only append action.post if it is defined
        const newPost = action.post ? [action.post, ...existingPostsSingle] : existingPostsSingle;
      
        let data =  {
          ...state,
          events: {
            ...state.events,
            [action.event_hash]: {
              ...existingEvent,
              postsResponse: {
                ...existingEvent.postsResponse,
                posts: newPost,
                error: null,
              },
            },
          },
        }; 
        return data;
    case 'ADD_POST_REACTION':{
        const { event_hash, post_id, Likes } = action;

        const newEvents: { [x: string]: EventState } = { ...state.events };

        // Use optional chaining to safely access posts and findIndex on possibly undefined or null values
        const posts = newEvents[event_hash]?.postsResponse?.posts ?? [];

        // Find the post by ID
        const postIndex = posts.findIndex(post => post.id === post_id);
        
        // If the post exists, update the Likes array
        if (postIndex !== -1) {
          // Extract the current Likes array for the post
          const currentLikes = posts[postIndex].Likes;
  
          // Check if the like from the specific user already exists
          const existingLikeIndex = currentLikes.findIndex(like => like.userId === Likes.userId);
  
          let updatedLikes;
  
          if (existingLikeIndex !== -1) {
              // Like exists, remove it from the Likes array (unlike action)
              updatedLikes = [
                  ...currentLikes.slice(0, existingLikeIndex),
                  ...currentLikes.slice(existingLikeIndex + 1),
              ];
          } else {
              // Like does not exist, add it to the Likes array (like action)
              updatedLikes = [...currentLikes, Likes];
          }
  
          // Update the post with the new Likes array
          const updatedPost = { ...posts[postIndex], Likes: updatedLikes };
  
          // Create a new posts array with the updated post
          const updatedPosts = [...posts.slice(0, postIndex), updatedPost, ...posts.slice(postIndex + 1)];
  
          // Update the event with the new posts array
          newEvents[event_hash] = {
              ...newEvents[event_hash],
              postsResponse: {
                  ...newEvents[event_hash]?.postsResponse,
                  posts: updatedPosts
              }
          };
      }

        // Return the updated state
        return {
            ...state,
            events: newEvents
        };
    }
    case 'ADD_POST_COMMENT':{
      const { event_hash, post_id, Comment } = action;
  
      const newEvents: { [x: string]: EventState } = { ...state.events };
  
      // Use optional chaining to safely access posts and findIndex on possibly undefined or null values
      const posts = newEvents[event_hash]?.postsResponse?.posts ?? [];
  
      // Find the post by ID
      const postIndex = posts.findIndex(post => post.id === post_id);
      // If the post exists, update the Comments array
      if (postIndex !== -1) {
          // Extract the current Comments array for the post
          const currentComments = posts[postIndex].Comments ?? [];
          let updatedPosts;
          if( Array.isArray(Comment)){
    
            // Update the post with the new Comments array
            const updatedPost = { ...posts[postIndex], Comments: Comment };
      
            // Create a new posts array with the updated post
            updatedPosts = [...posts.slice(0, postIndex), updatedPost, ...posts.slice(postIndex + 1)];
          }else{
            const updatedComments = [Comment, ...currentComments];
    
            // Update the post with the new Comments array
            const updatedPost = { ...posts[postIndex], Comments: updatedComments };
      
            // Create a new posts array with the updated post
            updatedPosts = [...posts.slice(0, postIndex), updatedPost, ...posts.slice(postIndex + 1)];
          }

          // Add the new comment to the Comments array (assuming every new comment is unique and should be added)

    
          // Update the event with the new posts array
          newEvents[event_hash] = {
              ...newEvents[event_hash],
              postsResponse: {
                  ...newEvents[event_hash]?.postsResponse,
                  posts: updatedPosts
              }
          };
      }
  
      // Return the updated state
      return {
          ...state,
          events: newEvents
      };
    } 
    case 'UPDATE_POST_COMMENT': {
      const { event_hash, post_id, comment_id, updatedCommentContent } = action;
    
      const newEvents: { [x: string]: EventState } = { ...state.events };
    
      // Use optional chaining to safely access posts
      const posts = newEvents[event_hash]?.postsResponse?.posts ?? [];
    
      // Find the post by ID
      const postIndex = posts.findIndex(post => post.id === post_id);
    
      // If the post exists, proceed to find and update the comment
      if (postIndex !== -1) {
        // Extract the current Comments array for the post
        const currentComments = posts[postIndex].Comments ?? [];
    
        // Find the index of the comment to be updated
        const commentIndex = currentComments.findIndex(comment => comment.id === comment_id);
    
        // Check if the comment exists
        if (commentIndex !== -1) {
          // Create a new updated comment object
          const updatedComment = { ...currentComments[commentIndex], content: updatedCommentContent };
    
          // Create a new Comments array with the updated comment
          const updatedComments = [...currentComments.slice(0, commentIndex), updatedComment, ...currentComments.slice(commentIndex + 1)];
    
          // Update the post with the new Comments array
          const updatedPost = { ...posts[postIndex], Comments: updatedComments };
    
          // Create a new posts array with the updated post
          const updatedPosts = [...posts.slice(0, postIndex), updatedPost, ...posts.slice(postIndex + 1)];
    
          // Update the event with the new posts array
          newEvents[event_hash] = {
            ...newEvents[event_hash],
            postsResponse: {
              ...newEvents[event_hash]?.postsResponse,
              posts: updatedPosts
            }
          };
        }
      }
    
      // Return the updated state
      return {
        ...state,
        events: newEvents
      };
    }
    case 'REMOVE_POST_COMMENT': {
      const { event_hash, post_id, comment_id } = action;
    
      const newEvents: { [x: string]: EventState } = { ...state.events };
    
      // Safely access posts using optional chaining
      const posts = newEvents[event_hash]?.postsResponse?.posts ?? [];
    
      // Find the post by ID
      const postIndex = posts.findIndex(post => post.id === post_id);
    
      // If the post exists, proceed to find and remove the comment
      if (postIndex !== -1) {
        // Extract the current Comments array for the post
        const currentComments = posts[postIndex].Comments ?? [];
    
        // Remove the comment with the given comment_id
        const updatedComments = currentComments.filter(comment => comment.id !== comment_id);
    
        // Update the post with the new Comments array
        const updatedPost = { ...posts[postIndex], Comments: updatedComments };
    
        // Create a new posts array with the updated post
        const updatedPosts = [...posts.slice(0, postIndex), updatedPost, ...posts.slice(postIndex + 1)];
    
        // Update the event with the new posts array
        newEvents[event_hash] = {
          ...newEvents[event_hash],
          postsResponse: {
            ...newEvents[event_hash]?.postsResponse,
            posts: updatedPosts
          }
        };
      }
    
      // Return the updated state
      return {
        ...state,
        events: newEvents
      };
    }    
    case 'UPDATE_POST_REACTION':
      return {
        ...state,
        post_reactions: {
          ...state?.post_reactions,
            [action.post_id]: {Likes: [...state?.post_reactions[action.post_id].Likes, action.Likes]
          }
        }
    }
    case 'REMOVE_POST_REACTION':
      return {
        ...state,
        post_reactions: {
          ...state?.post_reactions,
            [action.post_id]: { Likes: state?.post_reactions[action.post_id].Likes?.filter((like) => like?.post_id !== action?.Likes?.post_id || like?.event_hash !== action?.Likes?.event_hash || like?.userId !== action?.Likes?.userId)}
          }
    }
    default:
      return state;
  }
};

const EventPageContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const EventPageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <EventPageContext.Provider value={{ state, dispatch }}>{children}</EventPageContext.Provider>;
};

export const useEventPage = () => {
  const context = useContext(EventPageContext);
  if (!context) {
    throw new Error('useEventPage must be used within an EventPageProvider');
  }
  return context;
};
