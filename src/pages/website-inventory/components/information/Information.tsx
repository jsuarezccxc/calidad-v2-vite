import React from 'react';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { Information as InformationComponent } from '@components/information';
import { WEBSITE_INVENTORY } from '@information-texts/WebsiteInventory';
import usePopper from '@hooks/usePopper';
import { IWebsiteInventory, getRoutes } from '@pages/website-inventory';
import { INFORMATION_TEXTS_INVENTORY } from '.';

const Information: React.FC<IWebsiteInventory> = ({ isDualModule }) => {
    const { anchorEl: anchorElTitle, mouseProps } = usePopper();
    const { anchorEl: anchorIconLigth, mouseProps: mousePropsPopUp, togglePopper } = usePopper();
    const { TITLE, SUBTITLE, DESCRIPTION } = WEBSITE_INVENTORY(anchorIconLigth, togglePopper, mousePropsPopUp);

    return (
        <>
            <PageTitle classTitle="text-base" title={TITLE} />
            <BreadCrumb routes={getRoutes(isDualModule)} />

            <h1 className="text-26lg font-allerbold text-center w-full py-4.5 text-blue">
                {isDualModule
                    ? INFORMATION_TEXTS_INVENTORY.INVENTORY_MOVEMENTS_TITLE
                    : INFORMATION_TEXTS_INVENTORY.ADD_INVENTORY_TITLE}
            </h1>
            {isDualModule ? (
                <div>
                    <h4 className="mb-4 text-lg cursor-default text-blue font-allerbold">
                        {INFORMATION_TEXTS_INVENTORY.INVENTORY_MOVEMENTS_TITLE}
                    </h4>
                    <div className="mb-4 information__description">
                        {INFORMATION_TEXTS_INVENTORY.INVENTORY_MOVEMENTS_DESCRIPTION}
                    </div>
                </div>
            ) : (
                <InformationComponent
                    classNameContainer="mb-4.5"
                    onClickIcon={(): void => {}}
                    classNameTitle="text-blue text-lg"
                    title={SUBTITLE}
                    description={DESCRIPTION}
                    hoverIcon={{
                        anchorElTitle,
                        mouseProps,
                        description: (
                            <>
                                <span className="font-allerbold">Inventario inicial: </span>&nbsp;es la cantidad de unidades de
                                productos disponibles para la venta al comienzo de un periodo.
                            </>
                        ),
                    }}
                />
            )}
        </>
    );
};

export default Information;
