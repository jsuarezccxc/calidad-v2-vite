import React, { Dispatch, SetStateAction } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
export * from './Rating';

/**
 * Qualification type
 */
export type qualificationType = 1 | 2 | 3 | 4 | 5;

/**
 * Rating action
 */
export enum RATING_ACTION {
    SET = 'set',
    RESET = 'reset',
}

/**
 * This interface describes the rating props
 *
 * @typeParam qualification: qualificationType - Qualification
 * @typeParam name: string - Optional prop with the rating name
 * @typeParam rating: IGenericRecord - Optional prop with a rating state
 * @typeParam setRating: React.Dispatch<SetStateAction<IGenericRecord>> - Optional prop that change the rating
 * @typeParam reload: boolean - Optional prop that reload the component
 */
export interface IRatingProps {
    qualification: qualificationType;
    name?: string;
    rating?: IGenericRecord;
    setRating?: React.Dispatch<SetStateAction<IGenericRecord>>;
    reload?: boolean;
}

/**
 * Initial state of the rating
 */
export const initialState: boolean[] = [false, false, false, false, false];

/**
 * Function that return qualification
 *
 * @param qualification: number - Qualification
 * @param stars: boolean[] - Rating stars
 * @param setStars: Dispatch<SetStateAction<boolean[]>> - Function that change the stars
 * @returns void
 */
export const getQualification = (
    qualification: number,
    stars: boolean[],
    setStars: Dispatch<SetStateAction<boolean[]>>
): void => {
    setStars(stars.map((star: boolean, index: number) => index <= qualification));
};
