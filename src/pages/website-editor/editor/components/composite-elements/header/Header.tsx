import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { WEBSITE_PLANS } from '@constants/WebsiteNode';
import { ONE } from '@constants/Numbers';
import { Icon } from '@components/icon';
import { ElementOption, StyleKey } from '@models/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementsContext } from '@pages/website-editor/editor/context';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';
import Img from '@pages/website-editor/editor/components/Img';
import { RootState } from '@redux/rootReducer';
import { LOGO } from '../../element-editor';
import { LIMIT_LINKS, Link, SeeMore, SocialNetworks, ShoppingCart } from './components';
import { DEFAULT_BUTTON_TEXT, DefaultSizeLogo, HEADER_DATA_OPTION, HeaderWrapper, HEIGHT_DEFAULT_MOBILE, IElementData } from '.';
import './Header.scss';

export const Header: React.FC<IElementProps> = ({ data, styleKey, isPreview = false }) => {
    const {
        company: { information },
        websiteNode: { selectedWebsite },
        membership: { planWebsiteActive },
    } = useSelector(({ company, websiteNode, membership }: RootState) => ({
        company,
        membership,
        websiteNode,
    }));

    const [listItems, setListItems] = useState<IElementData | IGenericRecord>({});
    const { logoSize } = useContext(ElementsContext);

    const { option } = data;

    const activePlan = planWebsiteActive === WEBSITE_PLANS.PREMIUM_PLAN || planWebsiteActive === WEBSITE_PLANS.STANDARD_PLAN;

    const initialHeaderTitle = information?.name || listItems?.logo?.text;

    useEffect(() => {
        setListItems({
            ...HEADER_DATA_OPTION[option],
            links: selectedWebsite?.pages?.map(link => ({ text: link.tab_name, url: '#' })),
        });
    }, [selectedWebsite, data]);

    const isMoreItems = listItems?.links?.length > LIMIT_LINKS;

    const mobile: boolean = styleKey === StyleKey.MobileStyle;

    const styleLogo = logoSize?.width && logoSize?.height ? logoSize : data?.setting;

    const valueChange = mobile ? Number(styleLogo?.width) / Number(styleLogo?.height) : ONE;

    const getLogoSize = (): {
        width: number;
        height: number;
    } => {
        const widthFromStyle = Number(styleLogo?.width);
        const heightFromStyle = Number(styleLogo?.height);

        if (mobile) {
            return {
                height: HEIGHT_DEFAULT_MOBILE,
                width: HEIGHT_DEFAULT_MOBILE * valueChange,
            };
        }

        if (widthFromStyle && heightFromStyle) {
            return { width: widthFromStyle, height: heightFromStyle };
        }

        return {
            width: DefaultSizeLogo.Width,
            height: DefaultSizeLogo.Height,
        };
    };

    const resultSizeLogo = getLogoSize();

    return (
        <HeaderWrapper
            style={{
                ...data.style,
                ...(!mobile && { minHeight: '4.5rem' }),
                height: resultSizeLogo.height + 10,
                width: '100%',
                top: '0',
                left: '0',
            }}
            className={`header__container ${mobile ? 'header-mobile' : ''} ${isPreview ? 'preview-mode' : ''}`}
            id="header-component"
        >
            {option === ElementOption.One && (
                <>
                    <div className={`header__logo ${mobile ? 'header-mobile__logo' : ''}`}>
                        {data?.setting?.logo ? (
                            <Img
                                src={data?.setting?.logo}
                                style={{
                                    width: resultSizeLogo.width,
                                    height: resultSizeLogo.height,
                                    maxWidth: '19rem',
                                    maxHeight: '8.125rem',
                                }}
                                alt={LOGO}
                            />
                        ) : (
                            <p className={`header__logo-text ${mobile ? 'header-mobile__logo-text' : ''}`}>
                                {initialHeaderTitle}
                            </p>
                        )}
                    </div>
                    {!mobile && (
                        <div className="header__pages">
                            <div className="header__links">
                                <Link links={listItems?.links} />
                            </div>
                            {isMoreItems && <SeeMore color={data?.style?.title?.color} moreLinks={listItems?.links} />}
                        </div>
                    )}
                    <div className="header__session">
                        {!mobile && (
                            <p
                                style={{ color: data?.style?.title?.color }}
                                className={`header__signInText ${mobile ? 'hidden' : 'mr-4.5'}`}
                            >
                                {listItems?.session?.signInText}
                            </p>
                        )}
                        {mobile && <Icon name="user" className="mr-2" />}
                        {data?.setting?.includeContactButton && (
                            <button disabled className={`header-contact ${mobile ? 'header-mobile-contact' : ''}`}>
                                {data?.setting?.formButtonText || DEFAULT_BUTTON_TEXT}
                            </button>
                        )}
                        {activePlan && (
                            <ShoppingCart
                                fill={data?.style?.title?.color}
                                color={data?.style?.title?.color}
                                counter={listItems?.session?.shoppingCart?.itemCount}
                            />
                        )}
                        {!mobile && <p className="header__session-user">{listItems?.session?.user?.text}</p>}
                        {mobile && <Icon name="hamburger" />}
                    </div>
                </>
            )}

            {option === ElementOption.Two && (
                <>
                    {mobile ? (
                        <Icon name="hamburger" />
                    ) : (
                        <div className="header-two__links">
                            <Link links={listItems?.links} />
                        </div>
                    )}
                    <div className={`header__logo ${mobile ? 'header-mobile__logo' : ''}`}>
                        {data?.setting?.logo ? (
                            <Img
                                src={data?.setting?.logo}
                                style={{
                                    width: resultSizeLogo.width,
                                    height: resultSizeLogo.height,
                                    maxWidth: '19rem',
                                    maxHeight: '8.125rem',
                                }}
                                alt={LOGO}
                            />
                        ) : (
                            <p className={`header__logo-text ${mobile ? 'header-mobile__logo-text' : ''}`}>
                                {initialHeaderTitle}
                            </p>
                        )}
                    </div>
                    {!mobile && isMoreItems && <SeeMore color={data?.style?.title?.color} moreLinks={listItems?.links} />}
                    <div className="header__session">
                        {!mobile && (
                            <p style={{ color: data?.style?.title?.color }} className="header__signInText mr-4.5">
                                {listItems?.session?.signInText}
                            </p>
                        )}
                        {mobile && <Icon name="user" className="mr-2" />}
                        {data?.setting?.includeContactButton && (
                            <button disabled className={`header-contact ${mobile ? 'header-mobile-contact' : ''}`}>
                                {data?.setting?.formButtonText || DEFAULT_BUTTON_TEXT}
                            </button>
                        )}
                        {activePlan && (
                            <ShoppingCart
                                fill={data?.style?.title?.color}
                                color={data?.style?.title?.color}
                                mobile={mobile}
                                counter={listItems?.session?.shoppingCart?.itemCount}
                            />
                        )}

                        {!mobile && <p className="header__session-user">{listItems?.session?.user?.text}</p>}
                    </div>
                </>
            )}

            {option === ElementOption.Three && (
                <>
                    <div className={`header__logo ${mobile ? 'header-mobile__logo' : ''}`}>
                        {data?.setting?.logo ? (
                            <Img
                                src={data?.setting?.logo}
                                style={{
                                    width: resultSizeLogo.width,
                                    height: resultSizeLogo.height,
                                    maxWidth: '19rem',
                                    maxHeight: '8.125rem',
                                }}
                                alt={LOGO}
                            />
                        ) : (
                            <p className={`header__logo-text ${mobile ? 'header-mobile__logo-text' : ''}`}>
                                {initialHeaderTitle}
                            </p>
                        )}
                    </div>
                    {!mobile && (
                        <div className="header__pages">
                            <div className="header__links">
                                <Link links={listItems?.links} />
                            </div>
                            {isMoreItems && <SeeMore color={data?.style?.title?.color} moreLinks={listItems?.links} />}
                        </div>
                    )}
                    <div className="header__session">
                        {!mobile && (
                            <p style={{ color: data?.style?.title?.color }} className="header__signInText mr-4.5">
                                {listItems?.session?.signInText}
                            </p>
                        )}
                        {mobile && <Icon name="user" className="mr-2" />}
                        <SocialNetworks mobile={mobile} netWorks={data?.setting?.socialNetworks} />

                        {activePlan && (
                            <ShoppingCart
                                fill={data?.style?.title?.color}
                                color={data?.style?.title?.color}
                                counter={listItems?.session?.shoppingCart?.itemCount}
                            />
                        )}

                        {mobile && <Icon name="hamburger" />}
                    </div>
                </>
            )}

            {option === ElementOption.Four && (
                <>
                    <SocialNetworks mobile={mobile} netWorks={data?.setting?.socialNetworks} />
                    <div className={`header__logo ${mobile ? 'header-mobile__logo' : ''}`}>
                        {data?.setting?.logo ? (
                            <Img
                                src={data?.setting?.logo}
                                style={{
                                    width: resultSizeLogo.width,
                                    height: resultSizeLogo.height,
                                    maxWidth: '19rem',
                                    maxHeight: '8.125rem',
                                }}
                                alt={LOGO}
                            />
                        ) : (
                            <p className={`header__logo-text ${mobile ? 'header-mobile__logo-text' : ''}`}>
                                {initialHeaderTitle}
                            </p>
                        )}
                    </div>
                    {!mobile && (
                        <div className="header__pages">
                            <div className="header__links">
                                <Link links={listItems?.links} />
                            </div>
                            {isMoreItems && <SeeMore color={data?.style?.title?.color} moreLinks={listItems?.links} />}
                        </div>
                    )}
                    <div className="header__session">
                        {!mobile && (
                            <p style={{ color: data?.style?.title?.color }} className="header__signInText mr-4.5">
                                {listItems?.session?.signInText}
                            </p>
                        )}
                        {mobile && <Icon name="user" className="mr-2" />}

                        {activePlan && (
                            <ShoppingCart
                                fill={data?.style?.title?.color}
                                color={data?.style?.title?.color}
                                counter={listItems?.session?.shoppingCart?.itemCount}
                            />
                        )}

                        {mobile && <Icon name="hamburger" />}
                    </div>
                </>
            )}
        </HeaderWrapper>
    );
};
