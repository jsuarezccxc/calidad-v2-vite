import { useState, Dispatch, SetStateAction, ClipboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import { sendContactMessage } from '@redux/notifications/actions';
import { IOptionSelect } from '@components/input';
import { IFormatContactData } from '@models/ContactUs';
import { validateEmail } from '@utils/Validation';
import {
    CONTACT_NAME_VALIDATION_REGEX,
    DATA_TYPE,
    DIGGIPYMES,
    FormDataIndexes,
    IFormData,
    INITIAL_VALUES,
    INPUT_NAMES,
    PHONE_VALIDATION_REGEX,
    VALIDATE_NUMBER_ZERO,
} from '..';

export const useContactForm = (): {
    formData: IFormData[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: FormDataIndexes) => void;
    handlePasteLetters: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    handlePasteNumbers: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    handleSelectChange: (option: IOptionSelect, index: FormDataIndexes) => void;
    handleSubmit: () => void;
    handleCloseModal: () => void;
    showModal: boolean;
    checkDataProcessing: boolean;
    setCheckDataProcessing: Dispatch<SetStateAction<boolean>>;
    isSubmit: boolean;
} => {
    const dispatch = useDispatch();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [formData, setFormData] = useState<IFormData[]>(INITIAL_VALUES);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [checkDataProcessing, setCheckDataProcessing] = useState(false);

    const handleFormatData = (prev: IFormData[], value: string, index: FormDataIndexes): IFormData[] => {
        const newArray = [...prev];
        newArray[index] = {
            ...newArray[index],
            value,
            required: isSubmit && !value,
        };
        return newArray;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: FormDataIndexes): void => {
        const { value, name } = e.target;
        let formatedValue = value;
        if (formatedValue.slice(-2, -1) === '´') {
            formatedValue = name === 'name_surname' ? value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g, '') : value;
        }
        setFormData(prev => handleFormatData(prev, formatedValue, index));
    };

    const handlePasteLetters = (event: ClipboardEvent<HTMLInputElement>): void => {
        const pasteData = event.clipboardData?.getData(DATA_TYPE);
        if (!CONTACT_NAME_VALIDATION_REGEX.test(pasteData)) event.preventDefault();
    };

    const handlePasteNumbers = (event: ClipboardEvent<HTMLInputElement>): void => {
        const pasteData = event.clipboardData?.getData(DATA_TYPE);
        if (!PHONE_VALIDATION_REGEX.test(pasteData)) event.preventDefault();
    };

    const handleSelectChange = (option: IOptionSelect, index: FormDataIndexes): void => {
        const { value } = option;
        setFormData(prev => handleFormatData(prev, value, index));
    };

    const handleValidateForm = (data: IFormData[]): boolean => {
        return data.some(item => item.required);
    };

    const handleSubmit = (): void => {
        const data = formData.map(item => {
            let emailValidate = false;
            let phoneValidate = false;
            if (item.name === INPUT_NAMES.EMAIL && item.value) {
                emailValidate = !validateEmail(item.value);
            }
            if (item.name === INPUT_NAMES.PHONE && item.value) {
                phoneValidate = item.value.startsWith(VALIDATE_NUMBER_ZERO);
            }
            return {
                ...item,
                required: !item.value || emailValidate || phoneValidate,
            };
        });
        setFormData(data);
        setIsSubmit(true);
        handleSaveData(data);
    };

    const handleSaveData = async (data: IFormData[]): Promise<void> => {
        if (!handleValidateForm(data) && checkDataProcessing) {
            dispatch(
                sendContactMessage(formatData(data), () => {
                    setFormData(INITIAL_VALUES);
                    setCheckDataProcessing(false);
                    setIsSubmit(false);
                    setShowModal(showModal => !showModal);
                })
            );
        }
    };

    const handleCloseModal = (): void => {
        setShowModal(false);
    };

    const formatData = (data: IFormData[]): IFormatContactData => {
        const format = data.reduce<Record<string, string>>((obj, item) => {
            obj[item.name] = item.value;
            obj['type'] = DIGGIPYMES;
            return obj;
        }, {});

        return (format as unknown) as IFormatContactData;
    };

    return {
        formData,
        handleChange,
        handlePasteLetters,
        handlePasteNumbers,
        handleSubmit,
        handleSelectChange,
        showModal,
        handleCloseModal,
        checkDataProcessing,
        setCheckDataProcessing,
        isSubmit,
    };
};
