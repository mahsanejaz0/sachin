import React from 'react';
import {notificationIcons} from "./notificationIcons";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import {Link, Typography} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import Span from "@jumbo/shared/Span";
import {getDateElements} from "@jumbo/utils";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
const NotificationBirthday = ({item}) => {
    return (
        <ListItemButton component={"li"} alignItems={"flex-start"}>
            {item.type === "empty" ? "" : (
            <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'lightgreen' }}>
                <CurrencyExchangeIcon sx={{ color: 'black' }} />
            </Avatar>
            </ListItemAvatar>
            )}

            <ListItemText>
                {item.details}
                <Typography component="span" sx={{
                    display: 'flex',
                    fontSize: '90%',
                    mt: .5,
                }}>
                    {
                        item.type === "empty" ? "" :
                        item.type === 'investment' || item.type === 'payout' ? (<ArrowOutwardIcon fontSize="small" sx={{ color: 'red' }} />)
                        :
                        (<ArrowDownwardIcon fontSize="small" sx={{ color: 'green' }} />)
                    }
                    {
                        item.type === "empty" ? "" : (
                            <Span sx={{color: 'text.secondary', ml: 1}}>{getDateElements(item.date).time}</Span>
                        )
                    }
                </Typography>
            </ListItemText>
        </ListItemButton>
    )
};

export default NotificationBirthday;
