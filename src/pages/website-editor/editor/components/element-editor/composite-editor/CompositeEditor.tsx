import React, { useContext, useMemo } from 'react';
import { COMPOSITE_ELEMENT_EDITOR } from '@pages/website-editor/editor';
import { ElementsContext } from '@pages/website-editor/editor/context';
import './CompositeEditor.scss';

export const CompositeEditor: React.FC = () => {
    const { selectedElement } = useContext(ElementsContext);

    const Editor = useMemo(() => (selectedElement ? COMPOSITE_ELEMENT_EDITOR[selectedElement?.type] : null), [
        selectedElement?.type,
    ]);

    return <div className="w-full pb-4 composite-editor">{Editor && <Editor />}</div>;
};
