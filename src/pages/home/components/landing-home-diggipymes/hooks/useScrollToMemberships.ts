import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { RootState } from '@redux/rootReducer';
import { setDataCompanyLanding } from '@redux/session/actions';
import { LandingContext } from '@pages/home/context/LandingContext';
import { SectionsHash } from '../constants/sections';

export const useScrollToMemberships = (): { handleScrollMemberships: () => void } => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const { dataCompanyLanding } = useSelector(({ session }: RootState) => ({
        ...session,
    }));
    const { openScheduling, setOpenScheduling } = useContext(LandingContext);

    useEffect(() => {
        if (location.hash === `#${SectionsHash.MEMBERSHIPS}`) {
            setTimeout(() => {
                const element = document.getElementById(SectionsHash.MEMBERSHIPS);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, [location.hash]);

    const handleScrollMemberships = (): void => {
        if (openScheduling) {
            setOpenScheduling(false);
            setTimeout(() => {
                handleScrollMemberships();
            }, 2500);
            return;
        }

        if (dataCompanyLanding) {
            dispatch(setDataCompanyLanding());
            setTimeout(() => {
                handleScrollMemberships();
            }, 2500);
            return;
        }

        if (location.pathname !== '/') {
            history.push(`/#${SectionsHash.MEMBERSHIPS}`);
            return;
        }

        window.location.hash = SectionsHash.MEMBERSHIPS;
    };

    return { handleScrollMemberships };
};
