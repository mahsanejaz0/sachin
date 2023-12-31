import React from 'react';
import {Avatar, Chip, ListItemAvatar, ListItemIcon, ListItemText, Typography} from "@mui/material";
import JumboDdMenu from "@jumbo/components/JumboDdMenu";
import ListItemButton from "@mui/material/ListItemButton";

const bgColors = ['primary', 'secondary', 'warning','info'];
const AuthorItem = ({author,picturelink,key}) => {
    return (
        <ListItemButton component={"li"} key={key} sx={{p: theme => theme.spacing(1, 3), borderBottom: 1, borderBottomColor: 'divider'}}>
            <ListItemAvatar sx={{minWidth: 64}}>
                <Avatar alt={author.username} src={picturelink+author.picture} sx={{width: '52px', height: '52px'}}/>
            </ListItemAvatar>
            <ListItemText
                primary={<Typography variant='h5' mb={.5}>{author.username}</Typography>}
                secondary={author.firstname + " " + author.lastname}
            />
            <ListItemText sx={{flexGrow: 0}}>
                <Chip label={`${author.createdat}`} color={bgColors[Math.floor(Math.random() * 4)]} size={'small'}/>
            </ListItemText>
            {/* <ListItemIcon sx={{minWidth: 32, ml: 2}}>
                <JumboDdMenu
                    menuItems={[
                        {title: 'View Profile', slug: 'view-profile'},
                    ]}
                />
            </ListItemIcon> */}
        </ListItemButton>
    );
};
/* Todo author prop define */
export default AuthorItem;
