import { IGenericRecord } from "@models/GenericRecord";


/**
 * This describes the table parameters
 *
 * @typeParam validations: IValidations - Object containing validation states
 * @typeParam data: IGenericRecord - The main data object for the table
 * @typeParam dataToSend: IGenericRecord[] - Array of data records to be sent
 * @typeParam setDataToSend: React.Dispatch<React.SetStateAction<IGenericRecord[]>> - Function to update the dataToSend state
 * @typeParam isOutput: string - String indicating if the operation is an output
 */
export interface ITableParams {
    validations: IValidations;
    data: IGenericRecord;
    dataToSend: IGenericRecord[];
    setDataToSend: React.Dispatch<React.SetStateAction<IGenericRecord[]>>;
    isOutput: string;
}


/**
 * This describes the validation states
 *  
 * @typeParam validate: boolean - Flag to indicate if general validation has failed
 * @typeParam quantityValidate: boolean - Flag to indicate if quantity validation has failed
 */
export interface IValidations {
    validate: Boolean,
    quantityValidate: Boolean
}
