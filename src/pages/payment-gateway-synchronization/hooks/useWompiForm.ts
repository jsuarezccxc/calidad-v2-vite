import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import useModal from '@hooks/useModal';
import { IWompiForm } from '@models/PaymentGateway';
import { IGenericRecord } from '@models/GenericRecord';
import LocalStorage from '@utils/LocalStorage';
import { currentDateInUnix } from '@utils/Date';
import { ParamPaymentGateway, MODAL_STATE_KEYS, ModalKeys } from '@constants/PaymentGatewaySynchronization';
import { RootState } from '@redux/rootReducer';
import { storeCompanyPaymentGateway } from '@redux/payment-gateway/action';
import { ChangeEvent } from '@components/input';
import { getLocalStorage } from '../components';

/**
 * This const is default data
 */
const DEFAULT_DATA_WOMPI: IWompiForm = {
    event: '',
    integrity: '',
    priv_key: '',
    pub_key: '',
};

/**
 * This interface define structure to custom hook
 *
 * @typeParam isSubmit: boolean - If submit form
 * @typeParam activeModal: string - If show modal
 * @typeParam fieldValues: IWompiForm - Data form
 * @typeParam handleModal: () => void - Handle show modal save
 * @typeParam handleSave: () => Promise<void> - Handle save data form
 * @typeParam handleText: (event: ChangeEvent) => void - Handle change text
 */
interface IUseWompiForm {
    isSubmit: boolean;
    activeModal: string;
    fieldValues: IWompiForm;
    handleModal: () => void;
    handleSave: () => Promise<void>;
    handleText: (event: ChangeEvent) => void;
}

/**
 * This hook is for form component
 *
 * @param id: number - Id payment gateway
 * @returns IUseWompiForm
 */
const useWompiForm = (id: number): IUseWompiForm => {
    const [dispatch, { pathname, search }] = [useDispatch(), useLocation()];
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [fieldValues, setFieldValues] = useState<IWompiForm>({ ...DEFAULT_DATA_WOMPI });

    const { activeModal, toggleModal } = useModal({ ...MODAL_STATE_KEYS });

    const paymentGateway = useSelector((state: RootState) => state.paymentGateway.dataCompanyPaymentGateway);

    const handleText = ({ target }: ChangeEvent): void => {
        setFieldValues({
            ...fieldValues,
            [target.name]: target.value,
        });
    };

    const handleModal = (): void => toggleModal('');

    const handleSave = async (): Promise<void> => {
        setIsSubmit(true);
        if (Object.values(fieldValues).some(value => !value)) return;
        const isCorrectResponse: IGenericRecord = await dispatch(
            storeCompanyPaymentGateway({ credentials: fieldValues, date: String(currentDateInUnix()), payment_gateway_id: id })
        );
        if (isCorrectResponse) {
            toggleModal(ModalKeys.Save);
            setIsSubmit(false);
            const { stepComplete, upperType } = getLocalStorage(ParamPaymentGateway.Wompi);
            const url = `${pathname}${search}`;
            LocalStorage.set(upperType, [...stepComplete, url].join(','));
            return;
        } else {
            setIsSubmit(false);
            toggleModal(ModalKeys.Error);
        }
    };

    const assignKeys = (): void => {
        const keys = paymentGateway.find(({ payment_gateway_id }) => payment_gateway_id === id);
        if (!keys) return;
        const { credentials } = keys;
        setFieldValues({ ...(credentials as IWompiForm) });
    };

    useEffect(() => {
        assignKeys();
    }, [paymentGateway]);

    return {
        isSubmit,
        activeModal,
        fieldValues,
        handleText,
        handleSave,
        handleModal,
    };
};

export default useWompiForm;
