import React from 'react';
import { IOptionSelect, SelectSearchInput } from '@components/input';
import { TEXT_FORM } from '@information-texts/DatabaseEmployeesForm';
import { IAffiliationsProps } from '@pages/database-employees-form/models/DatabaseEmployeesForm';
import { FIELDS_EMPLOYEE_FORM, TypesInputs } from '@pages/database-employees-form/constants/DatabaseEmployeesForm';
import { findItemOption } from '@utils/Array';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';

export const Affiliations: React.FC<IAffiliationsProps> = ({ data, options, handleValidateFields, handleChange }) => {
    const { disabledInputs } = usePermissions();
    const { typeContributor, contributorSubtype, eps, severanceFund, pensionFund, compensationFund, riskClass } = TEXT_FORM;
    const {
        CONTRIBUTOR_TYPE_ID,
        CONTRIBUTOR_SUBTYPE_ID,
        EPS_ID,
        SEVERANCE_PAY_ID,
        PENSION_ID,
        COMPENSATION_FUND_ID,
        RISK_LEVEL_ID,
    } = FIELDS_EMPLOYEE_FORM;
    const {
        contributor_type_id,
        contributor_subtype_id,
        eps_id,
        severance_pay_id,
        pension_id,
        compensation_fund_id,
        risk_level_id,
    } = data;

    const {
        contributorTypes,
        contributorSubtypes,
        epsOptions,
        severancesPay,
        pensions,
        compensationsFunds,
        riskClasses,
    } = options;

    const contributorTypesOptionsRender = contributorTypes.map(item => ({ ...item, name: item.value }));
    const contributorSubtypesOptionsRender = contributorSubtypes.map(item => ({ ...item, name: item.value }));
    const epsOptionsRender = epsOptions.map(item => ({ ...item, name: item.value }));
    const severancesPayOptionsRender = severancesPay.map(item => ({ ...item, name: item.value }));
    const pensionsOptionsRender = pensions.map(item => ({ ...item, name: item.value }));
    const compensationsFundsOptionsRender = compensationsFunds.map(item => ({ ...item, name: item.value }));
    const riskClassesOptionsRender = riskClasses.map(item => ({ ...item, name: item.value }));

    return (
        <div className="flex flex-col bg-white rounded-lg p-4.5 shadow-templateDesign">
            <h2 className="text-base text-left text-gray-dark font-allerbold mb-4.5">Afiliaciones</h2>
            <div className="grid w-full grid-cols-3 xs:grid-cols-1 gap-x-7 gap-y-4.5">
                <div>
                    <SelectSearchInput
                        {...typeContributor}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-type-contributor',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        valueSelect={findItemOption(contributorTypesOptionsRender, contributor_type_id)}
                        optionSelect={contributorTypesOptionsRender}
                        onChangeSelect={(_, option: IOptionSelect): void =>
                            handleChange(TypesInputs.SELECT, option, CONTRIBUTOR_TYPE_ID)
                        }
                        required={handleValidateFields(CONTRIBUTOR_TYPE_ID)}
                        classesWrapper="xs:w-full w-73 xlg:w-full"
                        classesInput="w-73 xlg:w-full"
                        selectTextClass="flex items-center h-7"
                        selectIconType="arrowDownGreen"
                        disabled={disabledInputs}
                    />
                </div>
                <div>
                    <SelectSearchInput
                        {...contributorSubtype}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-subtype-contributor',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        valueSelect={findItemOption(contributorSubtypesOptionsRender, contributor_subtype_id)}
                        optionSelect={contributorSubtypesOptionsRender}
                        onChangeSelect={(_, option: IOptionSelect): void =>
                            handleChange(TypesInputs.SELECT, option, CONTRIBUTOR_SUBTYPE_ID)
                        }
                        required={handleValidateFields(CONTRIBUTOR_SUBTYPE_ID)}
                        classesWrapper="xs:w-full w-73 xlg:w-full"
                        classesInput="w-73 xlg:w-full"
                        selectTextClass="flex items-center h-7"
                        selectIconType="arrowDownGreen"
                        disabled={disabledInputs}
                    />
                </div>
                <div>
                    <SelectSearchInput
                        {...eps}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-eps',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        valueSelect={findItemOption(epsOptionsRender, eps_id)}
                        optionSelect={epsOptionsRender}
                        onChangeSelect={(_, option: IOptionSelect): void => handleChange(TypesInputs.SELECT, option, EPS_ID)}
                        required={handleValidateFields(EPS_ID)}
                        classesWrapper="xs:w-full w-73 xlg:w-full"
                        classesInput="w-73 xlg:w-full"
                        selectTextClass="flex items-center h-7"
                        selectIconType="arrowDownGreen"
                        disabled={disabledInputs}
                    />
                </div>
            </div>
            <div className="grid w-full xs:grid-cols-1 grid-cols-4 gap-x-7 gap-y-4.5 mt-4.5">
                <div>
                    <SelectSearchInput
                        {...severanceFund}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-severance-fund',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        valueSelect={findItemOption(severancesPayOptionsRender, severance_pay_id)}
                        optionSelect={severancesPayOptionsRender}
                        onChangeSelect={(_, option: IOptionSelect): void =>
                            handleChange(TypesInputs.SELECT, option, SEVERANCE_PAY_ID)
                        }
                        required={handleValidateFields(SEVERANCE_PAY_ID)}
                        classesWrapper="xs:w-full w-52 xlg:w-full"
                        classesInput="w-52 xlg:w-full"
                        selectTextClass="flex items-center h-7"
                        selectIconType="arrowDownGreen"
                        disabled={disabledInputs}
                    />
                </div>
                <div>
                    <SelectSearchInput
                        {...pensionFund}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-pension-fund',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        valueSelect={findItemOption(pensionsOptionsRender, pension_id)}
                        optionSelect={pensionsOptionsRender}
                        onChangeSelect={(_, option: IOptionSelect): void => handleChange(TypesInputs.SELECT, option, PENSION_ID)}
                        required={handleValidateFields(PENSION_ID)}
                        classesWrapper="xs:w-full w-52 xlg:w-full"
                        classesInput="w-52 xlg:w-full"
                        selectTextClass="flex items-center h-7"
                        selectIconType="arrowDownGreen"
                        disabled={disabledInputs}
                    />
                </div>
                <div>
                    <SelectSearchInput
                        {...compensationFund}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-compensation-fund',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        valueSelect={findItemOption(compensationsFundsOptionsRender, compensation_fund_id)}
                        optionSelect={compensationsFundsOptionsRender}
                        onChangeSelect={(_, option: IOptionSelect): void =>
                            handleChange(TypesInputs.SELECT, option, COMPENSATION_FUND_ID)
                        }
                        required={handleValidateFields(COMPENSATION_FUND_ID)}
                        classesWrapper="xs:w-full w-52 xlg:w-full"
                        classesInput="w-52 xlg:w-full"
                        selectTextClass="flex items-center h-7"
                        selectIconType="arrowDownGreen"
                        disabled={disabledInputs}
                    />
                </div>
                <div>
                    <SelectSearchInput
                        {...riskClass}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-risk-class',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        valueSelect={findItemOption(riskClassesOptionsRender, risk_level_id)}
                        optionSelect={riskClassesOptionsRender}
                        onChangeSelect={(_, option: IOptionSelect): void =>
                            handleChange(TypesInputs.SELECT, option, RISK_LEVEL_ID)
                        }
                        required={handleValidateFields(RISK_LEVEL_ID)}
                        classesWrapper="xs:w-full w-52 xlg:w-full"
                        classesInput="w-52 xlg:w-full"
                        selectTextClass="flex items-center h-7"
                        selectIconType="arrowDownGreen"
                        disabled={disabledInputs}
                    />
                </div>
            </div>
        </div>
    );
};
