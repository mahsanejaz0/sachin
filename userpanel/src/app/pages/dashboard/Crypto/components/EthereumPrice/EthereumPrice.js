import React from 'react'
import Typography from "@mui/material/Typography";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import {useTranslation} from "react-i18next";
import {TrendingDown} from "@mui/icons-material";
import ChartNewVisitors from "./ChartNewVisitors";
import { useContext } from 'react';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';

const EthereumPrice = () => {
    const {t} = useTranslation();
    const {loginUserData} = useContext(CustomProvider);

    return (
        <JumboCardQuick
            noWrapper
            title={<Typography variant={"h2"} color={"common.white"}>${loginUserData.totalLevelBonus}</Typography>}
            subheader={
                <Typography
                    variant={"h6"}
                    color={"common.white"}
                    mb={0}
                >{t('widgets.subheader.levelbonus')}</Typography>
            }
            // action={
            //     <Typography variant={"body1"}>
            //         -3.6% <TrendingDown sx={{verticalAlign: 'middle', fontSize: '1rem', ml: .5}}/>
            //     </Typography>
            // }
            bgColor={"#E73145"}
            sx={{color: "common.white"}}
            headerSx={{pb: 0}}
        >
            <ChartNewVisitors/>
        </JumboCardQuick>
    );
};

export default EthereumPrice;
