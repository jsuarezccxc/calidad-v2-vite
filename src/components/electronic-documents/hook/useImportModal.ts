import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useModal from '@hooks/useModal';
import { Routes } from '@constants/Paths';
import { ModalImport } from '@constants/ElectronicDocuments';
import { DEFAULT_IMPORT_CLIENT_RESPONSE } from '@constants/ElectronicDocuments';
import { getRoute } from '@utils/Paths';
import { buildOptions } from '@utils/Company';
import { validateEmail } from '@utils/Validation';
import { lengthGreaterThanZero } from '@utils/Length';
import { RootState } from '@redux/rootReducer';
import { getClientById } from '@redux/client-portal/actions';
import { postConsultClientInDIAN, postImportClientInDIAN } from '@redux/clients/actions';
import { ChangeEvent, IOptionSelect } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { IConsultClient, IConsultClientResponse } from '@models/ImportClient';

/**
 * This const defines the initial state of the modals used in the import process
 */
const MODAL_IMPORTS: Record<string, boolean> = {
    [ModalImport.Error]: false,
    [ModalImport.Warning]: false,
    [ModalImport.Contingency]: false,
    [ModalImport.ImportClient]: false,
    [ModalImport.ConsultClient]: false,
};

/**
 * This const defines the default values for state client
 */
const DEFAULT_CONSULT_CLIENT: IConsultClient = {
    document_number: '',
    document_type: '',
    document_type_name: '',
};

/**
 * This interface defines the structure for the options used in the select input
 * 
 * @typeParam options: IOptionSelect[] - Array of options for the select input
 * @typeParam handleSelect: (option: IOptionSelect, name?: string) => void - Function to handle the selection of an option
 */
interface IImportConsult {
    options: IOptionSelect[];
    handleSelect: (option: IOptionSelect, name?: string) => void;
}

/**
 * This interface defines the generic properties used in the import modal components
 * 
 * @typeParam fieldValue: T - The type of the field value
 * @typeParam onClickRight: K - The type of the function to handle the right button click
 * @typeParam isSubmit: boolean - Indicates if the form is submitted
 * @typeParam onClick?: () => void - Optional function to handle the click event
 * @typeParam onClickLeft: () => void - Function to handle the left button click
 * @typeParam handleText: (e: ChangeEvent) => void - Function to handle text input changes
 */
interface IGenericProps<T, K> {
    fieldValue: T;
    onClickRight: K;
    isSubmit: boolean;
    onClick?: () => void;
    onClickLeft: () => void;
    handleText: (e: ChangeEvent) => void;
}


/**
 * This interface defines the structure for the import modal hook
 * 
 * @typeParam activeModal: string - The currently active modal
 * @typeParam propsWarning: Pick<IGenericProps<string, string>, 'onClickLeft'> - Properties for the warning modal
 * @typeParam propsError: Required<Pick<IGenericProps<string, string>, 'onClick'>> - Properties for the error modal
 * @typeParam propsConsultClient: IImportConsult & IGenericProps<IConsultClient, () => void> - Properties for the consult client modal
 * @typeParam propsImportClient: IGenericProps<IConsultClientResponse, (setClient: (client: IGenericRecord) => void) => void> - Properties for the import client modal
 * @typeParam handleModal: (modalActive: string) => void - Function to handle the modal state
 */
interface IUseImportModal {
    activeModal: string;
    propsWarning: Pick<IGenericProps<string, () => void>, 'onClickLeft'>;
    propsError: Required<Pick<IGenericProps<string, string>, 'onClick'>>;
    propsConsultClient: IImportConsult & IGenericProps<IConsultClient, () => void>;
    propsImportClient: IGenericProps<IConsultClientResponse, (setClient: (client: IGenericRecord) => void) => void>;
    handleModal: (modalActive: string) => void;
}

export const useImportModal = (): IUseImportModal => {
    const [dispatch, history] = [useDispatch(), useHistory()];
    const utils = useSelector((state: RootState) => state.utils.utils);

    const [isSubmit, setSubmit] = useState<boolean>(false);
    const [consultClient, setConsultClient] = useState<IConsultClient>({ ...DEFAULT_CONSULT_CLIENT });
    const [importClient, setImportClient] = useState<IConsultClientResponse>({ ...DEFAULT_IMPORT_CLIENT_RESPONSE });

    const { activeModal, toggleModal } = useModal({ ...MODAL_IMPORTS });

    const handleText = ({ target }: ChangeEvent): void => {
        setConsultClient({
            ...consultClient,
            [target.name]: target.value,
        });
    };

    const handleTextImport = ({ target }: ChangeEvent): void => {
        setImportClient({
            ...importClient,
            [target.name]: target.value,
        });
    }

    const handleSelect = (option: IOptionSelect, name: string | undefined = ''): void => {
        setConsultClient({
            ...consultClient,
            [name]: option.id,
            [`${name}_name`]: option.value,
        });
    };

    const handleCloseModal = (): void => {
        setConsultClient({ ...DEFAULT_CONSULT_CLIENT });
        setSubmit(false);
        toggleModal('');
    };

    const handleCloseImport = (): void => {
        setImportClient({ ...DEFAULT_IMPORT_CLIENT_RESPONSE });
        setSubmit(false);
        toggleModal('');
    }

    const handleSearch = async (): Promise<void> => {
        if (!consultClient.document_number || !consultClient.document_type) return setSubmit(true);
        toggleModal('');
        const code = utils.document_types.find((doc: Record<string, string>) => doc.id === consultClient.document_type)?.code;
        const data = ((await dispatch(postConsultClientInDIAN({...consultClient, document_type_code: code }))) as unknown) as IConsultClientResponse;
        if (lengthGreaterThanZero(Object.keys(data))) {
            setSubmit(false);
            setImportClient({ ...data });
            toggleModal(data.state_person as ModalImport);
        }
    };

    const handleImport = async (setClient: (client: IGenericRecord) => void): Promise<void> => {
        const { email } = importClient;
        if (!importClient.name || !email || !validateEmail(email)) return setSubmit(true);
        toggleModal('');
        const data = ((await dispatch(postImportClientInDIAN(importClient))) as unknown) as IGenericRecord;
        if (lengthGreaterThanZero(Object.keys(data))) {
            setSubmit(false);
            handleCloseModal();
            setClient(data);
        }
    };

    const handleEditClient = async (): Promise<void> => {
        handleCloseModal();
        dispatch(getClientById(importClient.client_id || ''));
        history.push(`${getRoute(Routes.CUSTOMER_DATABASE)}?name=edit-customer`);
    };

    useEffect(() => {
        if (activeModal === ModalImport.ConsultClient) setConsultClient({ ...DEFAULT_CONSULT_CLIENT });
    }, [activeModal])

    return {
        activeModal,
        propsConsultClient: {
            isSubmit,
            fieldValue: consultClient,
            options: buildOptions(utils?.document_types),
            handleText,
            handleSelect,
            onClickRight: handleSearch,
            onClickLeft: handleCloseModal,
        },
        propsImportClient: {
            isSubmit,
            fieldValue: importClient,
            onClickRight: handleImport,
            handleText: handleTextImport,
            onClickLeft: handleCloseImport,
        },
        propsWarning: {
            onClickLeft: handleEditClient,
        },
        propsError: {
            onClick: handleCloseModal,
        },
        handleModal: toggleModal,
    };
};
