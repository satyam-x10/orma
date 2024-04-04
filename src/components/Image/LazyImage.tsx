import React from 'react';
import { useImageLoaded } from '../../context/auth/ImageLoadedContext';

interface LazyImageProps {
    id: string;
    src: string;
    placeholder: string;
    alt?: string;
    className?: string;
    style?: React.CSSProperties;
    // You can extend this with any other img attributes as needed.
}

const LazyImage: React.FC<LazyImageProps> = ({ id, src, placeholder, ...rest }) => {
    const { isImageLoaded, addLoadedImage } = useImageLoaded();
    const isLoaded = isImageLoaded(id);

    return (
        <img 
            data-src={src}
            src={isLoaded ? src : placeholder}
            onLoad={() => { if (!isLoaded) addLoadedImage(id) }}
            {...rest}
        />
    );
}

export default LazyImage;
