import { CardTypes } from '@constants/PaymentMethods';

export const cardType = (cardNumber: string): string => {
    const amexPattern = new RegExp('^3[47][0-9]{13}$');

    const visaPattern = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');

    const mastercardPattern = new RegExp('^5[1-5][0-9]{14}$');
    const mastercardPattern2 = new RegExp('^2[2-7][0-9]{14}$');

    const dinersPattern = new RegExp('^3[0689][0-9]{12}[0-9]*$');

    const codensaPattern = new RegExp('^59[0-9]{14}$');

    if (amexPattern.test(cardNumber)) return CardTypes.AMEX;

    if (visaPattern.test(cardNumber)) return CardTypes.VISA;

    if (mastercardPattern.test(cardNumber) || mastercardPattern2.test(cardNumber)) return CardTypes.MASTERCARD;

    if (dinersPattern.test(cardNumber)) return CardTypes.DINERS;

    if (codensaPattern.test(cardNumber)) return CardTypes.CODENSA;

    return '';
};
