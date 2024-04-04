import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Post, PostsResponse, TimeSlot } from '../../types';

interface OrmaFeed {
  timeslot: string
}

interface State {
  ormaFeed: {
    [event_hash: string]: {
      [timeslot: string]: any; // Adjusted to allow any type of value for timeslots
      memories?: any; // Optional, since not all event_hash objects may have memories initially
    };
  };
}

const initialState: State = {
  ormaFeed: {},
};

interface AddToTimeslotAction {
  type: 'ADD_TIMESLOT';
  timeslot: string;
  ormaFeed: any;
  event_hash: string;
}
interface AppendTimeslotAction {
  type: 'APPEND_TO_TIMESLOT';
  timeslot: string;
  ormaFeed: any;
  event_hash: string;
}

interface AddMemoriesAction {
  type: 'ADD_MEMORIES';
  memories: any;
  event_hash: string;
}

type Action = AddToTimeslotAction | AddMemoriesAction | AppendTimeslotAction;

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'ADD_TIMESLOT': {
      const { event_hash, timeslot, ormaFeed } = action;
      const existingEvent = state.ormaFeed[event_hash] || {};
      return {
        ...state,
        ormaFeed: {
          ...state.ormaFeed,
          [event_hash]: {
            ...existingEvent,
            [timeslot]: ormaFeed, // Merge the new timeslot with existing data
          },
        },
      };
    }
    case 'ADD_MEMORIES': {
      const { event_hash, memories } = action;
      const existingEvent = state.ormaFeed[event_hash] || {};
      return {
        ...state,
        ormaFeed: {
          ...state.ormaFeed,
          [event_hash]: {
            ...existingEvent,
            memories: existingEvent.memories ? [...existingEvent.memories, ...memories] : memories,
             // Add or overwrite memories for the event_hash
          },
        },
      };
    }
    case 'APPEND_TO_TIMESLOT': {
      const { event_hash, timeslot, ormaFeed } = action;
      // Ensure the event exists, and the timeslot has an initial array to append to
      const existingEvent = state.ormaFeed[event_hash] || {};
      const existingTimeslotData = existingEvent[timeslot] ? existingEvent[timeslot] : [];
      
      // Append new data to the existing timeslot data
      const updatedTimeslotData = [...existingTimeslotData, ...ormaFeed];
  
      return {
        ...state,
        ormaFeed: {
          ...state.ormaFeed,
          [event_hash]: {
            ...existingEvent,
            [timeslot]: updatedTimeslotData, // Updated to contain both old and new data
          },
        },
      };
    }
    default:
      return state;
  }
};


const OrmaFeedContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const OrmaFeedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <OrmaFeedContext.Provider value={{ state, dispatch }}>{children}</OrmaFeedContext.Provider>;
};

export const useOrmaFeedContext = () => {
  const context = useContext(OrmaFeedContext);
  if (!context) {
    throw new Error('useOrmaFeedContext must be used within an OrmaFeedProvider');
  }
  return context;
};
