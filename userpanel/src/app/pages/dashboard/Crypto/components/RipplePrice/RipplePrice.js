import React, { useContext } from 'react';
import Typography from "@mui/material/Typography";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import {useTranslation} from "react-i18next";
import {TrendingUp} from "@mui/icons-material";
import OnlineSignupChartFilled from "./OnlineSignupChartFilled";
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';

const RipplePrice = () => {
    const {t} = useTranslation();
    const {loginUserData} = useContext(CustomProvider);
    return (
        <JumboCardQuick
            title={<Typography variant={"h3"} color={"common.white"}>${loginUserData.totalRefBonus}</Typography>}
            subheader={
                <Typography
                    variant={"h6"}
                    color={"common.white"}
                    mb={0}
                >{t('widgets.subheader.referralbonus')}</Typography>
            }
            // action={
            //     <Typography
            //         variant={"body1"}
            //     >
            //         6% <TrendingUp sx={{verticalAlign: 'middle', fontSize: '1rem', ml: .5}}/>
            //     </Typography>
            // }
            sx={{color: "common.white"}}
            bgColor={"#E44A77"}
            wrapperSx={{pt: 0}}
        >
            <OnlineSignupChartFilled color={"#fff"} shadowColor={"#000000"}/>
        </JumboCardQuick>
    );
};

export default RipplePrice;
