import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '@redux/loader/actions';

const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt = 'Image', ...props }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (showLoader) dispatch(showLoader());

        return (): void => handleImageLoad();
    }, [src, dispatch, showLoader, hideLoader]);

    const handleImageLoad = (): void => {
        if (hideLoader) dispatch(hideLoader());
    };

    return <img src={src} alt={alt} onLoad={handleImageLoad} onError={handleImageLoad} {...props} />;
};

export default Img;
