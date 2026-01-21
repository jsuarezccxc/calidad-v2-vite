/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { CLICK } from '@constants/HtmlEvents';
import { IGenericRecord } from '@models/GenericRecord';

/**
 * This describes the properties returned
 *
 * @typeParam parentRef: MutableRefObject<any> - Parent ref
 * @typeParam renderElement: boolean - This indicates when to show the element
 */
interface IToggleRendering {
    parentRef: MutableRefObject<any>;
    renderElement: boolean;
}

/**
 * Custom hook to toggle the rendering of an element
 *
 * @param arrowId: string - Optional arrow id, which indicates whether the component should be managed through the children
 * @returns IToggleRendering
 */
const useToggleRendering = (arrowId = ''): IToggleRendering => {
    const [renderElement, setRenderElement] = useState<boolean>(false);
    const parentRef: MutableRefObject<any> = useRef(null);

    useEffect(() => {
        document.addEventListener(CLICK, toggleAction);
        return (): void => document.removeEventListener(CLICK, toggleAction);
    }, [parentRef, renderElement]);

    const handleRenderingToggle = ({ target }: IGenericRecord): void => {
        const elementIsChild = isChild(target);
        const keepOpen = target.classList.contains(KEEP_OPEN);
        if (keepOpen) return setRenderElement(elementIsChild ? true : false);
        setRenderElement(elementIsChild ? !renderElement : false);
    };

    const toggleWithChildren = ({ target }: IGenericRecord): void => {
        setRenderElement(target.id === arrowId ? !renderElement : isChild(target));
    };

    const toggleAction = arrowId ? toggleWithChildren : handleRenderingToggle;

    const isChild = (target: IGenericRecord): boolean => parentRef?.current?.contains(target);

    return {
        parentRef,
        renderElement,
    };
};

export default useToggleRendering;

export const KEEP_OPEN = 'keep-open';
