import React from 'react';
import {List} from "@mui/material";
import {marketingCampaigns} from "./data";
import CampaignItem from "./CampaignItem";

const CampaignsList = ({lasttransactionsdata}) => {
   
    return (

        <List disablePadding>
            {
                
                <>
                {
                     lasttransactionsdata.map((data,index)=>(
                        <CampaignItem item={data}/>
                     ))
                }
                </>
                // lasttransactionsdata.map((data,index)=>{
                // <CampaignItem item={data}/>
                // })
                // // marketingCampaigns.map((item, index) => (
                // //     <CampaignItem  item={item} key={index}/>
                // // ))
            }
        </List>

    );
};

export default CampaignsList;
