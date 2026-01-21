/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useState } from 'react';
import { ElementOption as TemplateOption, TemplateType } from '@models/WebsiteNode';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { getTemplateInformation, ImageCarousel, InformativeModal, Title } from '.';

export const TemplateOptions: React.FC = React.memo(() => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption>(TemplateOption.One);

    const selectTemplate = (option: TemplateOption): void => {
        setSelectedTemplate(option);
        toggleModal();
    };

    const templates = Object.values(TemplateType);

    const toggleModal = (): void => setOpenModal(!openModal);

    return (
        <div className="w-full h-full p-2">
            {templates.map(template => (
                <div
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-tab-template-${template}`,
                        action: ActionElementType.CONTAINER,
                        elementType: ElementType.CRD,
                    })}
                    key={template}
                >
                    <Title {...getTemplateInformation(template)} />
                    <ImageCarousel selectTemplate={selectTemplate} templateType={template} />
                </div>
            ))}
            {openModal && <InformativeModal selectedTemplate={selectedTemplate} toggleModal={toggleModal} />}
        </div>
    );
});
