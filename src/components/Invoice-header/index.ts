import { SelectSearchOption } from 'react-select-search';
import { IGenericRecord } from '@models/GenericRecord';
import { ICardFileProps } from '@components/card-file';

export { default } from './InvoiceHeader';

/**
 * This interface is select input props
 * 
 * @typeParam onChangeSelect: (option: any) => void - Handle change
 * @typeParam optionSelect: SelectSearchOption[] - Options for input
 * @typeParam valueSelect: string - Value input
 * @typeParam name: string - Name input
 */
export interface IInputProps {
    // eslint-disable-next-line
    onChangeSelect: (option: any) => void;
    optionSelect: SelectSearchOption[];
    valueSelect: string;
    name: string;
}

/**
 * Properties for invoice header
 *
 * @typeParam leftColumn: string | JSX.Element - Content in the left column of the container.
 * @typeParam centerColumn: string | JSX.Element - Content in the center column of the container.
 * @typeParam cardFile: ICardFileProps - Properties of the card file displayed.
 * @typeParam className?: string - Optional CSS class to apply custom styles to the component.
 * @typeParam textBack?: string | JSX.Element - Optional text or JSX element for the back label.
 * @typeParam dates?: IGenericRecord - Optional object containing date-related information.
 * @typeParam invoiceType?: string - Optional string to get invoice type
 * @typeParam propsInput?: IInputProps - Optional props to select input
 */
export interface IInvoiceHeaderProps {
    leftColumn: string | JSX.Element;
    centerColumn: string | JSX.Element;
    cardFile: ICardFileProps;
    className?: string;
    textBack?: string | JSX.Element;
    dates?: IGenericRecord;
    invoiceType?: string;
    propsInput?: IInputProps;
}
