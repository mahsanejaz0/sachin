import React from 'react';
import AuthorItem from "./AuthorItem";
import {List} from "@mui/material";

const ReferralList = ({referralusersdata,picturelink}) => {

    return (
        <List disablePadding>
            {
                
                referralusersdata.map((item, index) => (
                    <AuthorItem author={item} key={index} picturelink={picturelink} />
                ))
            }
        </List>
    );
}; 

export default ReferralList;
