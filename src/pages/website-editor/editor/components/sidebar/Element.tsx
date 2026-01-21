import React, { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { ElementOption, ElementType } from '@models/WebsiteNode';
import { createDraggableElement } from '@utils/WebsiteNode';
import { NON_IMAGE_ELEMENT } from '@pages/website-editor/editor';
import { COMPOSITE_ELEMENTS } from '@pages/website-editor';
import { Header } from './Header';
import { CompositeEditor } from '../element-editor/composite-editor';
import { ElementsContext, SidebarContext } from '../../context';
import { DraggableTab } from '..';
import { getElementText, ELEMENT_OPTIONS } from '.';

// Vite dynamic imports for element images (all subdirectories)
const elementImages = import.meta.glob<{ default: string }>('/src/assets/images/*/element-*.svg', { eager: true });
const getElementImage = (type: string, option: string): string => {
    const path = `/src/assets/images/${type.toLowerCase()}/element-${option}.svg`;
    return elementImages[path]?.default || '';
};

export const Element: React.FC = () => {
    const { activePage } = useSelector((state: RootState) => state.websiteNode);
    const { selectedItem } = useContext(SidebarContext);
    const { selectedElement } = useContext(ElementsContext);

    const type = selectedItem?.type ?? ElementType.Text;

    const getOptions = (): ElementOption[] => {
        const optionsNumber = ELEMENT_OPTIONS[type];
        return optionsNumber ? Object.values(ElementOption).slice(0, optionsNumber) : [];
    };

    const CustomOptions = NON_IMAGE_ELEMENT[type];

    const options = useMemo(() => getOptions(), [type]);

    const showCompositeEditor = useMemo(() => !!COMPOSITE_ELEMENTS.find(element => element.type === selectedElement?.type), [
        selectedElement,
    ]);

    return (
        <div className="w-full h-auto pl-2">
            <Header />
            {options.length ? (
                <div className={`sidebar__element-options sidebar__element-options--${type.toLowerCase()}`}>
                    {showCompositeEditor ? (
                        <CompositeEditor />
                    ) : (
                        options.map(option => (
                            <DraggableTab
                                key={option}
                                element={createDraggableElement({
                                    option,
                                    type,
                                    value: getElementText(option, type),
                                    activePageId: activePage?.id,
                                })}
                            >
                                <img
                                    className="cursor-pointer"
                                    src={getElementImage(type, option)}
                                />
                            </DraggableTab>
                        ))
                    )}
                </div>
            ) : (
                <CustomOptions />
            )}
        </div>
    );
};
