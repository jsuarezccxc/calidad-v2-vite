import { IArea, IDeleteData, IPosition } from "@models/DataEmployees";

/**
 * Interface extends by IPosition
 * 
 * @typeParam temporal_id: string - Optional id to get unique object
 */
export interface IPositionData extends IPosition {
    temporal_id?: string;
}

/**
 * Interface extends by IArea
 * 
 * @typeParam temporal_id: string - Optional id to get unique object
 */
export interface IAreaData extends Omit<IArea, 'positions'> {
    temporal_id?: string;
    positions: IPositionData[];
}

/**
 * Options type action table
 */
export enum TypeAction {
    ADD = 'ADD',
    SELECT = 'SELECT',
    WRITE = 'WRITE',
}

/**
 * Current type action table
 */
export type CurrentTypeAction = TypeAction.ADD | TypeAction.SELECT | TypeAction.WRITE;

/**
 * Options modal to show
 */
export enum TypeModal {
    SAVE = 'save',
    AREA = 'area',
    POSITION = 'position',
}

/**
 *  Current type modals
 */
export type CurrentModal = TypeModal.SAVE | TypeModal.AREA | TypeModal.POSITION;

/**
 * Types errors
 */
export enum TypeError {
    REQUIRED = 'required',
    EXIST = 'exist'
}

/**
 * Types selection
 */
export enum TypeSelection {
    AREAS = 'areas',
    POSITIONS = 'positions',
}

/**
 * Interface errors in screen
 * 
 * @typeParam type: string - Type field error
 * @typeParam error: TypeError.REQUIRED | TypeError.EXIST - Errors
 */
export interface IErrorTable {
    type: string,
    error: TypeError.REQUIRED | TypeError.EXIST
}

/**
 * Actions in table
 */
export type ActionsTable = {
    handleActionsArea: (type: CurrentTypeAction, areaId?: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
    handleActionsPosition: (type: CurrentTypeAction, areaId: string, positionId?: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
    handleDelete: () => void;
}

/**
 * Interface props table area rol
 * 
 * @typeParam data: IArea[] - Data table
 * @typeParam dataDelete: IDeleteData - Data to delete from table
 * @typeParam actionsTable: ActionsTable - Actions table to change fields
 * @typeParam errors: IErrorTable[] - Errors table
 * @typeParam isSubmitted: boolean - State form send
 * @typeParam isFiltered: string - Id option to filter data
 */
export interface ITableAreaRolProps {
    data: IAreaData[];
    dataDelete: IDeleteData;
    actionsTable: ActionsTable;
    errors: IErrorTable[];
    isSubmitted: boolean;
    isFiltered: string;
}
