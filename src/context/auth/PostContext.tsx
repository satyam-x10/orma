// AuthContext.tsx
import React from 'react';
import { PostContextProps } from '../../types';

const PostContext = React.createContext<PostContextProps | undefined>(undefined);

export default PostContext;
