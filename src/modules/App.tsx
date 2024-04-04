import AuthProvider from '../context/auth/AuthProvider';
import PostProvider from '../context/auth/PostProvider';
import Login from '../components/login/login';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Home from '../components/home/home';
import UploadPage from '../components/upload/uploadPage';
import { CookiesProvider } from 'react-cookie';
import Profile from '../components/Profile/profile';
import NotFound from '../components/NotFound/index'
import Loading from '../components/Loading/loading';
import MainPage from '../components/MainPage/MainPage';
import Post from '../components/Post/post';
import { EventPageProvider } from '../context/auth/EventContext'
import { OrmaFeedProvider } from '../context/auth/OrmaFeedContext';
import { TimeSlotProvider } from '../context/auth/TimeSlotContext';
import { ImageLoadedProvider } from '../context/auth/ImageLoadedContext';
import EventForm from '../components/CreateEvent';
import AuthValidator from '../context/auth/AuthValidator';
import Memories from '../components/Memories/Memories';
import MyOrmas from '../components/MainPage/MyOrmas';
import TimeSlot from '../components/TimeSlot/TimeSlot';
import { NudityFlaggedProvider } from '../context/auth/NudityFlaggedProvider';
import Slideshow from '../components/home/Slideshow';

const Routes = () => {
  let routes = useRoutes([
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '/:event_hash',
      element: <Home />
    },
    {
      path: '/:event_hash/slideshow',
      element: <Slideshow  />
    },
    {
      path: '/myormas',
      element: <MyOrmas />
    },
    {
      path: '/:event_hash/post/:id',
      element: <Post />
    },
    {
      path: '/:event_hash/memories/viewall',
      element: <Memories />
    },
    {
      path: '/:event_hash/timeslot/:timeslot',
      element: <TimeSlot/>
    },
    {
      path: '/:event_hash/upload',
      element: <UploadPage />
    },
    {
      path: '/profile',
      element: <AuthValidator><Profile /></AuthValidator>
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/create/orma',
      element: <AuthValidator><EventForm /></AuthValidator>
    },
    {
      path: ':event_hash/login/:option',
      element: <Login />
    },
    {
      path: ':event_hash/login',
      element: <Login />
    },
    {
      path: '/login/:option',
      element: <Login />
    },
    {
      path: '/',
      element: <MainPage />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]);
  return routes;
}

const App = () => (
  <CookiesProvider>
    <Loading>
      <AuthProvider>
        <ImageLoadedProvider>
          <PostProvider>
            <EventPageProvider>
              <NudityFlaggedProvider>
                <OrmaFeedProvider>
                  <TimeSlotProvider>
                  <Router>
                    <Routes />
                  </Router>
                  </TimeSlotProvider>
                </OrmaFeedProvider>
              </NudityFlaggedProvider>
            </EventPageProvider>
          </PostProvider>
        </ImageLoadedProvider>
      </AuthProvider>
    </Loading>
  </CookiesProvider>);

export default App;
