// types.ts
export interface User {
    id: number;
    name: string;
    phone: string;
    token?: string;
    // add other user properties here
}
export interface Likes {
    userId: number;
    post_id: number;
    event_hash: string;
}
export interface Page {
    number: number;
    keep: boolean
}
export interface PageArrayObject {
    [key: string]: Page
}
export interface Comment {
    userId: number;
    post_id: number;
    event_hash: string;
    id: number;
    User: User;
    content: string;
}
export interface Post {
    id: number,
    description: string,
    image_url: string,
    compressed_url: string,
    status: string,
    user: User,
    createdAt: Date,
    event_hash: string,
    Likes: Likes[],
    Comments: Comment[],
}
export interface OrmaEvent {
    Event: any;
    id: number,
    event_hash: string,
    name: string,
    event_date: string,
    event_banner_url: string,
    event_profile_image_url: string,
    createdAt: string,
    userId: number,
}
export interface AuthResponse {
    user?: User;
    token?: string;
    success: boolean;
    error: string | null;
    name?: string | null;
    request_id?: string | null;
}

export interface ApiResponse {
    user: User | null;
    error: string | null;
}

export interface CommentsResponse {
    comments: Comment[] | null;
    error: string | null;
    status?: Number | null;
}

export interface PostsResponse {
    posts: Post[] | null;
    error?: string | null;
    status?: Number | null;
}

export interface TimeSlot {
    id: number,
    timeslot: string,
    post_id: number,
    category_id: number,
    event_hash: string,
    Post: Post
}
export interface PostResponse {
    post?: Post | null;
    error?: string | null;
    status?: Number | null;
}

export interface EventResponse {
    event: OrmaEvent | null;
    error: String | null;
}

export interface AuthContextProps {
    user: User | null;
    // login: (email: string, password: string) => Promise<boolean>;
    updateUser: () => void;
    logout: () => void;
    ormas: OrmaEvent[] | null;
    setOrmas: (event: OrmaEvent[]) => void;
    loading: boolean;
    error: string | null;
    setViewedEvents: (event: OrmaEvent | null) => void;
    event: OrmaEvent | null;
    setEvent: (event: OrmaEvent | null) => void;
    userName: string | null;
    setUserName: (name: string) => void;
    fetchMyOrmas: () => void;
    myOrmas: OrmaEvent[] | null;
    fetchName: () => void;
}
export interface PostContextProps {
    processingPost: PostsResponse,
    addProcessingPost: (post: Post) => void;
    setProcessing: (post: PostsResponse) => void;
    removeProcessingPost: (id: Number) => void;
    posts: PostsResponse;
    setPost: (post: PostsResponse | null) => void;
    addPost: (post: Post) => void;
    addMorePosts: (newposts: PostsResponse) => void;
}

export interface NudityFlaggedPost {
    id: number,
    image_url: string,
    status: string,
    event_hash: string,
}

export interface ImageProcessorProps {
    flaggedPosts: NudityFlaggedPost[];
    setFlaggedPosts: (posts: NudityFlaggedPost[]) => void;
    // fetchFlaggedPosts: (event_hash: string) => Promise<void>;
    approvePost: (event_hash: string, postId: string) => Promise<void>;
    rejectPost: (event_hash: string, postId: string) => Promise<void>;
}

export interface NudityFlaggedProviderProps {
    children: React.ReactNode;
};

export interface PostProviderProps {
    children: React.ReactNode;
}
export interface AuthProviderProps {
    children: React.ReactNode;
}
