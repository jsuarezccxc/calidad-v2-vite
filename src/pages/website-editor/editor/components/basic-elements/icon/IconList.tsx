import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { LazyIcon } from '@components/lazy-icon';
import { ICONS } from '@constants/WebsiteNode';
import { ElementType } from '@models/WebsiteNode';
import { createDraggableElement } from '@utils/WebsiteNode';
import { DraggableTab } from '../../drag-and-drop';
import { ICONS_NUMBER } from '.';

export const IconList: React.FC = () => {
    const { activePage } = useSelector((state: RootState) => state.websiteNode);
    const icons = useMemo(() => ICONS.slice(0, ICONS_NUMBER), []);
    return (
        <div className="grid h-full grid-cols-6 mt-2 text-center">
            {icons.map(icon => (
                <DraggableTab
                    key={icon}
                    element={createDraggableElement({ type: ElementType.Icon, value: icon, activePageId: activePage?.id })}
                >
                    <LazyIcon content={icon} />
                </DraggableTab>
            ))}
        </div>
    );
};
