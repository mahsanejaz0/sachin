import React, { useContext } from 'react';
import {Typography} from "@mui/material";
import Div from "@jumbo/shared/Div";
import { AppContext } from 'app/AppContext';

const Footer = () => {
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
                <Typography variant={"body1"} color={"text.primary"}>Copyright {companyName} Name © 2022</Typography>

            </Div>
        </Div>
    );
};

export default Footer;
