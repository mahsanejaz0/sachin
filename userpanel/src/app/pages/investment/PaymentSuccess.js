import React from "react";
import { Typography, Grid, TextField,IconButton, Tooltip, Alert, AlertTitle, Button } from "@mui/material";
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DoneIcon from '@mui/icons-material/Done';
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const PaymentSuccess = ({ paymentData, alertData, setalertData }) => {

    const nav = useNavigate();


  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">

      <Grid item sm={6}>
        <JumboDemoCard
          title={"Payment Detected"}
          wrapperSx={{ backgroundColor: "background.paper", pt: 0 }}
        >
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12} sx={{textAlign:'center'}}>
              <CheckCircleOutlineIcon sx={{ fontSize: '12rem' }} color="success" />
            </Grid>
            <Grid item xs={12} className="text-center">
            <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
                A Payment has been detected against this transaction. Soon it will be added to your account balance after required network confirmations.
            </Alert>
            </Grid>

            <Grid item xs={12} sx={{textAlign:'center'}}>
                <Button color="warning" onClick={()=>nav('/dashboard')} variant="contained">Dashboard</Button>
            </Grid>
            
          </Grid>
        </JumboDemoCard>
      </Grid>
    </Grid>
  );
};

export default PaymentSuccess;
