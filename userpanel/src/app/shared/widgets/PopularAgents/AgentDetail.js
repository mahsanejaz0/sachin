import React from 'react';
import { Avatar, Card, CardContent, Rating, Typography } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

const AgentDetail = ({ referraldetails, picturelink }) => {
    return (
        <Card sx={{ overflow: 'visible', mt: 4 }}>
            <CardContent>
                <Avatar
                    alt={referraldetails?.username}
                    picturelink
                    src={picturelink + referraldetails?.picture}
                    sx={{ boxShadow: 26, width: 60, height: 60, mb: 2, mt: '-54px' }}
                />
                <Typography variant={"h6"}>{referraldetails?.username}</Typography>
                <Stack direction={"row"} spacing={1} alignItems={'center'}>

                    {referraldetails.status === 'Approved' && <FiberManualRecordIcon style={{ color: '#0fb40f' }} />}
                    {referraldetails.status === 'Pending' && <FiberManualRecordIcon style={{ color: 'grey' }} />}
                    <Typography
                        component={'div'}
                        variant={'body1'}
                        color={'text.secondary'}
                        sx={{
                            display: 'flex',
                            fontSize: 12
                        }}
                    >
                        {referraldetails?.firstname + ' ' + referraldetails?.lastname}
                        <br></br>
                        {referraldetails?.email}
                        {/* <br></br>
                        {referraldetails?.phone} */}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};
/* Todo agent detail prop */
export default AgentDetail;
