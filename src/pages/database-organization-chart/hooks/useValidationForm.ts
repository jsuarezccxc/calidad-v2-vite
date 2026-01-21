import { lengthEqualToZero, lengthGreaterThanOne, lengthGreaterThanZero } from "@utils/Length";
import { lowerCase } from "@utils/Text";
import { IAreaData, IErrorTable, TypeError } from "../models/DatabaseOrganizationChart";
import { TYPE_AREA, TYPE_POSITION } from "../constants/DatabaseOrganizationChart";

export const useValidationForm = (): { validateFormTable: (data: IAreaData[], handleErrorsTable: (errors: IErrorTable[]) => void) => boolean } => {
    const validateFormTable = (data: IAreaData[], handleErrorsTable: (errors: IErrorTable[]) => void): boolean => {
        const errors: IErrorTable[] = [];

        data?.forEach(({ name, positions }) => {
            if (lengthGreaterThanZero(data) && !name) errors.push({ type: TYPE_AREA, error: TypeError.REQUIRED });
            if (lengthGreaterThanOne(data.filter(currentArea => lowerCase(currentArea.name) === lowerCase(name))))
                errors.push({ type: TYPE_AREA, error: TypeError.EXIST });
            if (lengthGreaterThanZero(data) && lengthEqualToZero(positions)) errors.push({ type: TYPE_POSITION, error: TypeError.REQUIRED });

            positions?.forEach(position => {
                if (lengthGreaterThanZero(positions) && !position.name)
                    errors.push({ type: TYPE_POSITION, error: TypeError.REQUIRED });
                if (
                    lengthGreaterThanOne(
                        positions.filter(currentPosition => lowerCase(currentPosition.name) === lowerCase(position.name))
                    )
                )
                    errors.push({ type: TYPE_POSITION, error: TypeError.EXIST });
            });
        });

        handleErrorsTable(errors);
        return lengthEqualToZero(errors);
    };

    return {
        validateFormTable
    }
}
