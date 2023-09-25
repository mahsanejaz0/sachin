import React, { useEffect, useState } from 'react';
import {Alert, Grid, IconButton, Collapse, AlertTitle, CircularProgress} from "@mui/material";
import MarketingCampaign from 'app/shared/widgets/MarketingCampaign/MarketingCampaign';
import ObjectCountRevenue from "../../../shared/metrics/ObjectCountCards/ObjectCountRevenue";
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import RedeemIcon from '@mui/icons-material/Redeem';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Referralusers from 'app/shared/widgets/ReferralUsers/ReferralUsers';
import { roidata, referralusers, lasttransactions } from 'backendServices/ApiCalls';
import { useContext } from 'react';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';
import CloseIcon from "@mui/icons-material/Close";
import { Link } from 'react-router-dom';
import Div from '@jumbo/shared/Div/Div';
import { StackedLineChart } from '@mui/icons-material';
import BitcoinPrice from './components/BitcoinPrice/BitcoinPrice';
import RipplePrice from './components/RipplePrice/RipplePrice';
import EthereumPrice from './components/EthereumPrice/EthereumPrice';
import LitecoinPrice from './components/LitecoinPrice/LitecoinPrice';

const Crypto = () => {
    const [userroidata,setUserRoiData]=useState([])
    const [lasttransactionsdata,setLastTransactionsData]=useState([])
    const [picturelink,setPictureLink]=useState([])
    const [referralusersdata,setReferralUsersData]=useState([])
    const [open, setOpen] = React.useState(true);
    const {loginUserData, loading, handleOpen} = useContext(CustomProvider);
    let userData = loginUserData


    const RoiData =()=>{
        roidata((response) => {
            setUserRoiData(response?.data?.data)
        }, (error) => {
            console.log(error?.response?.data);
        })
    }
    const TransactionData =()=>{
        lasttransactions((response) => {
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
            console.log(error?.response?.data);
        })
    } 

    useEffect(()=>{
        RoiData();
        ReferralUsers();
        TransactionData();
    },[])




    if(loading){
        return  <Div
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
      }

    return (
        <Grid container spacing={2}>
      
             <Grid item xs={12} sm={6} lg={3}>
                <BitcoinPrice value={userData?.completedlevelusers*5} title='walletbalance' color="primary.main" icon={<AccountBalanceWalletRoundedIcon fontSize='large'/>} vertical={true}/>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <RipplePrice value={userData?.totalrefBonus} title='referralbonus' color="info.main"  icon={<StackedLineChart fontSize='large'/>}  vertical={true}/>
            </Grid> 
            <Grid item xs={12} sm={6} lg={3}>
                <EthereumPrice value={userData.totalLevelBonus} title='levelbonus' color="secondary.main"  icon={<AccountBalanceWalletRoundedIcon fontSize='large'/>}  vertical={true}/>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <LitecoinPrice value={userData?.totalpayout} title='tpayout' color="success.main"  icon={<RedeemIcon fontSize='large'/>}  vertical={true}/>
            </Grid>
           
            {/* <Grid item xs={12} lg={6}>
                <PortfolioBalance totalroi={userroidata?.roiGroupData?.totalroi} weeklyroi={userroidata?.roiGroupData?.weeklyroi} monthlyroi={userroidata?.roiGroupData?.monthlyroi} />
            </Grid>
            <Grid item xs={12} lg={6}>
                <EarningExpenses earning={userData?.totalearning} investment={userData?.investment}/>
            </Grid> */}
            <Grid item xs={12} lg={6}>
                <Referralusers picturelink={picturelink} referralusersdata={referralusersdata}/>
            </Grid>
            <Grid item xs={12} lg={6}>
                <MarketingCampaign lasttransactionsdata={lasttransactionsdata}/>
            </Grid>
        </Grid>
    );
};

export default Crypto;
