import RefreshIcon from "@mui/icons-material/Refresh";
import ArticleIcon from "@mui/icons-material/Article";
import React from "react";
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

export const marketingCampaigns = [
    {
        id: 1,
        name: 'Deposit',
        desc: 'Deposit $23 for investment',
        icon: <FacebookOutlinedIcon/>,
        bgcolor: '#38529A',
        budget: 23,
        growth: 20,
        
    },

    {
        id: 2,
        name: 'ROI',
        desc: 'Receive ROI of $1.3',
        icon: <TwitterIcon/>,
        bgcolor: '#17A9FC',
        budget: 1.3,
        growth: 2,
        
    },

    {
        id: 3,
        name: 'Payout',
        desc: 'Paout of $15 from wallet',
        icon: <InstagramIcon/>,
        bgcolor: '#CC4BB7',
        budget: 15,
        growth: -30,
        
    },

    {
        id: 4,
        name: 'Referral Bonus',
        desc: 'Receive $10 referral bonus from alex',
        icon: <InstagramIcon/>,
        bgcolor: '#CC4BB7',
        budget: 10,
        growth: 30,
        
    },
    {
        id: 5,
        name: 'ROI',
        desc: 'Receive ROI of $1.3',
        icon: <TwitterIcon/>,
        bgcolor: '#17A9FC',
        budget: 1.3,
        growth: 2,
        
    },
    
];

export const menuItems = [
    {
        icon: <RefreshIcon size={20}/>,
        title: "Refresh",
        slug: "refresh"
    },
    {
        icon: <ArticleIcon size={20}/>,
        title: "All campaigns",
        slug: "articles",
    }
];
