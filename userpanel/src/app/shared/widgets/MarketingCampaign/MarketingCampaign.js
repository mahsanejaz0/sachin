import React from 'react';
import CampaignsList from "./CampaignsList";
import {menuItems} from "./data";
import {Button, Chip} from "@mui/material";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import JumboDdMenu from "@jumbo/components/JumboDdMenu";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import LatestPosts from "../LatestPosts";
import { Link } from 'react-router-dom';

const MarketingCampaign = ({scrollHeight,lasttransactionsdata}) => {
    
    const {t} = useTranslation();
    return (
        <JumboCardQuick
            title={t('widgets.title.ltrns')}
            subheader={t('widgets.subheader.ltrns')}
            // action={
            //     <React.Fragment>
            //         <Button variant={"contained"} color={"secondary"}  size="small" component={Link} to={'/transaction-summary'}>All Transactions</Button>
            //     </React.Fragment>
            // }
            wrapperSx={{p: 0}}
        >
            <JumboScrollbar
                autoHeight
                autoHide
                autoHideDuration={200}
                autoHideTimeout={500}
                autoHeightMin={scrollHeight ? scrollHeight : 356}
            >
                <CampaignsList lasttransactionsdata={lasttransactionsdata}/>
            </JumboScrollbar>
        </JumboCardQuick>
    );
};
/* Todo scrollHeight prop define :- */
LatestPosts.propTypes = {
    scrollHeight: PropTypes.number
};
export default MarketingCampaign;
