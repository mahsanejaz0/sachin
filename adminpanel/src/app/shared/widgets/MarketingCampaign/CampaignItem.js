import React from 'react';
import {ListItemText, Typography} from "@mui/material";
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ListItemButton from "@mui/material/ListItemButton";

const CampaignItem = ({item}) => {
    return (
        <ListItemButton component={"li"} sx={{p: theme => theme.spacing(1, 3)}}>
            {/* <ListItemAvatar>
                <Avatar alt={item?.name} sx={{color: 'common.white', bgcolor: `${item?.bgcolor}`}}>
                    {item?.icon}
                </Avatar>
            </ListItemAvatar> */}
            <ListItemText sx={{
                flexBasis: '30%'
            }} primary={<Typography variant='h5' mb={.5}>{item?.type.charAt(0).toUpperCase() + item?.type.slice(1)}</Typography>}
                          secondary={item?.details}
            />
            <ListItemText primary={<Typography variant="body1" sx={{fontSize: 13}}>${item?.amount}</Typography>}
                          secondary={"Spent"}
            />
            <ListItemText sx={{alignSelf: 'self-start', flexGrow: 0}}>
                {item?.type==='roi' || item?.type==='referralbonus' || item?.type==='unilevelbonus' || item?.type==='' || item?.type==='roi'  ?
                    <TrendingUpIcon color='success' sx={{ml: 1, verticalAlign: 'middle'}} fontSize={"small"}/> :
                    <TrendingDownIcon color='error' sx={{ml: 1, verticalAlign: 'middle'}} fontSize={"small"}/>
                }
            </ListItemText>
        </ListItemButton>
    );
};
/* Todo item prop define */

export default CampaignItem;
