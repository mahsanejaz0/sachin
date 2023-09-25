import React from 'react';
import AgentDetail from "./AgentDetail";
import {Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {useTranslation} from "react-i18next";


const PopularAgents = ({picturelink,data}) => {
    
    const {t} = useTranslation();
    return (
        <React.Fragment>
            <Typography variant={"h4"} sx={{mb: 2}}>{t("widgets.title.referralUsers")}</Typography>
            <Grid container spacing={3.75}>
                {
                    data?.map((agent, index) => (
                        <Grid item xs={12} sm={6} lg={3} key={index}>
                            <AgentDetail picturelink={picturelink} referraldetails={data[index]}/>
                        </Grid>
                    ))
                }
            </Grid>
        </React.Fragment>
    );
};
export default PopularAgents;
