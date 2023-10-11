import React from 'react';
import {Typography} from "@mui/material";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import {useTranslation} from "react-i18next";
import {TrendingUp} from "@mui/icons-material";
import ChartLastMonthSales from "./ChartLastMonthSales";
import { useContext } from 'react';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';

const BitcoinPrice = () => {
    const {t} = useTranslation();
    const {loginUserData} = useContext(CustomProvider);

    return (
        <JumboCardQuick
            noWrapper
            title={<Typography variant={"h2"} color={"common.white"}>${loginUserData.current_balance}</Typography>}
            subheader={
                <Typography
                    variant={"h6"}
                    color={"common.white"}
                    mb={0}
                >{t("widgets.subheader.walletbalance")}</Typography>
            }
            // action={
            //     <Typography
            //         variant={"body1"}>
            //         23% <TrendingUp sx={{verticalAlign: 'middle', fontSize: '1rem', ml: .5}}/>
            //     </Typography>
            // }
            sx={{color: "common.white"}}
            bgColor={"#6f42c1"}
            headerSx={{pb: 0}}
        >
            {/* <ChartLastMonthSales/> */}
        </JumboCardQuick>
    );
};

export default BitcoinPrice;
