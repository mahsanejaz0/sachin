import React from 'react';
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Stack from "@mui/material/Stack";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import Span from "@jumbo/shared/Span";
import { useTranslation } from "react-i18next";
import { TrendingDown } from '@mui/icons-material';
import { Button } from '@mui/material';

const Orders = ({ data, handleClick }) => {
    const { t } = useTranslation();
    let color;
    if (data?.status === 'Active') {
        color = 'success'
    }
    else {
        color = 'warning'
    }

    let contractAmount = data?.amount
    let roiAmount = data?.roi
    let amount10 = (contractAmount / 100) * 10
    let status = true

    if (roiAmount >= amount10) {
        status = false
    }

    let grwothh = (data?.total_roi / contractAmount) * 100

    if (grwothh > 100) {
        grwothh = 100
    }


    return (
        <JumboCardQuick
            title={<Typography variant={"h5"} mb={0}>{data?.name}</Typography>}
            action={
                <Stack direction={"row"} spacing={1}>
                    <Chip label={data?.status} color={color} size={"small"} />
                    <ShowChartIcon fontSize={"small"} />
                </Stack>
            }
            wrapperSx={{ textAlign: 'center' }}
            headerSx={{
                borderBottom: 1,
                borderBottomColor: 'divider'
            }}
        >
            <Typography variant={"h5"}>Contract Amount: ${data?.amount}</Typography>
            <Typography variant={"body1"}>R.O.I:
                <Span sx={{ color: 'success.main', ml: 1 }}>${data?.roi}
                    <TrendingDown fontSize={"small"} sx={{ verticalAlign: 'middle', ml: 1 }} />
                </Span>
                <br></br>
                {/* <Typography color={'red'} variant={"p"}>Your contract will expire, when you get 100% profit of your contract amount.</Typography> */}
            </Typography>
            <Typography variant={"body1"}>Growth:
                <Span sx={{ color: 'success.main', ml: 1 }}>{grwothh}%
                    <TrendingDown fontSize={"small"} sx={{ verticalAlign: 'middle', ml: 1 }} />
                </Span>
                <br></br>
                {/* <Typography color={'red'} variant={"p"}>Your contract will expire, when you get 100% profit of your contract amount.</Typography> */}
            </Typography>
            <Typography variant={"body1"}>Transferred Profit:
                <Span sx={{ color: 'success.main', ml: 1 }}>${data?.transfered_roi}
                    <TrendingDown fontSize={"small"} sx={{ verticalAlign: 'middle', ml: 1 }} />
                </Span>
                <br></br>
                <br></br>
                {/* <Typography color={'red'} variant={"p"}>Your contract will expire, when you get 100% profit of your contract amount.</Typography> */}
            </Typography>
            <Typography variant='p' color={'red'}>You can transfer minimum 10% profit of your contract amount.</Typography>
            <br></br>
            <br></br>
            <Button onClick={() => handleClick(data?.id)} disabled={status} variant='contained'>Transfer To E-Wallet</Button>
            {/* <Typography variant='p' color={'red'}>You can transfer minimum 10% profit of your contract amount.</Typography> */}
        </JumboCardQuick>
    );
};

export default Orders;
