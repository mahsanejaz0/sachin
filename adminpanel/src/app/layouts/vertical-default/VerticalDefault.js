import React, { useContext } from "react";
import JumboLayout from "@jumbo/components/JumboLayout";
import Header from "../shared/headers/Header";
import Sidebar from "../shared/sidebars/Sidebar";
import Footer from "../shared/footers/Footer";
import useJumboLayout from "@jumbo/hooks/useJumboLayout";
import useJumboHeaderTheme from "@jumbo/hooks/useJumboHeaderTheme";
import useJumboLayoutSidebar from "@jumbo/hooks/useJumboLayoutSidebar";
import useJumboTheme from "@jumbo/hooks/useJumboTheme";
import {SIDEBAR_STYLES} from "@jumbo/utils/constants";
import {headerTheme as theme4} from "../../themes/header/theme4";
import {headerTheme as defaultTheme} from "../../themes/header/default";
import useApp from "../../hooks/useApp";
import layoutConfig from "./layoutConfig";
import { AppContext } from "app/AppContext";
import { createContext } from "react";
import useJumboAuth from "@jumbo/hooks/useJumboAuth";
import { useState } from "react";
import { authUserData } from "backendServices/ApiCalls";
import { useEffect } from "react";

const CustomProvider = createContext();

const VerticalDefault = ({children}) => {
    const {setJumboLayoutOptions} = useJumboLayout();
    const {headerTheme, setHeaderTheme} = useJumboHeaderTheme();
    const {theme} = useJumboTheme();
    const appBarBgColor = headerTheme.components?.MuiAppBar?.styleOverrides?.root?.background;
    const {sidebarOptions} = useJumboLayoutSidebar();
    const appData = useApp();
    const [loginUserData, setloginUserData] = useState('')

    const getUserData =()=>{
        authUserData((response) => {
            setloginUserData(response?.data?.data)
        }, (error) => {
            console.log(error?.response?.data);
        })
    }

    useEffect(()=>{
        getUserData();
    },[])
    // const {...authOptions} = useJumboAuth()
    // const loginUserData = authOptions


    React.useEffect(() => {
        setJumboLayoutOptions(layoutConfig)
    }, []);

    const {checkLogin} = useContext(AppContext)
    const LoginStatus = checkLogin();
    React.useEffect(() => {

        if (appBarBgColor === "#F5F7FA" && sidebarOptions.style === SIDEBAR_STYLES.CLIPPED_UNDER_HEADER) {
            setHeaderTheme({...theme, ...theme4});
            appData.setAppState({
                prevHeaderBgColor: theme?.mode === "dark" ? "#1F1F1F" :"#F5F7FA",
            });
        } else if (appData.prevHeaderBgColor && appData.prevHeaderBgColor === "#F5F7FA") {
            setHeaderTheme({...theme, ...defaultTheme});
        }

    }, [sidebarOptions.style]);


    return (
    <CustomProvider.Provider value={{loginUserData, setloginUserData}}>
        <JumboLayout
            header={LoginStatus && <Header/>}
            sidebar={LoginStatus && <Sidebar/>}
            footer={LoginStatus && <Footer/>}
            headerSx={{
                height: 80,
            }}
        >
            {children}

        </JumboLayout>
    </CustomProvider.Provider>
    );
};

export default VerticalDefault;
export {CustomProvider};
