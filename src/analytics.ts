import ReactGA from 'react-ga4';

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID; // Replace with your ID

export const initGA = () => {
    ReactGA.initialize(GA_TRACKING_ID);
};

export const sendPageview = (path: string, title?: string) => {
    ReactGA.send({ hitType: 'pageview', page: path, title: title ?? document.title });
};

export const sendEvent = (category: string, action: string, label?: string) => {
    ReactGA.event({ category, action, label });
};
