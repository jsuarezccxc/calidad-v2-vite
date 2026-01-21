import React, { useContext } from 'react';
import { Icon } from '@components/icon';
import { ElementsContext, SidebarContext } from '../../context';

export const Header: React.FC = () => {
    const { selectItem, selectedItem } = useContext(SidebarContext);
    const { selectElement } = useContext(ElementsContext);

    const closeElement = (): void => {
        selectElement(null);
        selectItem(null);
    };

    return (
        <div className="sidebar__header">
            {selectedItem && (
                <>
                    <div className="sidebar__header-icon">
                        <Icon className="w-5 h-4" name={selectedItem.icon} />
                    </div>
                    <p className="sidebar__header-title">{selectedItem.name}</p>
                    <Icon className="w-6 h-6 cursor-pointer" name="cancelBlue" onClick={closeElement} />
                </>
            )}
        </div>
    );
};
