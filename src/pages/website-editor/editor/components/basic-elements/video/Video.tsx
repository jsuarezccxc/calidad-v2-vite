import React from 'react';
import ReactPlayer from 'react-player';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';

export const Video: React.FC<IElementProps> = ({ data }) => (
    <div className="p-6 border rounded-2xl" style={data.style}>
        <ReactPlayer url={data.value} controls width="100%" height="100%" />
    </div>
);
