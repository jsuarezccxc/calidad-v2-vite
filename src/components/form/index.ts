import { ReactNode } from 'react';

export * from './Form';

/**
 * This interface describes the form props
 *
 * @typeParam children: ReactNode - Form children
 * @typeParam sendWithEnter: boolean - Optional prop indicating whether to submit the form with enter
 * @typeParam className: string - Optional prop indicating component classes
 * @typeParam id: string - Optional prop with an id
 * @typeParam onScroll: () => void - Optional prop to handle scroll event
 */
export interface IFormProps {
    children: ReactNode;
    sendWithEnter?: boolean;
    className?: string;
    id?: string;
    onScroll?: () => void;
}

/**
 * This is used to detect if the key pressed is enter
 */
export const ENTER = 'Enter';
