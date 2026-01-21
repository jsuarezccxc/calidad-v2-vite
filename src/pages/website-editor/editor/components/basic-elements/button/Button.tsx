import React from 'react';
import { useLocation } from 'react-router-dom';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';
import { PATH_PREVIEW } from '.';
import './Button.scss';

export const Button: React.FC<IElementProps> = ({ data, handleTextChange, onClickButton = (): void => {} }) => {
    const { pathname, search } = useLocation();

    const isPreview = `${pathname}${search}` === PATH_PREVIEW;

    return (
        <>
            {isPreview ? (
                <div
                    className={`button button--${data?.option} cursor-pointer flex items-center justify-center`}
                    onClick={(): void => onClickButton(data)}
                    style={data.style}
                >
                    {data.value}
                </div>
            ) : (
                <input
                    className={`button button--${data?.option}`}
                    style={data.style}
                    onChange={handleTextChange}
                    value={data.value}
                />
            )}
        </>
    );
};
