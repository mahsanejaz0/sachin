import React, { useState, useEffect } from 'react';
import {Grid} from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails, Typography  } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@mui/styles';
import { faqdata, postRequest } from 'backendServices/ApiCalls';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';


const useStyles = makeStyles((theme) => ({
  newsContainer: {
    marginBottom: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

const News = () => {
  const classes = useStyles();
  const [news,setNews] = useState([]);
  const News =()=>{
    postRequest('/news', '',(response) => {
        setNews(response?.data?.news)
    }, (error) => {
        console.log(error?.response?.data);
    })
}
useEffect(()=>{
  News();
},[])

    return (
      <Grid container spacing={2}  alignItems="center" justifyContent="center" >
      <Grid item sm={8} >
      <JumboDemoCard  title={"News From Admin"}
                       wrapperSx={{backgroundColor: 'background.paper', pt: 0}}>
      <div>
        {news.map((news)=>(
          <div className={classes.newsContainer}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{news.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                {news.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
</div>
        ))}
     
     

      
    </div>
    </JumboDemoCard>
      </Grid>
      </Grid>
    );
};

export default News;








