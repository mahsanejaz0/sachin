import React from 'react';
import ReferralList from "./ReferralList";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import {useTranslation} from "react-i18next";

const ReferralUsers = ({scrollHeight,referralusersdata,picturelink}) => {

    const {t} = useTranslation();
    return (
        <JumboCardQuick
            title={t("widgets.title.referralUsers")}
            subheader={t("widgets.subheader.referralUsers")}
            wrapperSx={{p: 0}}
            headerSx={{borderBottom: 1, borderBottomColor: 'divider'}}
        >
            <JumboScrollbar
                autoHeight
                autoHeightMin={scrollHeight ? scrollHeight : 366}
                autoHide
                autoHideDuration={200}
                autoHideTimeout={500}
            >
                <ReferralList picturelink={picturelink} referralusersdata={referralusersdata}/>
            </JumboScrollbar>
        </JumboCardQuick>
    );
};

export default ReferralUsers
;
