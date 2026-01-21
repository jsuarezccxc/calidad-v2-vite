import { IOptionSelect } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';

export { ResolutionFields } from './ResolutionFields';
export { TaxResponsibilities } from './TaxResponsibilities';
export { Withholdings } from './Withholdings';

/**
 * This interface describes the resolution fields props
 *
 * @typeParam data: { date: Date; resolutionNumber: string } - Fields data
 * @typeParam handleChange: (option: IGenericRecord) => void - Function to change the data
 * @typeParam requiredResolution: boolean - Indicates if the resolution number is required
 */
export interface IResolutionFieldsProps {
    data: { date: Date; resolutionNumber: string };
    handleChange: (option: IGenericRecord) => void;
    requiredResolution: boolean;
}

/**
 * This interface describes the tax responsibilities props
 *
 * @typeParam data: IGenericRecord - Fields data
 * @typeParam handleDataChange: (data: IGenericRecord) => void - Function to change the data
 * @typeParam fiscalOptions: IOptionSelect[] - List of tax responsibilities options
 * @typeParam validate: boolean - Optional, this indicates when to validate the fields
 * @typeParam isClient: boolean - Optional prop to show props when the input is used in client page
 */
export interface ITaxResponsibilitiesProps {
    data: IGenericRecord;
    handleDataChange: (data: IGenericRecord) => void;
    fiscalOptions: IOptionSelect[];
    validate?: boolean;
    isClient?: boolean;
}

/**
 * This interface describes the withholding props
 *
 * @typeParam selectRetention: (name: string) => void - Function to select a retention
 * @typeParam validate: boolean - Indicates the moment to validate the data
 * @typeParam withholdings: IGenericRecord[] - Withholding list
 */
export interface IWithholdingsProps {
    selectRetention: (name: string) => void;
    validate: boolean;
    withholdings: IGenericRecord[];
}

/**
 * Function that indicates if a hold is selected
 *
 * @param withholdings: IGenericRecord[] - Withholding list
 * @returns boolean
 */
export const hasAWithholding = (withholdings: IGenericRecord[]): boolean => withholdings?.some(item => item.is_active);

/**
 * This is used to make a comparison
 */
export const DATE = 'date';

/**
 * Tooltip data
 */
export const TOOLTIP_DATA = {
    titleTooltip: 'Responsabilidad fiscal:',
    descTooltip:
        'es la clasificación que la DIAN le da a los contribuyentes, para saber a qué impuestos están obligados. Se encuentra en la casilla X del RUT.',
};
