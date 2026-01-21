import React from 'react';
import congratulationsImage from '@assets/images/congratulations.svg';
import { PRODUCT_NAME } from '@constants/ProductName';
import { Button } from '@components/button';
import usePermissions from '@hooks/usePermissions';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ICongratulationsProps } from '.';
import './Congratulations.scss';

export const Congratulations: React.FC<ICongratulationsProps> = ({ handleRedirect }) => {
    const { disabledInputs } = usePermissions();
    return (
        <div className="congratulations">
            <div className="congratulations__container">
                <div className="information__container">
                    <h3 className="title">¡Felicidades!</h3>
                    <label className="description">¡Ya está todo listo, ya tiene su dominio conectado con {PRODUCT_NAME}!</label>
                </div>
                <div className="image__container">
                    <img src={congratulationsImage} className="img--styles" />
                </div>
            </div>
            <div className="congratulations__button">
                <Button
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `build`,
                        action: ActionElementType.ACTION,
                        elementType: ElementType.BTN,
                    })}
                    disabled={disabledInputs}
                    text="Cómo armar el sitio web"
                    classes="button--styles"
                    linesNumber={2}
                    onClick={(): void => handleRedirect()}
                />
            </div>
        </div>
    );
};
