export const SubstringText = (text: string, number = 10): string => {
    return text?.length > number ? text.substring(0, number) + '...' : text;
};
