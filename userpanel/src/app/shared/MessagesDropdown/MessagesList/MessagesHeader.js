import React from 'react';
import CardHeader from "@mui/material/CardHeader";

const MessagesHeader = ({settingMenuCallback}) => {
    return (
        <CardHeader
            title={"Messages"}
            sx={{
                '& .MuiCardHeader-action': {
                    alignSelf: 'center',
                }
            }}
        />
    );
};

export default MessagesHeader;
