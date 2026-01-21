import { PERCENTAGE } from "@constants/Tax"
import { parseValue } from "./Number";

export const calculateTax = (tax: string, value: number|string): number => {
    switch (tax) {
        case PERCENTAGE.FOUR:
            return 0.04 * parseValue(value);
        case PERCENTAGE.EIGHT:
            return 0.08 * parseValue(value);
        case PERCENTAGE.SIXTEEN:
            return 0.16 * parseValue(value);

        default:
            return 0;
    }
}