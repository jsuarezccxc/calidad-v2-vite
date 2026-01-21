import React, { Dispatch, SetStateAction } from 'react';
import FirstStepExample from '@assets/images/first-step-visibility.png';
import { IGenericRecord } from '@models/GenericRecord';
import { ChangeEvent, DEFAULT_REQUIRED_TEXT, TextInput } from '@components/input';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';
import usePermissions from '@hooks/usePermissions';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { WEBSITE_NAME } from '.';

export const FirstStep: React.FC<{
    websiteLocationValues: IGenericRecord;
    setWebsiteLocationValues: Dispatch<SetStateAction<IGenericRecord>>;
    websiteLocationErrors: IGenericRecord;
    setWebsiteLocationErrors: Dispatch<SetStateAction<IGenericRecord>>;
}> = ({ websiteLocationValues, setWebsiteLocationValues, websiteLocationErrors, setWebsiteLocationErrors }) => {
    const { anchorEl, mouseProps } = usePopper();
    const { disabledInputs } = usePermissions();

    const onInputChangeWebsiteLocation = (e: ChangeEvent): void => {
        const { name, value } = e.target;

        if (!value) {
            setWebsiteLocationErrors({ ...websiteLocationErrors, title: DEFAULT_REQUIRED_TEXT });

            setWebsiteLocationValues({
                ...websiteLocationValues,
                [name]: value,
            });

            return;
        }

        setWebsiteLocationErrors({});

        setWebsiteLocationValues({
            ...websiteLocationValues,
            [name]: value,
        });
    };

    return (
        <div>
            <div className="flex items-center mb-2 gap-x-3" {...mouseProps}>
                <Icon name="lightPurple" classIcon="cursor-pointer" />
                <p className="text-base underline cursor-pointer text-purple font-aller">
                    ¿Para qué es importante agregar un nombre a su empresa?
                </p>
            </div>

            <Tooltip
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: 'visibility-first-step',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TOOL,
                })}
                placement="bottom-start"
                anchorEl={anchorEl}
                iconName="lightBlue"
                description="Para explicar lo que su sitio web ofrece a sus clientes, tenga presente que el nombre sea el mas
                optimo."
            />

            <div className="flex flex-col items-center mt-7">
                <TextInput
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'visibility-first-step-name-website',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    labelText="*Nombre del sitio web:"
                    classesWrapper="max-w-full w-73"
                    placeholder="..."
                    name="title"
                    value={websiteLocationValues?.title}
                    onChange={onInputChangeWebsiteLocation}
                    required={websiteLocationErrors?.title}
                    requiredText={websiteLocationErrors?.title}
                    tooltipInfo
                    titleTooltip="Nombre del sitio web:"
                    descTooltip='Es la forma como quiere que su sitio web sea encontrado en internet. Ejemplo: su empresa de costuras se llama "Vía libre" y desea que sea encontrado como "Costuras Vía Libre" escriba eso en el Nombre del sitio web.'
                    maxLength={WEBSITE_NAME}
                    disabled={disabledInputs}
                />
                <div className="first-img">
                    <img src={FirstStepExample} alt="First step example" />
                </div>
            </div>
        </div>
    );
};
