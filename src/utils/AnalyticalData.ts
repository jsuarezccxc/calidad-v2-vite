/* eslint-disable @typescript-eslint/explicit-module-boundary-types */ /* eslint-disable @typescript-eslint/no-explicit-any */
export const getComparisonValue = (value: any): string => {
    if (isNaN(value) || !value) return '0';
    const formattedValue = Number(value.toFixed(2));
    const positiveBalance = formattedValue > 0;
    return `${positiveBalance ? '+' : '-'} ${
        positiveBalance ? formattedValue : String(formattedValue).slice(1, String(formattedValue).length)
    }`;
};
