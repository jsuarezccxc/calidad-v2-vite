import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import { IGenericRecord } from '@models/GenericRecord';

/**
 * This interface describes that properties the useModal hook return
 * 
 * @typeParam showSaveModal: boolean - Value of show save modal
 * @typeParam setShowSaveModal: Dispatch<SetStateAction<boolean>> - Action that dispatch when must be showed save modal
 */
interface IUseSaveModal {
    showSaveModal: boolean;
    setShowSaveModal: Dispatch<SetStateAction<boolean>>;
}

/**
 * Custom hook that allows show save modal according to response
 * 
 * @param loader: boolean - If loader is loading
 * @param response: number | string - Response according to backend
 * @param action: IGenericRecord - Action to dispatch
 * @returns IUseSaveModal
 */
const useSaveModal = (loader: boolean, response: number | string, action: IGenericRecord): IUseSaveModal => {
    const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (
            !loader &&
            (response === 200 || response === 201 || response === 202)
        ) {
            setShowSaveModal(true);
            dispatch(action);
        }
    }, [response]);

    return { showSaveModal, setShowSaveModal };
};

export default useSaveModal;
