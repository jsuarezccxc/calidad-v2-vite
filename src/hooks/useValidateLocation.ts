import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { NO, YES } from '@constants/RadioButtonOptions';
import { COLOMBIA, COLOMBIA_ID } from '@constants/Location';
import { IEntity, IRadioButtonProps } from '@components/radiobutton';
import { dataRadioButton } from '@constants/ElectronicInvoice';
import { ISupplier } from '@models/Supplier';
import { ModuleApp } from '@utils/GenerateId';
import { INPUTS_RESET_LOCATION } from '../constants/Location';

/**
 * Custom hook to validate the location of a supplier.
 *
 * @typeParam isYes: boolean - Indicates if the supplier is located in Colombia.
 * @param propsRadio: IRadioButtonProps - Properties for the radio button component.
 * @param isYesOrNo: (countryId: number) => string - Function to determine if the country is Colombia or not.
 * @param setRadio: Dispatch<SetStateAction<string>> - Function to update the radio button state.
 * @param changeTitle: (isRequired: boolean, title: string) => string - Function to change the title based on whether it is required.
 */
interface IUseValidateLocation {
    isYes: boolean;
    propsRadio: IRadioButtonProps;
    isYesOrNo: (countryId: number) => string;
    setRadio: Dispatch<SetStateAction<string>>;
    changeTitle: (isRequired: boolean, title: string) => string;
}

/**
 * Custom hook to validate the location of a supplier.
 *
 * @param supplier: ISupplier - The supplier object to validate.
 * @param setSupplier: Dispatch<SetStateAction<ISupplier>> - Function to update the supplier state.
 * @returns IUseValidateLocation
 */
const useValidateLocation = (
    supplier: ISupplier,
    setSupplier: Dispatch<SetStateAction<ISupplier>>,
    moduleId: ModuleApp
): IUseValidateLocation => {
    const [radio, setRadio] = useState<string>(YES);

    const isYes = useMemo(() => radio === YES, [radio]);

    const handleRadio = (option: IEntity): void => {
        setSupplier({
            ...supplier,
            ...INPUTS_RESET_LOCATION,
            country_id: String(COLOMBIA_ID),
            country_name: COLOMBIA,
            ...(option.name !== YES && { country_id: '', country_name: '' }),
        });
        setRadio(option.name);
    };

    const changeTitle = (isRequired: boolean, title: string): string => (isRequired ? `*${title}` : title);

    const isYesOrNo = (countryId: number): string => (countryId === COLOMBIA_ID ? YES : NO);

    return {
        isYes,
        propsRadio: {
            moduleId,
            selected: radio,
            entities: dataRadioButton,
            classesContainer: 'mb-4.5',
            classesLabel: 'h-8.2 w-8.7',
            handleChangeOption: handleRadio,
        },
        changeTitle,
        isYesOrNo,
        setRadio,
    };
};

export default useValidateLocation;
