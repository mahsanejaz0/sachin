import React, { useState, useEffect } from 'react';
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import Box from "@mui/material/Box";
import { Grid, Select } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Form, Formik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import Div from '@jumbo/shared/Div/Div';
import { updatesponsor } from 'backendServices/ApiCalls';
import { getusers } from 'backendServices/ApiCalls';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



const UpdateSponsor = () => {
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: ""
  })
  const [userid, setUserid] = React.useState('');
  const [sponsorid, setSponsorId] = React.useState('');
  const [usersdata, setUsersData] = useState([])
  const [approvedusersdata, setApprovedUsersData] = useState([])
  let params = {
    status: 'pending',
  }
  const UsersData = () => {
    getusers(params, (response) => {
      if (response?.data?.status === "success") {
        setUsersData(response?.data?.data?.entries)
      }
    }, (error) => {
      console.log(error?.response?.data);
    })
  }

  let params1 = {
    status: 'approved',
  }
  const ApprovedUsers = () => {
    getusers(params1, (response) => {
      if (response?.data?.status === "success") {
        setApprovedUsersData(response?.data?.data?.entries)
      }
    }, (error) => {
      console.log(error?.response?.data);
    })
  }


  useEffect(() => {
    UsersData();
    ApprovedUsers();
  }, [])


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userid) {
      setalertData({
        show: true,
        message: 'Username is required',
        variant: "warning"
      })
    }
    else if (!sponsorid) {
      setalertData({
        show: true,
        message: 'Sponsorname is required',
        variant: "warning"
      })
    } else {
      let params = {
        userid,
        sponsorid,
      }
      updatesponsor(params, (response) => {

        if (response?.data?.status === "error") {
          setalertData({
            show: true,
            message: response?.data?.message,
            variant: "error"
          })
        } else if (response?.data?.status === "success") {

          setalertData({
            show: true,
            message: response?.data?.message,
            variant: "success"
          })
          setUserid('');
          setSponsorId('');
        }

      }, (error) => {
        console.log(error?.response?.data);
      })
    }
  }


  return (
    <Grid container spacing={2} p={2} alignItems="center" justifyContent="center" >
      {
        alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
      }

      <Grid item sm={8}  >
        <JumboDemoCard title={"Update Sponsor"}
          wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}>
          <Formik>
            {({ isSubmitting }) => (
              <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'
                onSubmit={handleSubmit}>

                <Box

                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  alignItems="center"
                >

                  <Div sx={{ mt: 3, maxWidth: 300 }}>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <Autocomplete
                        required
                        id="demo-simple-select"
                        options={usersdata}
                        getOptionLabel={(data) => data.firstname + ' ' + data.lastname + '(' + data.username + ')'}
                        onChange={(e, value) => {
                          if (value) {
                            setUserid(value.userid);
                          } else {
                            setUserid(''); // Clear the selected value if nothing is chosen
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select User"
                          />
                        )}
                      />
                    </FormControl>
                  </Div>

                  <Div sx={{ mt: 3, maxWidth: 300 }}>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <Autocomplete
                        required
                        id="demo-simple-select"
                        options={approvedusersdata}
                        getOptionLabel={(data) => data.firstname + ' ' + data.lastname + '(' + data.username + ')'}
                        onChange={(e, value) => {
                          if (value) {
                            setSponsorId(value.userid);
                          } else {
                            setSponsorId(''); // Clear the selected value if nothing is chosen
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Sponsor"
                          />
                        )}
                      />
                    </FormControl>
                  </Div>


                  <Div sx={{ mt: 3, maxWidth: 300 }}>
                    <LoadingButton
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ mb: 3 }}
                      loading={isSubmitting}
                    >Update</LoadingButton>
                  </Div>
                </Box>
              </Form>
            )}
          </Formik>
        </JumboDemoCard>
      </Grid>
    </Grid>
  );
};

export default UpdateSponsor;