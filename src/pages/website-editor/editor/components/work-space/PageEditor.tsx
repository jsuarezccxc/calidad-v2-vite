import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ColorPicker } from '@components/color-picker';
import { RootState } from '@redux/rootReducer';
import { setActivePage } from '@redux/website-node/actions';
import LocalStorage from '@utils/LocalStorage';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ELEMENTS } from '@constants/WebsiteNode';

export const PageEditor: React.FC = () => {
    const dispatch = useDispatch();
    const { activePage } = useSelector((state: RootState) => state.websiteNode);

    const handleBackgroundChange = (background: string): void => {
        const elements = JSON?.parse(LocalStorage.get(ELEMENTS));
        if (activePage) dispatch(setActivePage({ ...activePage, style: { background }, allElements: elements ? elements : [] }));
    };

    return (
        <div className="basic-editor">
            <p className="mr-2 text-gray-dark text-tiny">Color fondo de página</p>
            <ColorPicker
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-page-editor-color-background`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                handleChange={handleBackgroundChange}
                value={activePage?.style?.background}
            />
        </div>
    );
};
