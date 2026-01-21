import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { SHAPES } from '@constants/WebsiteNode';
import { LazyIcon } from '@components/lazy-icon';
import { ElementType } from '@models/WebsiteNode';
import { createDraggableElement } from '@utils/WebsiteNode';
import { DraggableTab } from '../../drag-and-drop';

export const ShapeList: React.FC = () => {
    const { activePage } = useSelector((state: RootState) => state.websiteNode);

    return (
        <div className="grid h-full grid-cols-6 mt-2 text-center">
            {SHAPES.map(shape => (
                <DraggableTab
                    key={shape}
                    element={createDraggableElement({ type: ElementType.Shape, value: shape, activePageId: activePage?.id })}
                >
                    <LazyIcon content={shape} />
                </DraggableTab>
            ))}
        </div>
    );
};
