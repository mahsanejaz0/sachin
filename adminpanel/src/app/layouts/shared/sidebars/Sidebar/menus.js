import React from "react";

import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import LogoutIcon from '@mui/icons-material/Logout';
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PasswordIcon from '@mui/icons-material/Password';
import GroupIcon from '@mui/icons-material/Group';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PaymentsIcon from '@mui/icons-material/Payments';
import VideocamIcon from '@mui/icons-material/Videocam';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaidIcon from '@mui/icons-material/Paid';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import FeedIcon from '@mui/icons-material/Feed';
import SettingsIcon from '@mui/icons-material/Settings';
import ReportIcon from '@mui/icons-material/Report';
import DetailsIcon from '@mui/icons-material/Details';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BalanceIcon from '@mui/icons-material/Balance';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { CurrencyExchange, ShoppingCartOutlined } from "@mui/icons-material";
const menus = [
    {
        label: 'sidebar.menu.home',
        type: "section",
        children: [
            {
                uri: "/dashboard",
                label: 'sidebar.menuItem.dashboard',
                type: "nav-item",
                icon: <GraphicEqIcon sx={{ fontSize: 20 }} />
            },
            //     {
            //         label: 'sidebar.menuItem.miniadmin',
            //         type: "collapsible",
            //         icon: <FeedIcon sx={{ fontSize: 20 }} />,
            //         children: [
            //             {
            //                 uri: "/create-admin",
            //                 label: 'sidebar.menuItem.createadmin',
            //                 type: "nav-item",
            //                 icon: <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />
            //             },
            //             {
            //                 uri: "/manage-admin",
            //                 label: 'sidebar.menuItem.manageadmin',
            //                 type: "nav-item",
            //                 icon: <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />
            //             },
            //         ]
            // },
            {
                label: 'sidebar.menuItem.appUsers',
                type: "collapsible",
                icon: <GroupIcon sx={{ fontSize: 20 }} />,
                children: [
                    {
                        uri: "/active-users",
                        label: 'sidebar.menuItem.activeusers',
                        type: "nav-item",
                    },
                    {
                        uri: "/inactive-users",
                        label: 'sidebar.menuItem.inactiveusers',
                        type: "nav-item",
                    },
                ]
            },
            // {
            //     label: 'sidebar.menuItem.usersdeposit',
            //     type: "collapsible",
            //     icon: <CurrencyExchange sx={{fontSize: 20}}/>,
            //     children: [
            //         {
            //             uri: "/pending-deposits",
            //             label: "sidebar.menuItem.pendingdeposit",
            //             type: "nav-item"
            //         },
            //         {
            //             uri: "/approved-deposits",
            //             label: "sidebar.menuItem.approveddeposit",
            //             type: "nav-item"
            //         },
            //         {
            //             uri: "/rejected-deposits",
            //             label: "sidebar.menuItem.rejecteddeposit",
            //             type: "nav-item"
            //         },

            //     ]
            // },
            // {
            //     label: 'sidebar.menuItem.products',
            //     type: "collapsible",
            //     icon: <ShoppingCartOutlined sx={{ fontSize: 20 }} />,
            //     children: [
            //         {
            //             uri: "/add-product",
            //             label: 'sidebar.menuItem.addproducts',
            //             type: "nav-item",
            //             icon: <Diversity1Icon sx={{ fontSize: 20 }} />
            //         },
            //         {
            //             uri: "/manage-products",
            //             label: 'sidebar.menuItem.manageproducts',
            //             type: "nav-item",
            //             icon: <Diversity1Icon sx={{ fontSize: 20 }} />
            //         },
            //     ]
            // },
            {
                label: 'sidebar.menuItem.reports',
                type: "collapsible",
                icon: <ReportIcon sx={{ fontSize: 20 }} />,
                children: [
                    {
                        uri: "/deposit-report",
                        label: 'Deposit',
                        type: "nav-item",
                        icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    },
                    {
                        uri: "/level-bonus-report",
                        label: 'Level Bonus',
                        type: "nav-item",
                        icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    },
                    {
                        uri: "/roi",
                        label: 'sidebar.menuItem.roireport',
                        type: "nav-item",
                        icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    },
                    // {
                    //     uri: "/referral-bonus",
                    //     label: 'sidebar.menuItem.referralbonus',
                    //     type: "nav-item",
                    //     icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    // },
                    // {
                    //     uri: "/unilevel-bonus",
                    //     label: 'sidebar.menuItem.unilevelbonus',
                    //     type: "nav-item",
                    //     icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    // },
                    // {
                    //     uri: "/payoutreport",
                    //     label: 'sidebar.menuItem.payoutreport',
                    //     type: "nav-item",
                    //     icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    // },
                    // {
                    //     uri: "/rankreport",
                    //     label: 'sidebar.menuItem.rankreport',
                    //     type: "nav-item",
                    //     icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    // },
                ]
            },
            {
                label: 'sidebar.menuItem.payout',
                type: "collapsible",
                icon: <PaidIcon sx={{ fontSize: 20 }} />,
                children: [
                    {
                        uri: "/pending-payout",
                        label: 'sidebar.menuItem.pendingpayout',
                        type: "nav-item",
                        icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    },
                    {
                        uri: "/approved-payout",
                        label: 'sidebar.menuItem.approvedpayout',
                        type: "nav-item",
                        icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    },
                    {
                        uri: "/rejected-payout",
                        label: 'sidebar.menuItem.rejectpayout',
                        type: "nav-item",
                        icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    },
                ]
            },

            {
                label: 'sidebar.menuItem.settings',
                type: "collapsible",
                icon: <SettingsIcon sx={{ fontSize: 20 }} />,
                children: [
                    // {
                    //     uri: "/update-admin-wallet",
                    //     label: "sidebar.menuItem.depositwalletsetting",
                    //     type: "nav-item"
                    // },
                    // {
                    //     uri: "/manage-packages",
                    //     label: "sidebar.menuItem.manage_pkg",
                    //     type: "nav-item"
                    // },
                    // {
                    //     uri: "/updateuserbalance",
                    //     label: 'sidebar.menuItem.updateuserbalance',
                    //     type: "nav-item",
                    //     icon: <BalanceIcon sx={{ fontSize: 20 }} />
                    // },
                    {
                        uri: "/manage-contracts",
                        label: 'sidebar.menuItem.managecontract',
                        type: "nav-item",
                        icon: <AccountBalanceIcon sx={{ fontSize: 20 }} />
                    },
                    {
                        uri: "/manage-deposit-fee",
                        label: 'sidebar.menuItem.managedepositfee',
                        type: "nav-item",
                        icon: <AccountBalanceIcon sx={{ fontSize: 20 }} />
                    },
                    {
                        uri: "/manage-roi",
                        label: 'sidebar.menuItem.manageroi',
                        type: "nav-item",
                        icon: <AccountBalanceIcon sx={{ fontSize: 20 }} />
                    },
                    {
                        uri: "/managecommission",
                        label: 'sidebar.menuItem.managecommission',
                        type: "nav-item",
                        icon: <MonetizationOnIcon sx={{ fontSize: 20 }} />
                    },
                    {
                        uri: "/updatewithdrawal",
                        label: 'sidebar.menuItem.updatewithdrawal',
                        type: "nav-item",
                        icon: <AccountBalanceIcon sx={{ fontSize: 20 }} />
                    },
                    {
                        uri: "/updateloginpassword",
                        label: 'sidebar.menuItem.updatepassword',
                        type: "nav-item",
                        icon: <PasswordIcon sx={{ fontSize: 20 }} />
                    },
                    // {
                    //     uri: "/managetransactionpassword",
                    //     label: 'sidebar.menuItem.managetransactionpassword',
                    //     type: "nav-item",
                    //     icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    // },
                    // {
                    //     uri: "/managezoom",
                    //     label: 'sidebar.menuItem.managezoom',
                    //     type: "nav-item",
                    //     icon: <VideocamIcon sx={{ fontSize: 20 }} />
                    // },
                    // {
                    //     uri: "/manageunilevelbonus",
                    //     label: 'sidebar.menuItem.manageunilevelbonus',
                    //     type: "nav-item",
                    //     icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    // },
                    // {
                    //     uri: "/updateloginpassword",
                    //     label: 'sidebar.menuItem.updateloginpassword',
                    //     type: "nav-item",
                    //     icon: <PasswordIcon sx={{ fontSize: 20 }} />
                    // },
                    // {
                    //     uri: "/updatetransactionpassword",
                    //     label: 'sidebar.menuItem.updatetransactionpassword',
                    //     type: "nav-item",
                    //     icon: <PasswordIcon sx={{ fontSize: 20 }} />
                    // },
                    // {
                    //     uri: "/updateuserpassword",
                    //     label: 'sidebar.menuItem.updateuserpassword',
                    //     type: "nav-item",
                    //     icon: <PasswordIcon sx={{ fontSize: 20 }} />
                    // },

                ]
            },
            // {
            //     label: 'sidebar.menuItem.kyc',
            //     type: "collapsible",
            //     icon: <SupportAgentIcon sx={{ fontSize: 20 }} />,
            //     children: [
            //         {
            //             uri: "/kycpending",
            //             label: 'sidebar.menuItem.kycpending',
            //             type: "nav-item",
            //         },
            //         {
            //             uri: "/approvedkyc",
            //             label: 'sidebar.menuItem.approvedkyc',
            //             type: "nav-item",
            //         },
            //         {
            //             uri: "/rejectedkyc",
            //             label: 'sidebar.menuItem.rejectedkyc',
            //             type: "nav-item",
            //         },
            //     ]
            // },


            {
                label: 'sidebar.menuItem.news',
                type: "collapsible",
                icon: <NewspaperIcon sx={{ fontSize: 20 }} />,
                children: [
                    {
                        uri: "/addnews",
                        label: 'sidebar.menuItem.addnews',
                        type: "nav-item",
                        icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    },
                    {
                        uri: "/managenews",
                        label: 'sidebar.menuItem.managenews',
                        type: "nav-item",
                        icon: <Diversity1Icon sx={{ fontSize: 20 }} />
                    },
                ]

            },
            {
                uri: "/logout",
                label: 'sidebar.menuItem.logout',
                type: "nav-item",
                icon: <LogoutIcon sx={{ fontSize: 20 }} />
            },
        ]
    },

];

export default menus;
