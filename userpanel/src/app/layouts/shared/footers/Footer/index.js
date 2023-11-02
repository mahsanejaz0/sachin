import React, { useContext } from 'react';
import {Typography} from "@mui/material";
import Div from "@jumbo/shared/Div";
import { AppContext } from 'app/AppContext';
import { Link } from "react-router-dom";


const Footer = ({loginUserData}) => {
    const {companyName} = useContext(AppContext)

    return (
        <Div sx={{
            py: 2,
            px: {lg: 6, xs: 4},
            borderTop: 2,
            borderColor: 'divider',
            bgcolor: 'background.paper',
        }}>
            <Div sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography variant={"body1"} color={"text.primary"}>{companyName} ©  2023  All rights reserved </Typography>

                {/* {
                   <Typography variant={"body1"} sx={{}} color={"text.primary"}>Powered By <a href="https://threearrowstech.com" target='_blank'><b>Three Arrows Tech</b></a></Typography>
                } */}
                

            </Div>
        </Div>
    );
};

export default Footer;
