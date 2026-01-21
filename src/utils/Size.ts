export const getBaseFontSize = (): number => parseFloat(getComputedStyle(document.documentElement).fontSize);
export const pxToRem = (px: number): number => px / getBaseFontSize();
export const remToPx = (rem: number): number => rem * getBaseFontSize();
export const specificPxToRecalculate = (px: number): number => {
    const currentFontSize = getBaseFontSize();
    const baseFontSize = 16;
    return (px / baseFontSize) * currentFontSize;
}
