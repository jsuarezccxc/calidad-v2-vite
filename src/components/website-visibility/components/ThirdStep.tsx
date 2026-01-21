import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { ChangeEvent, TextInput } from '@components/input';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { Tooltip } from '@components/tooltip';
import ThirdStepExample from '@assets/images/third-step-visibility.png';
import { IGenericRecord } from '@models/GenericRecord';
import usePopper from '@hooks/usePopper';
import usePermissions from '@hooks/usePermissions';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { WEBSITE_NAME } from '.';

export const ThirdStep: React.FC<{
    websiteLocationValues: IGenericRecord;
    setWebsiteLocationValues: Dispatch<SetStateAction<IGenericRecord>>;
    websiteLocationErrors: IGenericRecord;
    handleRemoveKeyword: (keyword: string) => void;
    setWebsiteLocationErrors: Dispatch<SetStateAction<IGenericRecord>>;
}> = ({
    websiteLocationValues,
    setWebsiteLocationValues,
    websiteLocationErrors,
    handleRemoveKeyword,
    setWebsiteLocationErrors,
}) => {
    const keywordsRef = useRef<HTMLDivElement>(null);
    const [newKeyword, setNewKeyword] = useState('');
    const { anchorEl, mouseProps } = usePopper();
    const { disabledInputs } = usePermissions();

    const handleSlideKeyword = (): void => {
        if (keywordsRef.current) {
            keywordsRef.current.scrollLeft += 50;
        }
    };

    const onInputChangeWebsiteLocation = (e: ChangeEvent): void => {
        setNewKeyword(e.target.value);
    };

    const handleAddKeyword = (): void => {
        if (newKeyword) {
            const currentKeyword = websiteLocationValues?.keywords;
            if (currentKeyword) {
                const keywords = [websiteLocationValues?.keywords, newKeyword];
                setWebsiteLocationValues({
                    ...websiteLocationValues,
                    keywords: keywords.join(', '),
                });
            } else {
                setWebsiteLocationValues({
                    ...websiteLocationValues,
                    keywords: newKeyword,
                });
                setWebsiteLocationErrors({});
            }

            setNewKeyword('');
        }
    };

    return (
        <div>
            <div className="flex items-center gap-x-3 mb-7" {...mouseProps}>
                <Icon name="lightPurple" classIcon="cursor-pointer" />
                <p className="text-base underline cursor-pointer text-purple font-aller">
                    ¿Para qué es importante agregar palabras clave al sitio web?
                </p>
            </div>
            <Tooltip
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: 'visibility-third-step',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TOOL,
                })}
                placement="bottom-start"
                anchorEl={anchorEl}
                iconName="lightBlue"
                description="Para que su sitio web aparezca en los resultados de la búsqueda del internet cuando los usuarios buscan palabras clave relacionadas con su empresa."
            />
            <div className="flex flex-col items-center">
                <div className={`flex add-keywords ${!websiteLocationValues?.keywords ? 'gap-x-2' : ''}`}>
                    <div className="flex flex-col gap-y-2">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: 'visibility-third-step-keywords',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="*Palabras clave:"
                            classesWrapper="max-w-full input-keyword"
                            placeholder="..."
                            name="keywords"
                            value={newKeyword}
                            onChange={onInputChangeWebsiteLocation}
                            required={websiteLocationErrors?.keywords}
                            requiredText={websiteLocationErrors?.keywords}
                            tooltipInfo
                            titleTooltip="Palabras clave:"
                            descTooltip="Son los términos con los que su sitio web puede ser encontrado en las búsquedas de internet."
                            maxLength={WEBSITE_NAME}
                            disabled={disabledInputs}
                        />
                        {websiteLocationValues?.keywords && (
                            <div className="flex container-keywords">
                                <div className="keywords" ref={keywordsRef}>
                                    {websiteLocationValues?.keywords.split(', ').map((keyword: string, idx: number) => (
                                        <div className="keywords__keyword" key={idx}>
                                            <span>{keyword}</span>
                                            <Icon
                                                name="closeKeyword"
                                                classIcon="cursor-pointer"
                                                onClick={(): void => handleRemoveKeyword(keyword)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <Icon name="arrowRightKeyword" classIcon="cursor-pointer" onClick={handleSlideKeyword} />
                            </div>
                        )}
                    </div>
                    <Button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: 'visibility-third-step-keywords',
                            action: ActionElementType.ADD,
                            elementType: ElementType.BTN,
                        })}
                        disabled={disabledInputs}
                        text="Agregar"
                        classes="xl:mt-6.25 mx-auto"
                        onClick={handleAddKeyword}
                    />
                </div>
                <div className="third-img">
                    <img src={ThirdStepExample} alt="Second step example" />
                </div>
            </div>
        </div>
    );
};
