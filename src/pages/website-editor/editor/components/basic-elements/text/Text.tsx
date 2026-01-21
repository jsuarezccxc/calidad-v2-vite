import React, { useContext, useEffect, useRef } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementType } from '@models/WebsiteNode';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';
import { ElementsContext, ScreensContext } from '@pages/website-editor/editor/context';
import { createStyle } from '@utils/WebsiteNode';
import { Wrapper } from '.';
import './Text.scss';

export const Text: React.FC<IElementProps> = ({ data, handleTextChange }) => {
    const elementRef = useRef<HTMLTextAreaElement>(null);
    const { elements, updateElements } = useContext(ElementsContext);
    const { styleKey } = useContext(ScreensContext);

    useEffect(() => {
        if (elementRef.current?.scrollHeight) {
            updateElements(
                elements.map(element => {
                    if (element.type === ElementType.Text) {
                        return {
                            ...element,
                            [styleKey]: {
                                ...element?.[styleKey],
                                height: elementRef.current?.scrollHeight,
                            },
                            style: {
                                ...element.style,
                                height: elementRef.current?.scrollHeight,
                            },
                        };
                    }

                    return element;
                })
            );
        }
    }, []);

    const formattedStyle: IGenericRecord = createStyle(data.style);

    return (
        <Wrapper
            className={`text-element ${data?.style?.capitalLetter ? 'uppercase' : ''}`}
            maxLength={data?.setting?.maxLength}
            value={data.value}
            onChange={handleTextChange}
            style={formattedStyle}
            name="text"
            rows={1}
            ref={elementRef}
        >
            {data.value}
        </Wrapper>
    );
};
