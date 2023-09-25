import React, { useContext } from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import {List, ListItem, ListItemIcon, ListItemText, Typography} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Link from "@mui/material/Link";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';

const Contacts = () => {
    const {loginUserData,setloginUserData} = useContext(CustomProvider);
    let userData = loginUserData

    return (
        <JumboCardQuick title={"Contact"} noWrapper sx={{ mt: { xs: 2 }, // for all sides
          }}>
            <List disablePadding sx={{mb: 2}}>
                <ListItem alignItems="flex-start" sx={{p: theme => theme.spacing(.5, 3)}}>
                    <ListItemIcon sx={{minWidth: 36, color: 'text.secondary'}}>
                        <EmailOutlinedIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary={<Typography variant="body1" color="text.secondary">Email</Typography>}
                        secondary={<Link variant="body1" href={'mailto:'+userData.email} underline="none">{userData.email}</Link>}
                    />
                </ListItem>

                <ListItem alignItems="flex-start" sx={{p: theme => theme.spacing(.5, 3)}}>
                    <ListItemIcon sx={{minWidth: 36, color: 'text.secondary'}}>
                        <LocalPhoneOutlinedIcon/>
                    </ListItemIcon>
                    <ListItemText

                        primary={<Typography variant="body1" color="text.secondary">Phone</Typography>}
                        secondary={<Typography variant="body1" color="text.primary">{userData.mobile}</Typography>}
                    />
                </ListItem>
            </List>
        </JumboCardQuick>
    );
};

export default Contacts;
