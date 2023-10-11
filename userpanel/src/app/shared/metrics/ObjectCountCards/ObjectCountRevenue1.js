import React from 'react';
import { Button, Typography } from "@mui/material";
import CardIconText from "@jumbo/shared/CardIconText";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

const ObjectCountRevenue1 = ({ vertical, value, title, icon, color }) => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const handleClick = () => {
        navigate('/buy-contract')
    }
    return (
        <CardIconText
            icon={icon}
            title={<Button onClick={handleClick} variant='contained'>Buy Contract</Button>}
            color={color}
            disableHoverEffect={true}
            hideArrow={true}
            variant={"outlined"}
        >
        </CardIconText>
    );
};
/* Todo vertical prop define */
ObjectCountRevenue1.propTypes = {
    vertical: PropTypes.bool,
};
export default ObjectCountRevenue1;
