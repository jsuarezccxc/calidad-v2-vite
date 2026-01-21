import { IGenericRecord } from '@models/GenericRecord';

export const addSocialNetwork = (
    newSocialMedia: IGenericRecord,
    socialNetwork: IGenericRecord[],
    setNewField: React.Dispatch<React.SetStateAction<IGenericRecord>>,
    setSocialNetwork: React.Dispatch<React.SetStateAction<IGenericRecord[]>>,
    handleTransformSocialNetworkText: () => void,
    setNewSocialMedia: React.Dispatch<React.SetStateAction<IGenericRecord>>,
    setShowAddSocialNetwork: React.Dispatch<React.SetStateAction<boolean>>
): boolean => {
    const expReg = /^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?.*$/;
    const validate = {
        network_error: false,
        network_message: '',
        link_error: false,
        link_message: '',
    };

    if (!newSocialMedia.link) {
        validate.link_error = true;
        validate.link_message = '*Campo obligatorio';
    }
    if (!newSocialMedia.name) {
        validate.network_error = true;
        validate.network_message = '*Campo obligatorio';
    }
    if (socialNetwork.find(item => item.name.toLowerCase() === newSocialMedia.name.toLowerCase())) {
        validate.network_error = true;
        validate.network_message = '*Seleccione otra red social';
    }
    if (!expReg.test(newSocialMedia.link)) {
        validate.link_error = true;
        validate.link_message = 'link debe ser https://ejemplo.com';
    }
    setNewField(validate);
    if (!validate.link_error && !validate.network_error) {
        socialNetwork.push(newSocialMedia);
        setSocialNetwork(socialNetwork);
        handleTransformSocialNetworkText();
        setNewSocialMedia({ id: 0, name: '', link: '' });
        setShowAddSocialNetwork(false);
    }

    return validate.link_error || validate.network_error;
};

/**
 * Regular expressions for validating URLs of supported social media platforms
 */
export const SOCIAL_REGEX: { [key: string]: RegExp } = {
    Facebook: /https:\/\/www\.facebook\.com/,
    Instagram: /https:\/\/www\.instagram\.com/,
    LinkedIn: /https:\/\/www\.linkedin\.com\/in/,
    X: /https:\/\/www\.twitter\.com/,
    Youtube: /https:\/\/www\.youtube\.com/,
    Snapchat: /https:\/\/www\.snapchat\.com\/add/,
    Pinterest: /https:\/\/www\.pinterest\.com/,
    TikTok: /https:\/\/www\.tiktok\.com/,
    Messenger: /^https:\/\/m\.me\/.*$/,
    Telegram: /^https:\/\/t\.me\/.*$/,
} as const;

/**
 * Function that return if the url is valid
 *
 * @param networkAccount: string - Url social network
 * @param networkType: string - Type of social network
 * @returns boolean
 */
export const validateLink = (networkAccount: string, networkType: string): boolean => {
    return SOCIAL_REGEX[networkType].test(networkAccount);
};

/**
 * This function validates whether a given link is a valid YouTube URL
 *
 * @param link - string - URL to validate
 * @returns boolean
 */
export const isValidYoutubeLink = (link: string): boolean => {
    const regex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return !!link.match(regex);
};
