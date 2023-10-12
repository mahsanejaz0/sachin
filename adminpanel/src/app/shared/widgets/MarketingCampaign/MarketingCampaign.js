import React from 'react';
import CampaignsList from "./CampaignsList";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import LatestPosts from "../LatestPosts";

const MarketingCampaign = ({scrollHeight,lasttransactionsdata}) => {
    
    const {t} = useTranslation();
    return (
        <JumboCardQuick
            title={'Recently Deposit'}
            // subheader={t('widgets.subheader.ltrns')}
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
