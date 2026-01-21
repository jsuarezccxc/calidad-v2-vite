import { Dispatch, SetStateAction, useState } from 'react';

/**
 * This interface is for list state by radio buttons
 * 
 * @typeParam [key: string]: string - Radio button name
 */
export interface IRadioButtons {
    [key: string]: string;
}

/**
 * This interface describes that properties the useRadioButton return 
 * 
 * @typeParam radioButtons: IRadioButtons - Radio buttons list
 * @typeParam handleRadioButton: (key: string, event:string) => void - Function change state radio buttons list
 * @typeParam changeRadioButton: string - Key change radio button
 */
interface IUseRadioButton {
    radioButtons: IRadioButtons;
    handleRadioButton: (key: string, event:string) => void;
    changeRadioButton: string;
    setRadioButtons: Dispatch<SetStateAction<IRadioButtons>>;
}

/**
 * The custom hook is for the state many radio buttons
 * 
 * @param initialState: IRadioButtons - Radio button list
 * @returns IUseRadioButton
 */
const useRadioButton = (initialState: IRadioButtons): IUseRadioButton => {
    const [changeRadioButton, setChangeRadioButton] = useState<string>('');
    const [radioButtons, setRadioButtons] = useState<IRadioButtons>(initialState);

    const handleRadioButton = (key: string, event:string): void => {
        setRadioButtons({ ...radioButtons, [key]: event });
        setChangeRadioButton(key);
    };

    return { radioButtons, handleRadioButton, changeRadioButton, setRadioButtons };
};

export default useRadioButton;
