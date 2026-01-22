import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Source, STEPS_COMPLETED_PERCENTAGE } from '@constants/Onboarding';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { getOnboardingInformation } from '@redux/onboarding/action';
import { getRoute } from '@utils/Paths';

const useOnboardingNavigation = (source: Source): { handlePostConfirmation: (handleContinue: () => void) => void } => {
    const dispatch = useDispatch();
    const history = useHistory();

    const handlePostConfirmation = async (handleContinue: () => void): Promise<void> => {
        const response: IGenericRecord = await dispatch(getOnboardingInformation());
        const progress = response?.[source]?.percentage;
        if (progress === STEPS_COMPLETED_PERCENTAGE) return handleContinue();
        history.push(getRoute(source === Source.Website ? Routes.WEBSITE_DASHBOARD : Routes.DASHBOARD_ELECTRONIC_DOCUMENT));
    };

    return {
        handlePostConfirmation,
    };
};

export default useOnboardingNavigation;
