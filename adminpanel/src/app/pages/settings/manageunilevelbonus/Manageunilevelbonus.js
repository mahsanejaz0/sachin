import React, { useEffect } from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { Box, CircularProgress, Grid, List } from "@mui/material";
import { useState } from 'react';
import { getsettingsdata, updatesettingdata } from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import { Form, Formik } from "formik";
import Div from '@jumbo/shared/Div/Div';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { LoadingButton } from '@mui/lab';

const validationSchema = yup.object({
  unilevel_bonus_level1: yup
    .string()
    .required('Unilevel Bonus Level1 is required'),
  unilevel_bonus_level2: yup
    .string()
    .required('Unilevel Bonus Level2 is required'),
  unilevel_bonus_level3: yup
    .string()
    .required("Unilevel Bonus Level3 is required"),
  unilevel_bonus_level4: yup
    .string()
    .required("Unilevel Bonus Level4 is required"),
  unilevel_bonus_level5: yup
    .string()
    .required("Unilevel Bonus Leve5 is required"),
  unilevel_bonus_level6: yup
    .string()
    .required("Unilevel Bonus Leve6 is required"),
  unilevel_bonus_level7: yup
    .string()
    .required("Unilevel Bonus Leve7 is required"),
  unilevel_bonus_level8: yup
    .string()
    .required("Unilevel Bonus Leve8 is required"),
  unilevel_bonus_level9: yup
    .string()
    .required("Unilevel Bonus Leve9 is required"),
  unilevel_bonus_level10: yup
    .string()
    .required("Unilevel Bonus Leve10 is required"),
});

const Manageunilevelbonus = () => {
  const [unilevelbonusdata, setUnilevelBonusData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: ""
  })

  const fetchunilevelbonusdata = () => {
    const params = {
      keynames: "'unilevel_bonus_level1', 'unilevel_bonus_level2', 'unilevel_bonus_level3', 'unilevel_bonus_level4', 'unilevel_bonus_level5', 'unilevel_bonus_level6', 'unilevel_bonus_level7', 'unilevel_bonus_level8', 'unilevel_bonus_level9', 'unilevel_bonus_level10'"
    };
    getsettingsdata(params, (response) => {
      console.log("response?.data?.data?.values", response?.data?.data?.values)
      setUnilevelBonusData(response?.data?.data?.values);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });
  };


  useEffect(() => {
    fetchunilevelbonusdata();
  }, []);

  const handleSubmit = (data, setSubmitting) => {
    const newData = {
      obj: {
        unilevel_bonus_level1: data.unilevel_bonus_level1,
        unilevel_bonus_level2: data.unilevel_bonus_level2,
        unilevel_bonus_level3: data.unilevel_bonus_level4,
        unilevel_bonus_level5: data.unilevel_bonus_level5,
        unilevel_bonus_level6: data.unilevel_bonus_level6,
        unilevel_bonus_level7: data.unilevel_bonus_level7,
        unilevel_bonus_level8: data.unilevel_bonus_level8,
        unilevel_bonus_level9: data.unilevel_bonus_level9,
        unilevel_bonus_level10: data.unilevel_bonus_level10,
      }
    };
    updatesettingdata(newData, (response) => {
      console.log("updatesetting", response);

      if (response?.data?.status === "error") {
        setalertData({
          show: true,
          message: response?.data?.message,
          variant: "error"
        })
        setSubmitting(false)

      } else if (response?.data?.status === "success") {
        setalertData({
          show: true,
          message: response?.data?.message,
          variant: "success"
        })
        setSubmitting(false);
      }
    }, (error) => {
      console.log(error?.response?.data);
    })
  };

  return (
    <Grid container fullWidth sm={12} xs={12} p={2} alignItems="center" justifyContent="center">
      <Grid item sm={6} xs={12}>
        <JumboCardQuick title={"Manage Unilevel Bonus"} noWrapper>
          {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
          }
          {isLoading ? (
            <Div
              sx={{
                mt: "20%",
                ml: "45%",
                mb: "20%"
              }}
            >
              <CircularProgress />
            </Div>
          ) : (
            <List disablePadding sx={{ mb: 2 }}>
              <Formik
                validateOnChange={true}
                initialValues={{
                  unilevel_bonus_level1: unilevelbonusdata[0].keyvalue,
                  unilevel_bonus_level2: unilevelbonusdata[1].keyvalue,
                  unilevel_bonus_level3: unilevelbonusdata[2].keyvalue,
                  unilevel_bonus_level4: unilevelbonusdata[3].keyvalue,
                  unilevel_bonus_level5: unilevelbonusdata[4].keyvalue,
                  unilevel_bonus_level6: unilevelbonusdata[5].keyvalue,
                  unilevel_bonus_level7: unilevelbonusdata[6].keyvalue,
                  unilevel_bonus_level8: unilevelbonusdata[7].keyvalue,
                  unilevel_bonus_level9: unilevelbonusdata[8].keyvalue,
                  unilevel_bonus_level10: unilevelbonusdata[9].keyvalue,
                }
                }
                validationSchema={validationSchema}
                onSubmit={(data, { setSubmitting }) => {
                  console.log("formikformdata", data)
                  setSubmitting(true);
                  handleSubmit(data, setSubmitting);
                }}
              >
                {({ isSubmitting }) => (
                  <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>
                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level1"
                            label="Unilevel Bonus Level1"
                            type="text"
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level2"
                            label="Unilevel Bonus Level2"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level3"
                            label="Unilevel Bonus Level3"
                            type="text"
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level4"
                            label="Unilevel Bonus Level4"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level5"
                            label="Unilevel Bonus Level5"
                            type="text"
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level6"
                            label="Unilevel Bonus Level6"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level7"
                            label="Unilevel Bonus Level7"
                            type="text"
                          />
                        </Grid>


                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level8"
                            label="Unilevel Bonus Level8"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                    </Box>


                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level9"
                            label="Unilevel Bonus Level9"
                            type="text"
                          />
                        </Grid>


                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level10"
                            label="Unilevel Bonus Level10"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Div sx={{ mt: 1, pl: 2, pr: 2 }}>
                      <LoadingButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ mb: 3 }}
                        loading={isSubmitting}
                      >
                        Submit
                      </LoadingButton>
                    </Div>
                  </Form>
                )}
              </Formik>
            </List>
          )}
        </JumboCardQuick>
      </Grid>
    </Grid>
  );

};

export default Manageunilevelbonus;
