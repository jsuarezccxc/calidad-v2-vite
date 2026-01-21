import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption } from '@models/WebsiteNode';
import { setFilterCategories } from '@redux/website-node/actions';
import LocalStorage from '@utils/LocalStorage';
import { CAROUSEL_FIVE } from '@constants/WebsiteNode';
import { DROP_ZONE, IElementProps } from '../../drag-and-drop';
import { sleepSlider, Arrow, Buttons, Dots, Slide, Wrapper, SlideAction, ONE, MOBILE, DESKTOP, ARROW_WIDTH } from '.';
import './Slider.scss';

export const Slider: React.FC<IElementProps> = ({ data, isMobile = false, isPreview }) => {
    const dispatch = useDispatch();

    const { Backward, Forward } = SlideAction;
    const [isTicking, setIsTicking] = useState<boolean>(false);
    const [activeButton, setActiveButton] = useState<number>(0);
    const [activeSlide, setActiveSlide] = useState<number>(0);
    const [elementIndexes, setElementIndexes] = useState<number[]>([]);
    const [containerStyle, setContainerStyle] = useState<IGenericRecord>({});
    const [adaptiveSetting, setAdaptiveSetting] = useState<IGenericRecord>({ carouselWidth: 400 });

    const { style, setting = {}, option } = data;
    const [{ center, images, showDots, buttons = [] }, screenSetting] = [setting, setting[DESKTOP]];

    const { carouselHeight, carouselWidth, slideWidth, slideHeight, padding, slides }: IGenericRecord = {
        ...screenSetting,
        ...adaptiveSetting,
    };

    const items = useMemo(() => (buttons.length ? buttons[activeButton]?.contents : images), [images, buttons, activeButton]);
    const [length, bigLength] = [items?.length, elementIndexes?.length];
    const [showArrow, mobileClass] = [length > ONE, isMobile ? MOBILE : ''];
    const centerTheCarousel = isMobile ? false : center;
    const allItems = centerTheCarousel ? [...items, ...items] : items;

    useEffect(() => {
        if (isTicking) sleepSlider(300).then(() => setIsTicking(false));
    }, [isTicking]);

    useEffect(() => {
        setActiveSlide((length - (elementIndexes[0] % length)) % length);
    }, [elementIndexes, length]);

    useEffect(() => {
        setElementIndexes(Array.from(Array(items.length * (centerTheCarousel ? 2 : 1)).keys()));
    }, [centerTheCarousel, items]);

    useEffect(() => {
        LocalStorage.setObject(CAROUSEL_FIVE, { filterCategories: [], selectedPage: '' });
    }, []);

    useEffect(() => {
        const workSpace = document.querySelector(`.${DROP_ZONE}`);
        if (!workSpace) return;
        const resizeObserver = new ResizeObserver(() => {
            setContainerStyle(getContainerStyle());
        });
        resizeObserver.observe(workSpace);
        return (): void => resizeObserver.disconnect();
    }, [images, isMobile, style, items]);

    const moveSlide = (jump = 1, action = Forward): void => {
        if (!isTicking) {
            setIsTicking(true);
            setElementIndexes(prev =>
                prev.map((_, index) =>
                    action === Forward ? prev[(index - jump + bigLength) % bigLength] : prev[(index + jump) % bigLength]
                )
            );
        }
    };

    const getListWidth = (): string => {
        if (slides === ONE) return '300%';
        return centerTheCarousel ? getCutListWidth() : '100%';
    };

    const getCutListWidth = (): string => {
        if (items.length < slides) return '100%';
        return `calc((${length} + ${slides % 2 ? '0' : '0.5'}) * ${slideWidth}px * 2 + ${elementIndexes.length * padding}px)`;
    };

    const calculateSliderWidth = (
        { widthPerScreen, workZoneWidth, slidesPerScreen, carouselWidth }: IGenericRecord,
        rest = false
    ): number => {
        const slides = rest ? slidesPerScreen - 1 : slidesPerScreen;
        const allowedWidth = widthPerScreen + ARROW_WIDTH > workZoneWidth ? slideWidth * slides : widthPerScreen;
        return allowedWidth > carouselWidth ? carouselWidth : allowedWidth;
    };

    const getContainerStyle = (): IGenericRecord => {
        const width = slideWidth * (length > 1 ? length - 1 : 1);
        const carouselWidth = setting[isMobile ? MOBILE : DESKTOP]?.carouselWidth;
        const workZoneWidth = document.querySelector(`.${DROP_ZONE}`)?.clientWidth ?? ARROW_WIDTH;
        const slidesPerScreen = Math.round(workZoneWidth / slideWidth);
        const allowedWidth = calculateSliderWidth({
            widthPerScreen: slideWidth * slidesPerScreen,
            workZoneWidth,
            slidesPerScreen,
            carouselWidth,
        });

        const sharedStyle = {
            ...style,
            listWidth: getListWidth(),
            position: isPreview ? 'initial' : style.position,
            height: carouselHeight,
            minHeight: carouselHeight,
            maxWidth: carouselWidth,
            maxHeight: carouselHeight,
        };

        if (isMobile) {
            setAdaptiveSetting({});
            return { ...sharedStyle, width: carouselWidth, minWidth: carouselWidth };
        }

        if (slideWidth > workZoneWidth) {
            setAdaptiveSetting({
                ...screenSetting,
                padding: 0,
                carouselWidth: workZoneWidth,
                slideWidth: workZoneWidth,
                slides: 1,
            });
            return { ...sharedStyle, minWidth: workZoneWidth, width: workZoneWidth };
        }

        setAdaptiveSetting({});

        if (width > carouselWidth) {
            if (slides === 1) return { ...sharedStyle, minWidth: carouselWidth, width: carouselWidth };
            const newWidth = width > workZoneWidth ? allowedWidth : carouselWidth;
            return { ...sharedStyle, minWidth: newWidth, width: newWidth };
        }

        if (width < workZoneWidth) {
            const newWidth = width > carouselWidth ? carouselWidth : width;
            return { ...sharedStyle, minWidth: newWidth, width: newWidth };
        }

        if (allowedWidth > workZoneWidth) {
            const newWidth = calculateSliderWidth(
                { widthPerScreen: slideWidth * slidesPerScreen, workZoneWidth, slidesPerScreen },
                true
            );
            return { ...sharedStyle, minWidth: newWidth, width: newWidth };
        }

        const newWidth = width < allowedWidth ? width : allowedWidth > carouselWidth ? carouselWidth : allowedWidth;

        return {
            ...sharedStyle,
            minWidth: newWidth,
            width: newWidth,
        };
    };

    const selectSlide = (index: number): void => {
        if (index < activeSlide) moveSlide(activeSlide - index, Backward);
        if (index > activeSlide) moveSlide(index - activeSlide, Forward);
        setActiveSlide((length - (elementIndexes[0] % length)) % length);
    };

    const handleImage = (page: string, categories: string[]): void => {
        if (option !== ElementOption.Five) return;
        LocalStorage.setObject(CAROUSEL_FIVE, { filterCategories: categories, selectedPage: page });
        dispatch(setFilterCategories({ filterCategories: categories, selectedPage: page }));
    };

    return (
        <div
            style={{
                top: style.top,
                left: style.left,
                position: style.position,
                marginLeft: style.marginLeft,
                marginRight: style.marginRight,
                right: style.right,
            }}
        >
            {option === ElementOption.Four && (
                <Buttons
                    activeButton={activeButton}
                    activateButton={(index): void => setActiveButton(index)}
                    buttons={buttons}
                    style={style?.buttons}
                />
            )}
            <Wrapper
                className={`carousel ${items.length ? '' : 'border'}`}
                style={containerStyle}
                hasBackground={setting?.hasBackground}
            >
                <div
                    className="relative w-full h-full"
                    style={{
                        width: centerTheCarousel || slides === ONE ? carouselWidth : '100%',
                        minHeight: carouselHeight,
                    }}
                >
                    {showArrow && (
                        <Arrow
                            onClick={(): void => {
                                moveSlide(1, Backward);
                                setActiveSlide((length - (elementIndexes[0] % length)) % length);
                            }}
                            top={slideHeight / 2}
                            option={option}
                            mobileClass={mobileClass}
                        />
                    )}
                    <div className="relative h-full overflow-hidden flex-center">
                        <ul className="absolute h-full carousel__slide-list" style={{ height: carouselHeight }}>
                            {elementIndexes.map((item, index) => (
                                <Slide
                                    key={index}
                                    position={item}
                                    item={allItems[index]}
                                    setting={{ ...screenSetting, ...adaptiveSetting }}
                                    option={option}
                                    mobileClass={mobileClass}
                                    handleImage={handleImage}
                                />
                            ))}
                        </ul>
                    </div>
                    {showArrow && (
                        <Arrow
                            nextArrow
                            onClick={(): void => moveSlide(1)}
                            top={slideHeight / 2}
                            option={option}
                            mobileClass={mobileClass}
                        />
                    )}
                    {showArrow && showDots && option !== ElementOption.Five && (
                        <Dots
                            activeSlide={activeSlide}
                            items={elementIndexes.slice(0, length)}
                            option={option}
                            selectSlide={selectSlide}
                            mobileClass={mobileClass}
                        />
                    )}
                </div>
            </Wrapper>
        </div>
    );
};
