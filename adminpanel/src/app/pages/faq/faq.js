import React, { useState, useEffect } from 'react';
import {Grid} from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails, Typography  } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@mui/styles';
import { faqdata } from 'backendServices/ApiCalls';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';

const useStyles = makeStyles((theme) => ({
  faqContainer: {
    marginBottom: theme.spacing(0.5),
    backgroundColor: '#fff',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

const Faq = () => {
  const classes = useStyles();
  const [faq,setFaq] = useState([]);
  const Faq =()=>{
    faqdata((response) => {
        setFaq(response?.data?.data?.entries)
    }, (error) => {
        console.log(error?.response?.data);
    })
}
console.log("faq",faq)
useEffect(()=>{
  Faq();
},[])

    return (
      <Grid container spacing={2}  alignItems="center" justifyContent="center" >
      <Grid item sm={8} >
      <JumboDemoCard  title={"Frequently Asked Questions"}
                       wrapperSx={{backgroundColor: 'background.paper', pt: 0}}>
      <div>
        {faq.map((faq)=>(
          <div className={classes.faqContainer}>
 <Accordion>
   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
     <Typography variant="h6">{faq.question}</Typography>
   </AccordionSummary>
   <AccordionDetails>
     <Typography>
     {faq.answer}
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

export default Faq;








