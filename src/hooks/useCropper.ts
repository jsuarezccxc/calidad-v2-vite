import { ElementOption } from "@models/WebsiteNode";

const useCropper = (): {
    getSizeCropperArea: (option?: ElementOption) => { cropWidth: number, cropHeight: number } | undefined;
} => {
    /**
     * Action to get size area cropper from carousels
     * @typeParam option: ElementOption - current carousel selected
     * @returns { cropWidth: number, cropHeight: number } - Size area
     */
    const getSizeCropperArea = (option?: ElementOption): { cropWidth: number, cropHeight: number, borderRadius?: string } | undefined => {
        if (!option) return;
        switch (option) {
            case ElementOption.One:
                return { cropWidth: 233.98, cropHeight: 350 }
            case ElementOption.Two:
                return { cropWidth: 233.33, cropHeight: 350 }
            case ElementOption.Three:
                return { cropWidth: 350, cropHeight: 350 }
            case ElementOption.Four:
                return { cropWidth: 388.89, cropHeight: 350 }
            case ElementOption.Five:
                return { cropWidth: 262, cropHeight: 350 }
            case ElementOption.Six:
                return { cropWidth: 500, cropHeight: 178.37 }
            case ElementOption.Seven:
                return { cropWidth: 234.31, cropHeight: 350, borderRadius: '1.75rem' }
            case ElementOption.Eight:
                return { cropWidth: 350, cropHeight: 350, borderRadius: '50%' }
            case ElementOption.Nine:
                return { cropWidth: 350, cropHeight: 350, borderRadius: '50%' }
            case ElementOption.Ten:
                return { cropWidth: 170, cropHeight: 350, borderRadius: '3.75rem' }
            case ElementOption.Eleven:
                return { cropWidth: 350, cropHeight: 350 }
            case ElementOption.Twelve:
                return { cropWidth: 500, cropHeight: 179 }
            case ElementOption.Thirteen:
                return { cropWidth: 350, cropHeight: 350 }
                case ElementOption.Fourteen:
                return { cropWidth: 350, cropHeight: 350 }
            default:
                return { cropWidth: 274, cropHeight: 310 }
        }
    }

    return {
        getSizeCropperArea
    }
}

export default useCropper;
