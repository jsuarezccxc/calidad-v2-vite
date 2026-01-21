export * from './TableError';

/**
 * This interface describes the properties of the table error component receives
 *
 * @typeParam mistakes: number - Optional prop that defines number of mistakes of the validated data
 * @typeParam customText: string - Optional prop that defines if table error has a custom text
 * @typeParam className: string - Optional prop for customize the component
 */
export interface ITableErrorProps {
    mistakes?: number;
    customText?: string;
    className?: string;
}
