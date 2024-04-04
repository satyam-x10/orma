import React, { createContext, useContext, useState } from 'react';

type ImageLoadedContextValue = {
  addLoadedImage: (id: string) => void;
  isImageLoaded: (id: string) => boolean;
};

const ImageLoadedContext = createContext<ImageLoadedContextValue | undefined>(undefined);

export const useImageLoaded = (): ImageLoadedContextValue => {
  const context = useContext(ImageLoadedContext);
  if (!context) {
    throw new Error("useImageLoaded must be used within a ImageLoadedProvider");
  }
  return context;
};

interface ImageLoadedProviderProps {
  children: React.ReactNode;
}

export const ImageLoadedProvider: React.FC<ImageLoadedProviderProps> = ({ children }) => {
    const [loadedImages, setLoadedImages] = useState<string[]>([]);

    const addLoadedImage = (id: string) => {
        setLoadedImages(prev => [...prev, id]);
    };

    const isImageLoaded = (id: string) => {
        return loadedImages.includes(id);
    };

    return (
        <ImageLoadedContext.Provider value={{ addLoadedImage, isImageLoaded }}>
            {children}
        </ImageLoadedContext.Provider>
    );
};
