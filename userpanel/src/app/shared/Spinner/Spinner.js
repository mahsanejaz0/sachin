import React from 'react';
import {CircularProgress} from "@mui/material";
import Div from "@jumbo/shared/Div";

const Spinner = () => {
    return (
        <Div
            sx={{
                display: 'flex',
                minWidth: 0,
                alignItems: 'center',
                alignContent: 'center',
                height: '100%',
            }}
        >
            <CircularProgress sx={{m: '-40px auto 0'}}/>
        </Div>
    );
};

export default Spinner;