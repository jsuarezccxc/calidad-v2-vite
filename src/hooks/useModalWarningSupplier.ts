/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ISupplier, ISupplierResponse } from '@models/Supplier';
import { postExistDuplicateSupplier } from '@redux/suppliers/actions';

/**
 * Custom hook to manage the modal warning for suppliers.
 * 
 * @typeParam supplier: ISupplierResponse - The supplier data.
 * @typeParam showModal: boolean - Flag to show or hide the modal.
 * @typeParam isExistEmail: boolean - Flag to check if the email exists.
 * @typeParam propsModal: { dataClientOrSupplier: ISupplierResponse } - Props for the modal.
 * @typeParam handleModal: () => void - Function to toggle the modal visibility.
 * @typeParam handleBlur: (supplier: ISupplier) => Promise<void> - Function to handle the blur event for the supplier.
 * @typeParam handleBlurEmail: (email: string, id: string) => Promise<void> - Function to handle the blur event for the email.
 */
export interface IUseModalWarningSupplier {
    supplier: ISupplierResponse;
    showModal: boolean;
    isExistEmail: boolean;
    propsModal: { dataClientOrSupplier: ISupplierResponse };
    handleModal: () => void;
    handleBlur: (supplier: ISupplier) => Promise<void>;
    handleBlurEmail: (email: string, id: string) => Promise<void>;
}

/**
 * This hook is used to manage the modal warning for suppliers.
 * 
 * @returns IUseModalWarningSupplier
 */
export const useModalWarningSupplier = (): IUseModalWarningSupplier => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isExistEmail, setIsExistEmail] = useState<boolean>(false);
    const [supplier, setSupplier] = useState<ISupplierResponse>({} as ISupplierResponse);

    const handleModal = (): void => setShowModal(!showModal);

    const handleBlur = async (supplier: ISupplier): Promise<void> => {
        const { document_number, document_type } = supplier;
        if (!document_number && !document_type) return;
        const response: any = await dispatch(postExistDuplicateSupplier({ document_number, document_type }));
        if (response.is_created) {
            setShowModal(true);
            setSupplier(response.supplier);
        }
    };

    const handleBlurEmail = async (email: string, id: string): Promise<void> => {
        if (!email) return setIsExistEmail(false);
        const response: any = await dispatch(postExistDuplicateSupplier({ email }));
        setIsExistEmail(response.is_created && id !== response.supplier.id);
    };

    return {
        supplier,
        showModal,
        isExistEmail,
        propsModal: {
            dataClientOrSupplier: supplier,
        },
        handleModal,
        handleBlur,
        handleBlurEmail,
    };
};
