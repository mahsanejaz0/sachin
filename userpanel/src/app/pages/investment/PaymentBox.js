import React from "react";
import { Typography, Grid, TextField,IconButton, Tooltip, Alert, AlertTitle, Button } from "@mui/material";
import SweetAlert from "app/pages/components/mui/Alerts/SweetAlert";
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DoneIcon from '@mui/icons-material/Done';
import { useState } from "react";
import { useEffect } from "react";
import { postRequest } from "backendServices/ApiCalls";
import { useNavigate } from "react-router-dom";
import PaymentSuccess from "./PaymentSuccess";

const PaymentBox = ({ paymentData, alertData, setalertData,setShowPaymentBox }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [paymentDetected, setPaymentDetected] = useState(false)
  const [time, setTime] = useState(3599); // 30 minutes in seconds
      // Function to be called every 30 seconds
    const nav = useNavigate();

  // const checkPaymentStatus = () => {
  //   let params = {
  //       txid:paymentData.txn_id
  //   }
  //   postRequest('/gettransactiondetails',
  //       params,
  //       (response) => {
  //         if (response?.data?.status === "success") {
  //           if(response?.data?.data?.recv_confirms > 0)
  //           {
  //             setPaymentDetected(true)
  //               setalertData({
  //                   show: true,
  //                   message: 'Payment detected successfully on network. It will be automatically deposit to your account after required network confirmations',
  //                   variant: "success",
  //                 });
  //           }
  //         }
  //       },
  //       (error) => {
  //         console.log(error?.response?.data);
  //       }
  //     );
    
  //     };

  useEffect(() => {
    const interval = setInterval(() => {
      if (time > 0) {
        setTime(time - 1);
      }else{
        setalertData({
          show: true,
          message: 'Transaction is expired. Create a new by filling form. Dont worry if you already sent the payment to the current address our system will automatically detect the payment and deposit into your account',
          variant: "warning",
        });
        setShowPaymentBox(false)
      }
    }, 1000); // Update the timer every 1 second

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  // useEffect(() => {
  //   // Set up an interval to call the function every 30 seconds
  //   const functionInterval = setInterval(checkPaymentStatus, 10000); 
  
  //   return () => {
  //     clearInterval(functionInterval);
  //   };
  // }, []);

  // const minutes = Math.floor(time / 60).toString().padStart(2, "0");
  // const seconds = (time % 60).toString().padStart(2, "0");

  const handleCopyClick = () => {
    // Create a temporary input element to copy the address
    const tempInput = document.createElement("input");
    tempInput.value = paymentData.address;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    // Show the checked icon when the address is copied
    setIsCopied(true);

    // Reset the checked icon after a short delay (e.g., 2 seconds)
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    paymentDetected ? (<PaymentSuccess />) : (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      {alertData.show && (
        <SweetAlert alertData={alertData} setalertData={setalertData} />
      )}
      <Grid item sm={6}>
        <JumboDemoCard
          title={"Deposit"}
          wrapperSx={{ backgroundColor: "background.paper", pt: 0 }}
        >
          <Grid container justifyContent="center">
            <Grid item xs={12}>

              <Typography variant="h3" color={'warning'}>
                Please send the amount to the following address and it will be automatically added to your account after the required network confirmations
              </Typography>
            </Grid>
            <Grid item xs={12} className="text-center">
              {/* <Typography variant="body1" className="amount-card-text">
                AMOUNT: {Math.round(paymentData.amount)}{" "}
                <span className="amount-card-small">USDT.TRC20</span>
              </Typography>
              <Typography
                variant="body1"
                sx={{ textAlign: "center" }}
                mt={2}
                className="order_cancel"
                style={{ color: "#f00", border: "1px solid" }}
              >
                 {`${minutes}:${seconds}`}
              </Typography> */}
              <TextField
                label={'Payment Address'}
                value={paymentData.address}
                sx={{ marginTop: "16px" }}
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Tooltip
                      title={isCopied ? "Copied!" : "Copy Address"}
                      arrow
                    >
                      <IconButton onClick={handleCopyClick}>
                        {isCopied ? <DoneIcon color="success" /> : <FileCopyIcon color="warning" />}
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} mt={2} className="p-4 bg-white border-radius-qr">
              <Grid
                item
                className="p-3 border-purple"
                sx={{ textAlign: "center" }}
              >
                <img src={`https://chart.googleapis.com/chart?cht=qr&chl=${paymentData.address}&chs=160x160&chld=L|0`} alt="QR Code" style={{width:'50%'}} />
              </Grid>
              <Typography variant="body1" sx={{textAlign:'center', marginTop:'16px', marginBottom:'16px'}} className="scan_qr text-center">
                Scan QR Code with the user's mobile device
              </Typography>
            </Grid>
            <Grid item xs={12} className="py-3 px-4 bg-dark amount-card">
              <Typography
                variant="body1"
                className="amount-card-small text-center"
                id="pay_invoice2"
              >
<Alert severity="warning">
  <AlertTitle>Warning</AlertTitle>
  Please send the amount on correct network. Otherwise system will be unable to track the payment
</Alert>
                
              </Typography>
            </Grid>
          </Grid>
        </JumboDemoCard>
      </Grid>
    </Grid>
    )
  );
};

export default PaymentBox;
