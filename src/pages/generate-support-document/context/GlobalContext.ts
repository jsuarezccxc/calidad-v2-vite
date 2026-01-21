import { createContext } from 'react';
import { INITIAL_SUPPLIER, SUPPLIER_RESPONSE } from '@constants/Supplier';
import { SUPPORT_DOCUMENT } from '@constants/SupportDocument';
import { INIT_SUPPORT_OPTIONS } from '@constants/SupportDocument';
import { INIT_VALIDATE } from '@constants/CorrectCancelElectronicDocument';
import { ISupportContext } from '.';

const initContext: ISupportContext = {
    setSupplier: (): void => {},
    setSupportDocument: (): void => {},
    supplier: { ...INITIAL_SUPPLIER },
    supportDocument: { ...SUPPORT_DOCUMENT },
    optionsForm: { ...INIT_SUPPORT_OPTIONS },
    products: [],
    submit: false,
    utilsData: {},
    validations: {
        supplierError: [],
        supportError: { ...INIT_VALIDATE },
    },
    reset: false,
    setReset: (): void => {},
    cardFile: {},
    setCardFile: (): void => {},
    IDSupplier: '',
    modalWarning: {
        supplier: { ...SUPPLIER_RESPONSE },
        showModal: false,
        isExistEmail: false,
        propsModal: { dataClientOrSupplier: { ...SUPPLIER_RESPONSE } },
        handleModal: (): void => {},
        handleBlur: async (): Promise<void> => {},
        handleBlurEmail: async (): Promise<void> => {},
    },
};

export const SupportContext = createContext<ISupportContext>(initContext);
