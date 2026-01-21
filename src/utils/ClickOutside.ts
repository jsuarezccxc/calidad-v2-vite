import { useEffect } from 'react';
import { IGenericRecord } from '@models/GenericRecord';

/**
 * This method allows close or modified state for any HTML element when is clicked outside width
 * @param ref allows identify HTML element
 * @param handler function or functions to execute
 */
export const useOnClickOutside = (
    ref: IGenericRecord,
    handler: () => void
): void => {
    useEffect(() => {
        const handleClick = (e: MouseEvent): void => {
            if (!ref.current || ref.current.contains(e.target)) {
                return;
            }
            handler();
        };

        document.addEventListener('click', handleClick);
        return (): void => {
            document.removeEventListener('click', handleClick);
        };
    }, [ref, handler]);
};
