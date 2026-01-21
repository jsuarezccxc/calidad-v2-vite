import React from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { ES, EN, LANGUAGE, LANGUAGE_KEY } from '@constants/Translate';
import { upperCase } from '@utils/Text';

export const TranslateButton: React.FC = () => {
    const [, i18n] = useTranslation(LANGUAGE_KEY);

    const changeLanguage = (language: string): void => {
        i18n.changeLanguage(language);
        localStorage.setItem(LANGUAGE, language);
    };

    const getColor = (language: string): string => (i18next.language === language ? 'bg-blue' : 'bg-gray');

    return (
        <div className="absolute z-30 flex text-white border rounded-sm w-max gap top-20 right-10">
            <div className={`p-1 border cursor-pointer ${getColor(ES)}`} onClick={(): void => changeLanguage(ES)}>
                {upperCase(ES)}
            </div>
            <div className={`p-1 border cursor-pointer ${getColor(EN)}`} onClick={(): void => changeLanguage(EN)}>
                {upperCase(EN)}
            </div>
        </div>
    );
};
