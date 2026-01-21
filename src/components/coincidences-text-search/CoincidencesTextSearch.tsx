import React from 'react';
import { removeAccents, lowerCase, removeSpecialCharacters } from '@utils/Text';
import { PRODUCT_NAME } from '@constants/ProductName';
import { ASTERISK_CHARTER, BULLET_POINT, CANCEL_QUESTION_MARK, CANCEL_URL, ICoincidencesTextProps, LINE_BREAK } from '.';
import { lengthGreaterThanZero } from '@utils/Length';

const CoincidencesTextSearch: React.FC<ICoincidencesTextProps> = ({
    text,
    search,
    primaryColor,
    secondaryColor,
    isSelect,
    className,
    prevText,
    classPrevText,
    classNameText,
    classSubText,
    isLink = '',
    resolution = '',
}) => {
    const letters: string[] = search.length === 1 ? text.split(' ').join('-').split('') : text.split(' ');
    const words = search.split(' ');
    let count = 0;

    const getCoincidence = (letter: string, single = false): boolean => {
        const [start, finish] = [!single ? letter : search, !single ? search : letter];
        const parseWord = (letter: string): string => removeAccents(lowerCase(letter));
        if (words.length <= 1) {
            if (single) {
                count = letter === CANCEL_QUESTION_MARK ? 0 : count + 1;
                return removeAccents(lowerCase(letter)) === removeAccents(lowerCase(search[count - 1]));
            } else {
                count = 0;
                return removeAccents(lowerCase(start)).includes(removeAccents(lowerCase(finish)));
            }
        } else {
            return words.some(word => lowerCase(parseWord(word)).includes(lowerCase(parseWord(letter))));
        }
    };

    const getCoincidenceBold = (letter: string): boolean => {
        const parseWord = removeAccents(lowerCase(letter));
        const numberLetter = PRODUCT_NAME.split(' ').reduce((a: string, b: string): string => {
            if (a.length <= b.length) {
                return a;
            } else {
                return b;
            }
        });
        return (
            parseWord.length >= numberLetter.length &&
            removeSpecialCharacters(removeAccents(lowerCase(PRODUCT_NAME))).includes(
                removeSpecialCharacters(removeAccents(lowerCase(parseWord))),
            )
        );
    };

    const getLink = (letter: string, postLetter: string, single = false): boolean => {
        const indexWord = resolution?.indexOf(letter.concat(postLetter)) || 0;
        let filterWord: string[] = [];
        if (!single && resolution) {
            filterWord = resolution?.split(' ').filter((item, index) => {
                if (item === letter && postLetter === resolution?.split(' ')[index + 1]) return item;
            });
            if (lengthGreaterThanZero(filterWord)) {
                return true;
            } else {
                return false;
            }
        } else {
            return !!resolution?.includes(letter.concat(postLetter)) && indexWord > 0;
        }
    };

    const changeBulletPoints = (letter: string): string => {
        if (letter === ASTERISK_CHARTER) {
            return letter.replace(ASTERISK_CHARTER, BULLET_POINT);
        } else {
            return letter.replace(LINE_BREAK, ' ');
        }
    };

    const renderLink = (isLink: string, indexLetter: number, isFirstLetter: boolean, letter: string): React.ReactElement => {
        return (
            <a href={isLink} className="text-purple" rel="noopener" key={indexLetter}>
                {isFirstLetter ? letter : ` ${letter}`}
            </a>
        );
    };

    const transformTextBullets = (item: string, index: number, letterLength: number): string => {
        if (index === letterLength - 1) {
            return item === ASTERISK_CHARTER
                ? item.replace(ASTERISK_CHARTER, BULLET_POINT) + ' '
                : item.replace(LINE_BREAK, ' ') + ' ';
        }
        if (index === 0) {
            return ' ' + changeBulletPoints(item);
        }
        return changeBulletPoints(item);
    };

    const classesResolution = (letter: string, primaryColor: string): string => {
        const defaultClasses = 'text-left font-aller';
        const letterClasses = letter === '-' ? 'break-all' : 'break-normal';
        const weightClasses = getCoincidenceBold(letter) ? 'font-allerbold' : 'font-aller';
        const colorFont = getCoincidence(letter) ? ` font-allerbold ${secondaryColor}` : primaryColor;

        return `${defaultClasses} ${classSubText} ${letterClasses} ${weightClasses} ${colorFont}`;
    };

    const formatLetter = (letter: string): string =>
        letter === '-' || letter === LINE_BREAK ? ' ' : letter.replace(ASTERISK_CHARTER, BULLET_POINT);

    const renderCoincidence = (letter: string, index: number): React.ReactElement | boolean =>
        text.indexOf(resolution) === index + 1 ? (
            <a
                href={isLink}
                key={Symbol(letter).toString()}
                className="pl-1 text-purple"
                target="_blank"
                rel="noopener noreferrer"
            >
                {resolution}
            </a>
        ) : (
            (text.indexOf(resolution) > index || !resolution) && (
                <span key={Symbol(letter).toString()} className={classesResolution(letter, primaryColor ?? '')}>
                    {(letter === ASTERISK_CHARTER || letter === LINE_BREAK) && <br />}
                    {formatLetter(letter)}
                </span>
            )
        );

    const renderBulletText = (
        indexLetter: number,
        letter: string,
        primaryColor: string,
        secondaryColor: string,
    ): React.ReactElement => {
        const classNameCoincidentce = (item: string): string =>
            getCoincidence(item, true) ? `font-allerbold ${secondaryColor}` : primaryColor;

        return (
            <span
                key={indexLetter}
                className={`text-left font-aller ${classSubText} ${getCoincidenceBold(letter) ? 'font-allerbold' : 'font-aller'} ${primaryColor}`}
            >
                {letter.split('').map((item, index) => (
                    <span
                        key={Symbol(`${item}-${index}`).toString()}
                        className={`text-left font-aller ${classSubText} ${getCoincidenceBold(letter) ? 'font-allerbold' : 'font-aller'} ${index === letter.length - 1 ? 'break-all' : 'break-normal'} ${classNameCoincidentce(item)}`}
                    >
                        {(item === ASTERISK_CHARTER || item === LINE_BREAK) && <br />}
                        {transformTextBullets(item, index, letter.length)}
                    </span>
                ))}
            </span>
        );
    };

    const renderNextLink = (letter: string, isFirstLetter: boolean, indexLetter: number, isLink: string): React.ReactElement => {
        return (
            <a key={indexLetter} href={isLink} className={`${isFirstLetter ? 'pl-1' : 'pl-0'} text-purple`} rel="noopener">
                {isFirstLetter ? letter : ` ${letter}`}
            </a>
        );
    };

    const renderLetter = (
        letter: string,
        indexLetter: number,
        classSubText: string,
        primaryColor: string,
    ): React.ReactElement => {
        return (
            <span
                key={indexLetter}
                className={`text-left font-aller ${classSubText} ${letter.includes(CANCEL_URL) ? 'break-all' : 'break-words'} ${getCoincidenceBold(letter) ? 'font-allerbold' : 'font-aller'} ${primaryColor}`}
            >
                {(letter === ASTERISK_CHARTER || letter === LINE_BREAK) && <br />}
                {` ${changeBulletPoints(letter)}`}
            </span>
        );
    };

    return (
        <>
            {!isSelect ? (
                <div className={`flex ${className}`}>
                    <p className={`w-full break-word lg:items-center ${classNameText}`}>
                        {prevText && <span className={classPrevText}>{prevText}</span>}
                        {search.length === 1
                            ? letters.map((letter, index) => renderCoincidence(letter, index))
                            : letters.map((letter, indexLetter) => {
                                  const isFirstLetter = letter === resolution?.split(' ')[0];
                                  const hasCoincidence = getCoincidence(letter);
                                  const hasNextLink = getLink(letter, letters[indexLetter + 1]);

                                  if (hasCoincidence) {
                                      if (hasNextLink) {
                                          return renderLink(isLink, indexLetter, isFirstLetter, letter);
                                      }
                                      return renderBulletText(indexLetter, letter, primaryColor ?? '', secondaryColor ?? '');
                                  }
                                  if (hasNextLink) {
                                      return renderNextLink(letter, isFirstLetter, indexLetter, isLink);
                                  }
                                  return renderLetter(letter, indexLetter, classSubText ?? '', primaryColor ?? '');
                              })}
                    </p>
                </div>
            ) : (
                <div className="flex">
                    {search.length === 1
                        ? letters.map((letter, index) => (
                              <span
                                  key={Symbol(`${letter}-${index}`).toString()}
                                  className={`text-left font-allerbold ${getCoincidence(letter) && 'text-purple'} ${
                                      letter === '-' && 'pl-1'
                                  }`}
                              >
                                  {letter !== '-' && letter}
                              </span>
                          ))
                        : letters.map((letter, index) =>
                              getCoincidence(letter) ? (
                                  letter.split('').map((item, index) => (
                                      <span
                                          key={Symbol(`${letter}-${index}`).toString()}
                                          className={`text-left font-allerbold ${
                                              index <= letter.split('').length - 1 && getCoincidence(item, true) && 'text-purple'
                                          } ${index === letter.split('').length - 1 && 'pr-1'}`}
                                      >
                                          {item}
                                      </span>
                                  ))
                              ) : (
                                  <span key={Symbol(`${letter}-${index}`).toString()} className="pr-1 text-left font-allerbold">
                                      {letter}
                                  </span>
                              ),
                          )}
                </div>
            )}
        </>
    );
};

export default CoincidencesTextSearch;
