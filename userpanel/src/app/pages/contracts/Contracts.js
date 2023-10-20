import React, { useState, useEffect } from "react";
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import Box from "@mui/material/Box";
import { Button, CircularProgress, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { Form, Formik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import SweetAlert from "app/pages/components/mui/Alerts/SweetAlert";
import * as yup from "yup";
import JumboTextField from "@jumbo/components/JumboFormik/JumboTextField";
import Div from "@jumbo/shared/Div/Div";
import { transferROIAPi, getUserContractsApi } from "backendServices/ApiCalls";
import { useContext } from "react";
import { CustomProvider } from "app/layouts/vertical-default/VerticalDefault";
import { useNavigate } from "react-router-dom";
import Orders from "app/shared/metrics/Orders";
const validationSchema = yup.object({
  selectedpkg: yup.mixed("select a package").required("package is required"),
  password: yup.string("Enter your password").required("Password is required"),
});
const Contracts = () => {
  const navigate = useNavigate()
  const [contractData, setContractData] = React.useState([])
  const [isLoading, setisLoading] = useState(false);
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: "",
  });

  const getContractFun = () => {
    setisLoading(true)
    getUserContractsApi((response) => {
      setContractData(response?.data?.data)
      setisLoading(false)
    }, (error) => {
      console.log(error?.response?.data);
      setisLoading(false)
    })
  }

  const handleClick = (id) => {
    setisLoading(true)
    let params = {
      id: id
    }
    transferROIAPi(params, (response) => {

      if (response?.data?.status === "error") {
        setalertData({
          show: true,
          message: response?.data?.message,
          variant: "error"
        })
        setisLoading(false)
      } else if (response?.data?.status === "success") {
        setContractData(response?.data?.data)
        setalertData({
          show: true,
          message: response?.data?.message,
          variant: "success"
        })
        setisLoading(false)
      }
      else {
        setalertData({
          show: true,
          message: 'Something went wrong, please try again later',
          variant: "success"
        })
        setisLoading(false)
      }

    }, (error) => {
      setisLoading(false)
      console.log(error?.response?.data);
    })
  }


  useEffect(() => {
    getContractFun()
  }, []);



  if (isLoading) {
    return (
      <Div
        sx={{
          display: "flex",
          minWidth: 0,
          alignItems: "center",
          alignContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress sx={{ m: "-40px auto 0" }} />
      </Div>
    );
  }

  return (
    <Grid container spacing={2}>
      {alertData.show && (
        <SweetAlert alertData={alertData} setalertData={setalertData} />
      )}
      <Grid item xs={12} sm={12}>
        <Button variant="contained" onClick={() => navigate('/buy-contract')}>Buy Contract</Button>
      </Grid>
      {
        contractData?.map((data, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Orders handleClick={handleClick} data={data} />
          </Grid>
        ))
      }

    </Grid>
  );
};

export default Contracts;
