import { IGenericRecord } from '@models/GenericRecord';
export { CompanyInformation } from './company-information';
export { DianRegistration } from './dian-registration';
export { Enablement } from './enablement';
export { Steps } from './steps';

/**
 * This interface describes the props of each step
 *
 * @typeParam step: string - This indicates the current step
 * @typeParam indication: string | JSX.Element - Optional tep indication
 * @typeParam image: string - Optional step image
 * @typeParam topText: string | JSX.Element - Optional top text
 * @typeParam bottomText: string | JSX.Element - Optional bottom text
 * @typeParam styles?: IGenericRecord - Optional styles from step
 */
export interface IStep {
    step: string;
    indication?: string | JSX.Element | ((param:IGenericRecord) => JSX.Element);
    image?: string;
    topText?: string | JSX.Element;
    bottomText?: string | JSX.Element;
    titleTooltip?: string;
    descTooltip?: string;
    styles?: IGenericRecord;
}
