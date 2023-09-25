import React, { createContext, useContext, useEffect, useState } from "react";
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
import { authUserData } from "backendServices/ApiCalls";
import { useLocation, useNavigate } from "react-router-dom";

const CustomProvider = createContext();

const VerticalDefault = ({children}) => {
    const {setJumboLayoutOptions} = useJumboLayout();
    const {headerTheme, setHeaderTheme} = useJumboHeaderTheme();
    const {theme} = useJumboTheme();
    const appBarBgColor = headerTheme.components?.MuiAppBar?.styleOverrides?.root?.background;
    const {sidebarOptions} = useJumboLayoutSidebar();
    const appData = useApp();
    const [cartItems , setCartItems] = useState([])
    const [loginUserData, setloginUserData] = useState('')
    const [loading,setLoading]=useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [alertData, setalertData] = useState({
        show:false,
        message:"",
        variant:""
    })
    const nav = useNavigate()
    const location = useLocation();
    const getUserData =()=>{ 
        setLoading(true)
        authUserData((response) => {
            setloginUserData(response?.data?.data)
            setLoading(false)
        }, (error) => {
            console.log(error?.response?.data);
            setLoading(false)      
        })
    }

    
  const addToCart = async (item) => {
    setIsLoading(item.id);
     await new Promise((resolve) => setTimeout(resolve, 500));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    const uniqueCart = cart.filter(
      (cartItem, index, self) => index === self.findIndex((item) => item.id === cartItem.id)
    );

    localStorage.setItem('cart', JSON.stringify(uniqueCart));
    setCartItems(uniqueCart);
    setIsLoading(null);
  };
  const handleRemoveFromCart = (itemId) => {
    // Filter out the item with the provided itemId
    const updatedCart = cartItems.filter((item) => item.id !== itemId);

    // Update the state and local storage with the new cart
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  
const totalCartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);


    useEffect(()=>{
        // if(location.pathname === '/' || location.pathname === '/dashboard')
        // {
            getUserData()
        // }
    },[nav])
    // const {...authOptions} = useJumboAuth()
    // const loginUserData = authOptions
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        setalertData({
            show:false,
            message:"",
            variant:""
        })
    };

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
    <CustomProvider.Provider value={{ cartItems, addToCart, setCartItems,  handleRemoveFromCart , isLoading, setIsLoading ,totalCartQuantity, loginUserData, setloginUserData, loading, open, setOpen, handleOpen, handleClose,alertData, setalertData}}>
        <JumboLayout
            header={LoginStatus && <Header />}
            sidebar={LoginStatus && <Sidebar/>}
            footer={LoginStatus && <Footer loginUserData={loginUserData} />}
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
