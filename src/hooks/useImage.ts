/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ChangeEvent } from '@components/input';
import { MAXIMUM_IMAGE_SIZE } from '@constants/WebsiteNode';
import { uploadImage } from '@redux/website-node/actions';

/**
 * This describes the properties returned
 *
 * @typeParam sizeError: boolean - This indicates if there is a size error
 * @typeParam getImageUrl: (e: ChangeEvent) => Promise<any> - This returns the image url
 * @typeParam getImageUrlByFile: (image: File) => Promise<any> - This returns the image url
 */
interface IUseImage {
    sizeError: boolean;
    getImageUrl: (e: ChangeEvent) => Promise<any>;
    getImageUrlByFile: (image: File) => Promise<any>;
}

const useImage = (): IUseImage => {
    const dispatch = useDispatch();
    const [sizeError, setSizeError] = useState<boolean>(false);

    const getImageUrl = async ({ target: { files } }: ChangeEvent): Promise<string | void> => {
        if (!files) return;
        if (files[0].size > MAXIMUM_IMAGE_SIZE) return setSizeError(true);
        setSizeError(false);
        return String(await dispatch(uploadImage(files[0])));
    };

    const getImageUrlByFile = async (image: File): Promise<string | void> => {
        if (!image) return;
        if (image.size > MAXIMUM_IMAGE_SIZE) return setSizeError(true);
        setSizeError(false);
        return String(await dispatch(uploadImage(image)));
    };

    return {
        sizeError,
        getImageUrl,
        getImageUrlByFile,
    };
};

export default useImage;
