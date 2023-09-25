import {useNavigate} from "react-router-dom";
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { useEffect } from "react";


const Logout = ({disableSmLogin}) => {
    const {setAuthToken} = useJumboAuth();
    const navigate = useNavigate();
useEffect(() => {
    localStorage.clear()
    setAuthToken(false);
    navigate("/login")
}, [setAuthToken, navigate])

    return(
        <></>
    )
};

export default Logout;
