import React from 'react';
import {Typography} from "@mui/material";
import CardIconText from "@jumbo/shared/CardIconText";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";

const ObjectCountRevenue = ({vertical,value,title, icon,color}) => {
    const {t} = useTranslation();
    return (
        <CardIconText
            icon={icon}
            title={<Typography variant={"p"} color={color}>${value}</Typography>}
            subTitle={<Typography variant={"p"}
                                  color={"text.primary"}>{title}</Typography>}
            color={color}
            disableHoverEffect={true}
            hideArrow={true}
            variant={"outlined"}
        />
    );
};
/* Todo vertical prop define */
ObjectCountRevenue.propTypes = {
    vertical: PropTypes.bool,
};
export default ObjectCountRevenue;
