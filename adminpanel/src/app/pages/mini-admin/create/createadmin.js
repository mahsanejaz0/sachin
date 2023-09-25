import React, { useState, useEffect } from 'react';
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import Box from "@mui/material/Box";
import { Checkbox, Grid, ListItemText, OutlinedInput, Select, TextField } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Form, Formik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import Div from '@jumbo/shared/Div/Div';
import { createadmin } from 'backendServices/ApiCalls';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { getusers } from 'backendServices/ApiCalls';
import { routesForAuthenticatedOnly } from '../../../routes'
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



const CreateAdmin = () => {


  const filteredRoutes = routesForAuthenticatedOnly.filter(route => route.path !== '/logout' && route.path !== '/404');
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: ""
  })
  const [routenames, setRoutenames] = React.useState(['/logout', '/404']);
  const [userid, setUserid] = React.useState('');
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setRoutenames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const [usersdata, setUsersData] = useState([])
  let params = {
    status: 'all',
  }
  const UsersData = () => {
    getusers(params, (response) => {
      if (response?.data?.status === "success") {
        setUsersData(response?.data?.userdata)
      }
    }, (error) => {
      console.log(error?.response?.data);
    })
  }


  useEffect(() => {
    UsersData();
  }, [])


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userid) {
      setalertData({
        show: true,
        message: 'User id is required',
        variant: "warning"
      })
    } else if (routenames.length < 1) {
      setalertData({
        show: true,
        message: 'User roles are required',
        variant: "warning"
      })

    }
    else {
      const routesJSONString = JSON.stringify(routenames);
      let params = {
        userid: userid,
        allowedroutes: routesJSONString
      }

      createadmin(params, (response) => {

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
          setRoutenames([['/logout', '/404']]);



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
        <JumboDemoCard title={"create Admin"}
          wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}>
          <Formik>
            {({ isSubmitting }) => (
              <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'
                onSubmit={handleSubmit}>

                <Box

                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    '& .MuiTextField-root': { width: '44ch' },
                  }}
                  alignItems="center"
                >



                  <Div sx={{ mt: 3, maxwidth: 100 }}>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="demo-simple-select-label">Select User</InputLabel>
                      <Select
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={userid}
                        label="Select User"
                        onChange={(e) => {
                          setUserid(e.target.value)
                        }}
                        name='userid'
                      >
                        {/* {
            usersdata.map((data)=>(
              <MenuItem value={data.userid}>{data.firstname+' '+ data.lastname+'('+data.username +')'}</MenuItem>
            ))
          } */}


                        {
                          usersdata && usersdata?.length > 0 ? (
                            usersdata.map((data) => (
                              <MenuItem key={data.id} value={data.id}>
                                {data.firstname + ' ' + data.lastname + '(' + data.username + ')'}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value={''}>Loading...</MenuItem>
                          )
                        }


                      </Select>
                    </FormControl>
                  </Div>
                  <Div sx={{ mt: 3, maxwidth: 100 }}>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="demo-simple-select-label">Select Roles</InputLabel>
                      <Select

                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={routenames}
                        onChange={handleChange}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {filteredRoutes.map((routes) => (
                          <MenuItem key={routes.path} value={routes.path}>
                            <Checkbox checked={routenames.indexOf(routes.path) > -1} />
                            <ListItemText primary={routes.path} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Div>











                  <LoadingButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mb: 3 }}
                    loading={isSubmitting}
                  >Submit</LoadingButton>
                </Box>
              </Form>
            )}
          </Formik>
        </JumboDemoCard>
      </Grid>
    </Grid>
  );
};

export default CreateAdmin;








