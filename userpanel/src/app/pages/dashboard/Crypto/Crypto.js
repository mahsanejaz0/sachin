import React, { useEffect, useState } from 'react';
import { Alert, Grid, IconButton, Collapse, AlertTitle, CircularProgress } from "@mui/material";
import MarketingCampaign from 'app/shared/widgets/MarketingCampaign/MarketingCampaign';
import ObjectCountRevenue from "../../../shared/metrics/ObjectCountCards/ObjectCountRevenue";
import ObjectCountRevenue1 from "../../../shared/metrics/ObjectCountCards/ObjectCountRevenue1";
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import RedeemIcon from '@mui/icons-material/Redeem';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Referralusers from 'app/shared/widgets/ReferralUsers/ReferralUsers';
import { roidata, referralusers, lasttransactions, dashBoardApi } from 'backendServices/ApiCalls';
import { useContext } from 'react';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';
import CloseIcon from "@mui/icons-material/Close";
import { Link } from 'react-router-dom';
import Div from '@jumbo/shared/Div/Div';
import { StackedLineChart, ShoppingCartCheckoutRounded } from '@mui/icons-material';
import BitcoinPrice from './components/BitcoinPrice/BitcoinPrice';
import RipplePrice from './components/RipplePrice/RipplePrice';
import EthereumPrice from './components/EthereumPrice/EthereumPrice';
import LitecoinPrice from './components/LitecoinPrice/LitecoinPrice';
// import { ShoppingBagOutlined, ShoppingBasket, ShoppingCartCheckoutRounded } from "@mui/icons-material";

const Crypto = () => {
    const [lasttransactionsdata, setLastTransactionsData] = useState([])
    const [picturelink, setPictureLink] = useState([])
    const [referralusersdata, setReferralUsersData] = useState([])
    const [dashBoardUse, setDashBoardUse] = useState({
        levelBonus: 0,
        payout: 0,
        contractName: '',
        contractAmount: 0
    })
    const [loader, setLoader] = useState(false)
    const { loginUserData, loading, handleOpen } = useContext(CustomProvider);
    let userData = loginUserData

    const TransactionData = () => {
        lasttransactions((response) => {
            setLastTransactionsData(response?.data?.data?.entries)
        }, (error) => {
            console.log(error?.response?.data);
        })
    }

    const dashBoardData = () => {
        setLoader(true)
        dashBoardApi((response) => {
            setDashBoardUse(response?.data?.data)
            setLoader(false)
        }, (error) => {
            setLoader(false)
            console.log(error?.response?.data);
        })
    }

    const ReferralUsers = () => {
        referralusers((response) => {
            setReferralUsersData(response?.data?.data?.entries)
            setPictureLink(response?.data?.data?.picturelink)
        }, (error) => {
            console.log(error?.response?.data);
        })
    }

    useEffect(() => {
        dashBoardData();
        ReferralUsers();
        TransactionData();
    }, [])




    if (loading || loader) {
        return <Div
            sx={{
                display: 'flex',
                minWidth: 0,
                alignItems: 'center',
                alignContent: 'center',
                height: '100%',
            }}
        >
            <CircularProgress sx={{ m: '-40px auto 0' }} />
        </Div>
    }


    return (
        <Grid container spacing={2}>

            <Grid item xs={12} sm={6} lg={4}>
                {
                    loginUserData.status === 'pending' ?
                        <ObjectCountRevenue1 value={userData?.current_balance || 0} title='Buy Contract' color="secondary.main" icon={<ShoppingCartCheckoutRounded fontSize='large' />} vertical={true} />
                        :
                        <ObjectCountRevenue value={dashBoardUse?.contractAmount} title={dashBoardUse?.contractName} color="secondary.main" icon={<ShoppingCartCheckoutRounded fontSize='large' />} vertical={true} />
                }
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
                <ObjectCountRevenue value={userData?.current_balance || 0} title='E-Wallet' color="secondary.main" icon={<AccountBalanceWalletRoundedIcon fontSize='large' />} vertical={true} />
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
                <ObjectCountRevenue value={dashBoardUse?.levelBonus || 0} title='Level Bonus' color="secondary.main" icon={<AccountBalanceWalletRoundedIcon fontSize='large' />} vertical={true} />
            </Grid>

            {/* <Grid item xs={12} sm={6} lg={4}>
                <ObjectCountRevenue value={(dashBoardUse?.payout).toFixed(2) || 0} title='Total Payout' color="secondary.main" icon={<AccountBalanceWalletRoundedIcon fontSize='large' />} vertical={true} />
            </Grid> */}

            <Grid item xs={12} lg={6}>
                <Referralusers picturelink={picturelink} referralusersdata={referralusersdata} />
            </Grid>
            <Grid item xs={12} lg={6}>
                <MarketingCampaign lasttransactionsdata={lasttransactionsdata} />
            </Grid>
        </Grid>
    );
};

export default Crypto;
