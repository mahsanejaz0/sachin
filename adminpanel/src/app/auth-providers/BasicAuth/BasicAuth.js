import React from 'react';
import useJumboAuth from "@jumbo/hooks/useJumboAuth";
import authServices from "../../services/auth-services";
import {BasicAuthContext} from "./BasicAuthContext";

const BasicAuth = ({children}) => {
    const {setAuthValues, startAuthLoading,setAuthToken} = useJumboAuth();

    // React.useEffect(() => {
    //     const token = localStorage.getItem("auth-token");
    //     startAuthLoading();
    //     if(token) {
    //         authServices.getCurrentUser().then((user) => {
    //             if (user) {
    //                 setAuthValues({authToken: token, authUser: user});
    //             }
    //         }).catch((error) => {
    //             console.log("error while getting auth user: ", error);
    //         })
    //     }
    //     else {
    //         setAuthValues({
    //             authToken: null,
    //             authUser: null,
    //         });
    //     }
    // }, [setAuthValues, startAuthLoading]);



    const signIn = React.useCallback((username, password,ipaddress, successCallback, errorCallback) => {
        startAuthLoading();
        authServices.signIn({username, password, ipaddress})
            .then((response) => {
                if (response?.data?.token) {
                    localStorage.setItem("auth-token", response?.data?.token)
                    localStorage.setItem("token", response?.data?.token)
                    setAuthValues({authToken: response?.data?.token, authUser: response.data.user});
                    setAuthToken(response?.data?.token)
                    successCallback(response?.data)
                }
                else{
                    successCallback(response?.data) 
                }
            })
            .catch(error => {
                errorCallback(error)
                console.log("login error: ", error)
            });
    }, [setAuthValues, startAuthLoading]);


    const logout = React.useCallback(() => {
        localStorage.removeItem("auth-token");
        startAuthLoading();
        setAuthValues({authToken: null, authUser: null}, {delay: 1000});
    }, [setAuthValues, startAuthLoading]);

    const signUp = React.useCallback(() => {
        //work to finish the signup
    }, []);


    const contextValue = React.useMemo(() => ({
        signUp,
        signIn,
        logout,
    }), [signUp, signIn, logout]);

    return (
        <BasicAuthContext.Provider value={contextValue}>
            {children}
        </BasicAuthContext.Provider>
    )
};

export default BasicAuth;