/**
 * This interface describes the properties of the error
 * 
 * @typeParam field: string - Field name that has an error
 * @typeParam error: string - Type of error of the current field
 * @typeParam with_child: boolean - Optional prop when data has child
 */
 export interface IError {
    field: string;
    error: string;
    with_child?: boolean;
}
