import React from 'react';
import { formatMoney } from '@utils/Decimals';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { CRM_MODULE_ID, ONE, ORGANIZATION_PLANNING_MODULE_ID, ZERO } from '@pages/home';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';
import { IMAGE_ORGANIZATION_PLANNING, IMAGE_CRM, IPropsModuleMemberships } from '.';
import './ModulesMemberships.scss';

export const ModulesMemberships: React.FC<IPropsModuleMemberships> = ({ subModule, handleRadioChange, selectedModule }) => {
    const { anchorEl, mouseProps } = usePopper();

    const { name, price_year, isWebsite, id, price_month, quantity, customName, withTooltip } = subModule;

    const nameToShow = isWebsite ? (customName ? customName : name) : name.split(' ').slice(ONE).join(' ');

    return (
        <div
            id={generateId({
                module: ModuleApp.LANDING,
                submodule: `membership-${subModule.name}`,
                action: ActionElementType.INFO,
                elementType: ElementType.CRD,
            })}
            key={id}
            className={`${isWebsite ? 'module_membership__container-website' : 'module_membership__container'} relative`}
        >
            <div className="flex gap-2">
                <input
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: `membership-${subModule.name}`,
                        action: ActionElementType.SELECT,
                        elementType: ElementType.RDO,
                    })}
                    type="radio"
                    name={`moduleSelection-${subModule.modules_id}`}
                    value={id}
                    onChange={(): void => handleRadioChange(subModule)}
                    checked={selectedModule?.id === id}
                    className="-ml-4 module_membership__inputRadio"
                />
                <div className="flex text-center">
                    <div>
                        {!isWebsite && (
                            <p className={`${quantity === ZERO ? 'text-xl' : 'text-4xl'} text-blue font-poppinsbold`}>
                                {quantity === ZERO ? 'Documentos' : quantity}
                            </p>
                        )}
                        <p className={`${isWebsite ? 'module_membership__title-website' : 'module_membership__title'}`}>
                            {withTooltip && price_month === ZERO && (
                                <>
                                    <span {...mouseProps}>
                                        <Icon
                                            id={generateId({
                                                module: ModuleApp.LANDING,
                                                submodule: 'membership-documents-free-icon-tooltip',
                                                action: ActionElementType.INFO,
                                                elementType: ElementType.TOOL,
                                            })}
                                            name="infoGreen"
                                            className="w-4 h-4 mr-1 cursor-pointer"
                                        />
                                    </span>
                                    <Tooltip
                                        id={generateId({
                                            module: ModuleApp.LANDING,
                                            submodule: 'membership-documents-free-content-tooltip',
                                            action: ActionElementType.INFO,
                                            elementType: ElementType.TOOL,
                                        })}
                                        anchorEl={anchorEl}
                                        iconName="infoBlue"
                                        title="15 Documentos:"
                                        description="El Plan Gratis para Microempresas solo podrá ser adquirido una vez por año."
                                        placement="bottom-start"
                                        wrapperClassName="rounded"
                                    />
                                </>
                            )}
                            {quantity === ZERO ? 'Ilimitados por año' : nameToShow}
                        </p>
                    </div>
                </div>
            </div>

            {!isWebsite && price_month === ZERO ? (
                <div className="text-center">
                    <span className="my-0 text-xl text-blue font-poppinsbold">GRATIS</span>
                    <p className="text-xs text-blue font-poppins">Para microempresas</p>
                </div>
            ) : (
                <p className={`${isWebsite ? 'module_membership__price-website my-4' : 'module_membership__price my-4'}`}>
                    {price_month > ZERO && formatMoney(isWebsite ? price_year : price_month, ZERO)}
                </p>
            )}
            {isWebsite && <p className="text-xs text-blue font-poppinsbold">pago anual anticipado</p>}
        </div>
    );
};

export const BigModulesMemberships: React.FC<IPropsModuleMemberships> = ({ subModule, handleRadioChange, selectedModule }) => {
    const { customName, price_year, id } = subModule;

    const handleInputChange = (): void => {
        handleRadioChange(subModule);
    };

    const imageMap: Record<string, string> = {
        [ORGANIZATION_PLANNING_MODULE_ID]: IMAGE_ORGANIZATION_PLANNING,
        [CRM_MODULE_ID]: IMAGE_CRM,
    };

    const imageToRender = (): string => imageMap[id] || '';

    const imgResponsive = (): string => {
        if (id === ORGANIZATION_PLANNING_MODULE_ID) return 'module_membership__imgPlanning';
        return 'module_membership__imgCrm';
    };

    return (
        <div
            id={generateId({
                module: ModuleApp.LANDING,
                submodule: `membership-${customName}`,
                action: ActionElementType.INFO,
                elementType: ElementType.CRD,
            })}
            className="module_membership__big-container"
        >
            <div className="module_membership__big-container--left">
                <div className="w-8/12">
                    <div className="flex text-center">
                        <input
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: `membership-${customName}`,
                                action: ActionElementType.SELECT,
                                elementType: ElementType.RDO,
                            })}
                            type="radio"
                            name={`moduleSelection-${subModule.id}`}
                            value={id}
                            onChange={handleInputChange}
                            checked={selectedModule?.id === id}
                            className="absolute -left-8 module_membership__inputRadio"
                        />
                        <p className="module_membership__title">{customName}</p>
                    </div>

                    <p className="my-4 module_membership__price-website">{formatMoney(price_year, ZERO)}</p>

                    <p className="text-xs text-blue font-poppinsbold">pago anual anticipado</p>
                </div>
            </div>
            <div className="module_membership__big-container--right">
                <img className={imgResponsive()} src={imageToRender()} alt={`img-${customName}`} />
            </div>
        </div>
    );
};
