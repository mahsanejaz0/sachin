import React from "react";

import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import GroupsIcon from '@mui/icons-material/Groups';
import AddCardIcon from '@mui/icons-material/AddCard';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import { ShoppingBagOutlined, ShoppingBasket, ShoppingCartCheckoutRounded } from "@mui/icons-material";
import NewspaperIcon from '@mui/icons-material/Newspaper';

const menus = [
    {
        label: 'sidebar.menu.home',
        type: "section",
        children: [
            {
                uri: "/dashboard",
                label: 'sidebar.menuItem.dashboard',
                type: "nav-item",
                icon: <GraphicEqIcon sx={{fontSize: 20}}/>
            },
            {
                label: 'Packages',
                type: "collapsible",
                icon: <ShoppingCartCheckoutRounded sx={{fontSize: 20}}/>,
                children: [
                    {
                        uri: "/buypackage",
                        label: "Buy / Upgrade",
                        type: "nav-item"
                    },
                    {
                        uri: "/package-summary",
                        label: "History",
                        type: "nav-item"
                    },                    
                ]
            },
            
            {
                uri: "/deposit",
                label: 'sidebar.menuItem.deposit',
                type: "nav-item",
                icon: <AddCardIcon sx={{fontSize: 20}}/>
            },
            
            {
                uri: "/referrals",
                label: 'sidebar.menuItem.referrals',
                type: "nav-item",
                icon: <GroupsIcon sx={{fontSize: 20}}/>
            },
             {
                uri: "/payout",
                label: 'sidebar.menuItem.rpayout',
                type: "nav-item",
                icon: <AccountBalanceIcon sx={{fontSize: 20}}/>
            },
            {
                label: 'sidebar.menuItem.reports',
                type: "collapsible",
                icon: <GraphicEqIcon sx={{fontSize: 20}}/>,
                children: [
                    {
                        uri: "/deposit-summary",
                        label: "sidebar.menuItem.paymentsummary",
                        type: "nav-item"
                    },
                    {
                        uri: "/payout-summary",
                        label: "Payout Summary",
                        type: "nav-item"
                    },
                    {
                        uri: "/unilevel-summary",
                        label: "sidebar.menuItem.unilevelsummary",
                        type: "nav-item"
                    },
                    {
                        uri: "/referral-bonus",
                        label: "sidebar.menuItem.referralbonus",
                        type: "nav-item"
                    },
                    {
                        uri: "/daily-income",
                        label: "sidebar.menuItem.dailyincome",
                        type: "nav-item"
                    },

                                        
                ]
            },
            
            {
                uri: "/treeview",
                label: 'sidebar.menuItem.tree',
                type: "nav-item",
                icon: <ReduceCapacityIcon sx={{fontSize: 20}}/>
            },
            {
                uri: "/profile",
                label: 'sidebar.menuItem.profile',
                type: "nav-item",
                icon: <AssignmentIndIcon sx={{fontSize: 20}}/>
            },
            {
                uri: "/news",
                label: 'sidebar.menuItem.news',
                type: "nav-item",
                icon: <NewspaperIcon sx={{fontSize: 20}}/>
            },
            {
                uri: "/logout",
                label: 'sidebar.menuItem.logout',
                type: "nav-item",
                icon: <LogoutIcon sx={{fontSize: 20}}/>
            },

            
        ]
    },
  
];

export default menus;
