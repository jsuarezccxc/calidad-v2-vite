import React, { Dispatch, SetStateAction } from 'react';
import { ChangeEvent, DEFAULT_REQUIRED_TEXT, TextInput } from '@components/input';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import SecondStepExample from '@assets/images/second-step-visibility.png';
import { IGenericRecord } from '@models/GenericRecord';
import usePopper from '@hooks/usePopper';
import usePermissions from '@hooks/usePermissions';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { DESCRIPTION } from '.';

export const SecondStep: React.FC<{
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
            setWebsiteLocationErrors({ ...websiteLocationErrors, description: DEFAULT_REQUIRED_TEXT });

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
            <div className="flex items-center gap-x-3 mb-7" {...mouseProps}>
                <Icon name="lightPurple" classIcon="cursor-pointer" />
                <p className="text-base underline cursor-pointer text-purple font-aller">
                    ¿Para qué es importante agregar una descripción de su empresa a su sitio web?
                </p>
            </div>

            <Tooltip
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: 'visibility-second-step',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TOOL,
                })}
                placement="bottom-start"
                anchorEl={anchorEl}
                iconName="lightBlue"
                description="Para atraer posibles visitantes al brindar más información del sitio web antes de que ingresen."
            />
            <div className="flex flex-col items-center">
                <TextInput
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'visibility-second-step-description',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    labelText="*Descripción:"
                    classesWrapper="max-w-full w-73"
                    placeholder="..."
                    name="description"
                    value={websiteLocationValues.description}
                    onChange={onInputChangeWebsiteLocation}
                    required={websiteLocationErrors?.description}
                    requiredText={websiteLocationErrors?.description}
                    tooltipInfo
                    titleTooltip="Descripción:"
                    descTooltip="Es una descripción breve de su sitio web que aparece debajo del nombre del sitio web cuando es encontrado en internet."
                    maxLength={DESCRIPTION}
                    disabled={disabledInputs}
                />
                <div className="second-img">
                    <img src={SecondStepExample} alt="Second step example" />
                </div>
            </div>
        </div>
    );
};
