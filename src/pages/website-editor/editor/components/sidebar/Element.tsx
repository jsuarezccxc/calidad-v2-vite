import React, { useContext, useMemo } from 'react';

// Vite dynamic imports for element images (text, image, button, etc.)
const textImages = import.meta.glob<{ default: string }>('/src/assets/images/text/*.svg', { eager: true });
const imageImages = import.meta.glob<{ default: string }>('/src/assets/images/image/*.svg', { eager: true });
const buttonImages = import.meta.glob<{ default: string }>('/src/assets/images/button/*.svg', { eager: true });
const formImages = import.meta.glob<{ default: string }>('/src/assets/images/form/*.svg', { eager: true });
const getElementImage = (type: string, option: string): string => {
    const typeLower = type.toLowerCase();
    const path = `/src/assets/images/${typeLower}/element-${option}.svg`;
    const imageMap: Record<string, Record<string, { default: string }>> = {
        text: textImages,
        image: imageImages,
        button: buttonImages,
        form: formImages,
    };
    return imageMap[typeLower]?.[path]?.default || '';
};
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
