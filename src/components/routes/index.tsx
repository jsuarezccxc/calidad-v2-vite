import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface IPrivateRouteProps extends RouteProps {
    component: React.ComponentType<any>;
    isAuthenticated: boolean;
    redirect?: string;
}

interface IPublicRouteProps extends RouteProps {
    component: React.ComponentType<any>;
    redirect?: string;
}

export const PrivateRoute: React.FC<IPrivateRouteProps> = ({
    component: Component,
    isAuthenticated,
    redirect = '/',
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={redirect} />
                )
            }
        />
    );
};

export const PublicRoute: React.FC<IPublicRouteProps> = ({
    component: Component,
    redirect = '/',
    ...rest
}) => {
    return <Route {...rest} render={(props) => <Component {...props} />} />;
};
