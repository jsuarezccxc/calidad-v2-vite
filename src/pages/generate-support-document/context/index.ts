import { Dispatch, SetStateAction } from 'react';
import { ISupplier } from '@models/Supplier';
import { IGenericRecord } from '@models/GenericRecord';
import { ISupportDocument } from '@models/SupportDocument';
import { IValidateNote } from '@models/CorrectCancelElectronicDocument';
import { IOptionsSupportForm } from '@components/support-document-and-buy';
import { IUseModalWarningSupplier } from '@hooks/useModalWarningSupplier';

export * from './GlobalContext';

/**
 * This interface is support context
 * 
 * @typeParam supportDocument: ISupportDocument - Context prop support document
 * @typeParam setSupportDocument: Dispatch<SetStateAction<ISupportDocument>> - Context prop dispatch support document
 * @typeParam supplier: ISupplier - Context prop supplier
 * @typeParam setSupplier: Dispatch<SetStateAction<ISupplier>> - Context prop dispatch supplier
 * @typeParam optionsForm: IOptionsSupportForm - Context prop options form
 * @typeParam products: IGenericRecord[] - Context prop products
 * @typeParam submit: boolean - Context prop submit
 * @typeParam utilsData: IGenericRecord - Context prop utils data
 * @typeParam validations: IValidations - Context prop validations
 * @typeParam reset: boolean - Context prop reset
 * @typeParam setReset: Dispatch<SetStateAction<boolean>> - Context prop dispatch reset
 * @typeParam cardFile: IGenericRecord - Context prop card file
 * @typeParam setCardFile: Dispatch<SetStateAction<IGenericRecord>> - Context prop dispatch card file
 * @typeParam modalWarning: IUseModalWarningSupplier - Context prop modal warning
 * @typeParam IDSupplier: string - ID supplier
 */
export interface ISupportContext {
    supportDocument: ISupportDocument;
    setSupportDocument: Dispatch<SetStateAction<ISupportDocument>>;
    supplier: ISupplier;
    setSupplier: Dispatch<SetStateAction<ISupplier>>;
    optionsForm: IOptionsSupportForm;
    products: IGenericRecord[];
    submit: boolean;
    utilsData: IGenericRecord;
    validations: IValidations;
    reset: boolean;
    setReset: Dispatch<SetStateAction<boolean>>;
    cardFile: IGenericRecord;
    setCardFile: Dispatch<SetStateAction<IGenericRecord>>;
    modalWarning: IUseModalWarningSupplier;
    IDSupplier: string;
}

/**
 * This interface is validation forms
 * 
 * @typeParam supplierError: string[] - Supplier errors
 * @typeParam supportError: IValidateNote - Support Errors
 */
export interface IValidations {
    supplierError: string[];
    supportError: IValidateNote;
}
