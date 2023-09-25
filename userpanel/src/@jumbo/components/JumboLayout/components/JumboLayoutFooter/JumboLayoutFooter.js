import React from 'react';
import Div from "@jumbo/shared/Div";
import useJumboFooterTheme from "@jumbo/hooks/useJumboFooterTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {useJumboLayoutFooter} from "../../hooks";

const JumboLayoutFooter = ({children}) => {
    const {footerTheme} = useJumboFooterTheme();
    const {footerOptions} = useJumboLayoutFooter();

    if(footerOptions?.hide) {
        return null;
    }
    return (
        <ThemeProvider theme={footerTheme}>
            <Div className="CmtLayout-footer">
                {children}
            </Div>
        </ThemeProvider>
    );
};

export default JumboLayoutFooter;
