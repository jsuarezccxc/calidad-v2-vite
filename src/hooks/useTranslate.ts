import { useTranslation } from 'react-i18next';
import { LANGUAGE_KEY } from '@constants/Translate';

/**
 * This interface describes what the hook returns
 *
 * @typeParam translateText: (key: string) => string - Function to translate text
 */
interface IUseTranslate {
    translateText: (key: string) => string;
}

/**
 * Custom hook that returns a function to translate a text
 *
 * @returns IUseTranslate
 */
const useTranslate = (): IUseTranslate => {
    const [translate] = useTranslation(LANGUAGE_KEY);

    const translateText = (key: string): string => translate(key);

    return {
        translateText,
    };
};

export default useTranslate;
