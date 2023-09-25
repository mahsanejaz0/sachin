import React from 'react';
import CardHeader from "@mui/material/CardHeader";
import {Card, CardActions, CardContent, LinearProgress, Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {useTranslation} from "react-i18next";
import { Link } from 'react-router-dom';

const PortfolioBalance = (props) => {
    const {t} = useTranslation();
    const date = new Date(); //Get the day of the week of particular date mentioned by the user
    var day = date.getDay();
    var day1 = date.getDate();
    day = ((day/7)*100);
    day1 = ((day1/30)*100);
    const dayp = day+'%';
    const day1p = day1+'%';
    return (
        <Card>
            <CardHeader title={t('widgets.title.roistats')}/>
            <CardContent sx={{pt: 2}}>
                <Stack direction={"row"} spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant={"h2"}>{props.totalroi}  
                        </Typography>
                        <Typography variant={"body1"} sx={{mb: 3}}>Overall ROI</Typography>
                        <Stack direction={"row"} spacing={1}>
                            <Button variant={"contained"} color={"secondary"}  component={Link} to={'/investment'}>Invest Now</Button>
                            <Button variant={"contained"} color={"inherit"} disableElevation component={Link} to={'/roi-summary'}>Summary</Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant={"h5"} color={"text.secondary"} mb={2}>Time Period</Typography>
                        <Typography variant={"h6"} color={"text.primary"}>This week
                            <Typography sx={{borderLeft: 1, ml: 1, pl: 1}} component={"span"}
                                        color={"text.secondary"}>${props.weeklyroi}</Typography>
                        </Typography>
                        <LinearProgress variant={"determinate"} color={"success"} value={day}
                                        sx={{
                                            width: {dayp},
                                            borderRadius: 4,
                                            height: 5,
                                            mb: 2,
                                            backgroundColor: '#E9EEEF'
                                        }}
                        />
                        <Typography variant={"h6"} color={"text.primary"}>This Month 
                            <Typography sx={{borderLeft: 1, ml: 1, pl: 1}} component={"span"}
                                        color={"text.secondary"}>${props.monthlyroi}</Typography>
                        </Typography>
                        <LinearProgress variant={"determinate"} color={"warning"} value={day1}
                                        sx={{
                                            width:  {day1p},
                                            borderRadius: 4,
                                            height: 5,
                                            backgroundColor: '#E9EEEF'
                                        }}
                        />
                    </Grid>
                </Stack>
            </CardContent>
            <CardActions sx={{pt: .5, pb: 2}}>
                <Button startIcon={<AddIcon/>} size="small">View Report</Button>
            </CardActions>
        </Card>
    );
};

export default PortfolioBalance;
