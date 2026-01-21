import React, { useContext } from 'react';
import { FormFields } from '../components';
import { Switch } from '@components/switch';
import { ElementOption } from '@models/WebsiteNode';
import { ElementsContext } from '@pages/website-editor/editor/context';
import './FormEditor.scss';

export const FormEditor: React.FC = () => {
    const { handleSettingChange, selectedElement } = useContext(ElementsContext);

    return (
        <div>
            <FormFields withPlaceholder />
            {selectedElement?.option !== ElementOption.Three && (
                <Switch
                    labelText="¿Visualizar el formulario haciendo click en un botón?"
                    checked={selectedElement?.setting?.addDisplay}
                    handleChange={({ target: { checked } }): void => handleSettingChange({ name: 'addDisplay', value: checked })}
                    wrapperClassName="mt-2"
                />
            )}
        </div>
    );
};
