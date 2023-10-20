import React from 'react';
import { ListItemText, Typography } from "@mui/material";
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ListItemButton from "@mui/material/ListItemButton";

const CampaignItem = ({ item }) => {
    return (
        <ListItemButton component={"li"} sx={{ p: theme => theme.spacing(1, 3) }}>
            {/* <ListItemAvatar>
                <Avatar alt={item?.name} sx={{color: 'common.white', bgcolor: `${item?.bgcolor}`}}>
                    {item?.icon}
                </Avatar>
            </ListItemAvatar> */}
            <ListItemText primary={<Typography variant='h5' mb={.5}>{item?.senderusername}</Typography>}
                secondary={'Deposit'}
            />
            <ListItemText primary={<Typography variant="body1" sx={{ fontSize: 13 }}>{item?.amount}</Typography>}
                secondary={"Amount"}
            />
            <ListItemText primary={<Typography variant="body1" sx={{ fontSize: 13 }}>{item?.coin}</Typography>}
                secondary={"Coin"}
            />
            <ListItemText primary={<Typography variant="body1" sx={{ fontSize: 13 }}>{item?.dat}</Typography>}
                secondary={"Created At"}
            />
            <ListItemText sx={{ alignSelf: 'self-start', flexGrow: 0 }}>
                <TrendingDownIcon color='error' sx={{ ml: 1, verticalAlign: 'middle' }} fontSize={"small"} />
            </ListItemText>
        </ListItemButton>
    );
};
/* Todo item prop define */

export default CampaignItem;
