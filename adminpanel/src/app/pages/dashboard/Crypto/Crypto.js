import React, { useEffect, useState } from 'react';
import {Grid} from "@mui/material";
import PortfolioBalance from 'app/shared/metrics/PortfolioBalance/PortfolioBalance';
import EarningExpenses from 'app/shared/metrics/EarningExpenses/EarningExpenses';
import MarketingCampaign from 'app/shared/widgets/MarketingCampaign/MarketingCampaign';
import ObjectCountRevenue from "../../../shared/metrics/ObjectCountCards/ObjectCountRevenue";
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import RedeemIcon from '@mui/icons-material/Redeem';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Referralusers from 'app/shared/widgets/ReferralUsers/ReferralUsers';
import { dashboard,roidata, referralusers, dashboardtransactions } from 'backendServices/ApiCalls';
import { useContext } from 'react';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';
import { Group, ShoppingCart, VerifiedUser } from '@mui/icons-material';

const Crypto = () => {
    const [userroidata,setUserRoiData]=useState([])
    const [dashboarddata,setDashboardData]=useState([])
    const [lasttransactionsdata,setLastTransactionsData]=useState([])
    const [picturelink,setPictureLink]=useState([])
    const [referralusersdata,setReferralUsersData]=useState([])
    
    const {loginUserData} = useContext(CustomProvider);
    let userData = loginUserData


    const DashboardData =()=>{
        dashboard((response) => {
            setDashboardData(response?.data?.data)
        }, (error) => {
            console.log(error?.response?.data);
        })
    }

    const RoiData =()=>{
        roidata((response) => {
            setUserRoiData(response?.data?.data)
        }, (error) => {
            console.log(error?.response?.data);
        })
    }
    const TransactionData =()=>{
        dashboardtransactions((response) => {
            setLastTransactionsData(response?.data?.data?.entries)
        }, (error) => {
            console.log(error?.response?.data);
        })
    }

    const ReferralUsers =()=>{
        referralusers((response) => {
            setReferralUsersData(response?.data?.data?.entries)
            setPictureLink(response?.data?.data?.picturelink)
        }, (error) => {
            console.log(error.response.data);
        })
    } 
    
    

    useEffect(()=>{
        //RoiData();
        //ReferralUsers();
        TransactionData();
        DashboardData();
    },[])
    const totalUsers = +(dashboarddata?.inactiveusers || 0) + +(dashboarddata?.activeusers || 0);




    if(userData.firstname === "")
    {

        return <div>loading</div>
    }

    return (
        <Grid container spacing={3.75}>
             <Grid item xs={12} sm={6} lg={4}>
                <ObjectCountRevenue value={dashboarddata?.deposit || 0} title='Total Deposit' color="secondary.main"  icon={<AccountBalanceWalletRoundedIcon fontSize='large'/>}  vertical={true}/>
            </Grid>
             <Grid item xs={12} sm={6} lg={4}>
                <ObjectCountRevenue value={dashboarddata?.payout || 0} title='Total Payout' color="success.main"  icon={<RedeemIcon fontSize='large'/>}  vertical={true}/>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
                <ObjectCountRevenue value={dashboarddata?.referralbonus || 0} title='Total ROI' color="primary.main" icon={<AccountBalanceWalletRoundedIcon fontSize='large'/>} vertical={true}/>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={4}>
                <ObjectCountRevenue value={dashboarddata?.activeusers || 0} title='Active Users' color="success.main"  icon={<VerifiedUser fontSize='large'/>}  vertical={true}/>
            </Grid> 
            <Grid item xs={12} sm={6} lg={4}>
                <ObjectCountRevenue value={dashboarddata?.inactiveusers || 0} title='Inactive Users' color="warning.main"  icon={<GroupAddIcon fontSize='large'/>}  vertical={true}/>
            </Grid> 
            <Grid item xs={12} sm={6} lg={4}>
                <ObjectCountRevenue value={totalUsers} title='Total Users' color="info.main"  icon={<Group fontSize='large'/>}  vertical={true}/>
            </Grid> 
            <Grid item xs={12} lg={12}>
                <MarketingCampaign lasttransactionsdata={lasttransactionsdata}/>
            </Grid>
        </Grid>
    );
};

export default Crypto;
