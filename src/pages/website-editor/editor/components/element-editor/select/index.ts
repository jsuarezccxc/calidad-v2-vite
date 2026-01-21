import { IGenericRecord } from '@models/GenericRecord';

/* eslint-disable @typescript-eslint/no-explicit-any */
export * from './Arrow';
export * from './Select';

/**
 * This describes the props of the custom option
 *
 * @typeParam index: number - Option index
 * @typeParam onClick: () => void - Event to handle the click
 * @typeParam option: string - Option value
 * @typeParam value: string - Optional select value with the options or options selected
 */
export interface ICustomOption {
    index: number;
    onClick: () => void;
    option: string;
    value?: string;
}

/**
 * This describes the props of the custom list
 *
 * @typeParam handleStyleChange: (data: IGenericRecord) => void - Function to handle style change
 * @typeParam style: IGenericRecord - Optional element style
 * @typeParam value: any - Optional value
 */
export interface ICustomListProps {
    handleStyleChange: (data: IGenericRecord) => void;
    style?: IGenericRecord;
    value?: any;
}

/**
 * This describes the props of the select
 *
 * @typeParam id: String - Id for recognize the select
 * @typeParam customOption: React.FC<ICustomOption> - Optional custom option
 * @typeParam customList: React.FC<any> - Optional custom list
 * @typeParam handleChange?: (value: string) => void - Optional event to handle value change
 * @typeParam handleStyleChange: (data: IGenericRecord) => void - Function to handle style change
 * @typeParam isStyle: boolean - Optional property that indicates whether the component has styles
 * @typeParam labelText: string - Optional label text
 * @typeParam multiple: boolean - Optional prop that indicates whether it is of multiple type
 * @typeParam options: string[] - Optional options
 * @typeParam placeholder: any - Optional placeholder
 * @typeParam selectClassName: string - Optional className to customize the select
 * @typeParam style: IGenericRecord - Optional style
 * @typeParam value: string - Input value
 * @typeParam wrapperClassName: string - Optional className to customize the wrapper
 */
export interface ISelectProps {
    id: string;
    customOption?: React.FC<ICustomOption>;
    customList?: React.FC<ICustomListProps>;
    handleChange?: (value: string) => void;
    handleStyleChange?: (data: IGenericRecord) => void;
    isStyle?: boolean;
    labelText?: string;
    multiple?: boolean;
    options?: string[];
    placeholder?: any;
    selectClassName?: string;
    style?: IGenericRecord;
    value?: string;
    wrapperClassName?: string;
}
