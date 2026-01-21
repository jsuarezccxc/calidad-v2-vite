import React from 'react';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';
import Img from '@pages/website-editor/editor/components/Img';

export const Image: React.FC<IElementProps> = ({ data }) => (
    <Img alt="element" className="transition-all pointer-events-none" src={data.value} style={data.style} />
);
