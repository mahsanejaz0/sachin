import React from 'react';
import {useField} from "formik";
import TextField from "@mui/material/TextField";

//todo: to see how to define prop-types for this component

const style = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#fff"
      }
    }
  }  

const JumboFormikSelectField = (props) => {
    const [field, meta] = useField(props);
    var multiline1=''
    multiline1 = props.multiline;
    const errorText = meta.error && meta.touched ? meta.error : '';
    return (
        <TextField
            {...props}
            {...field}
            helperText={errorText}
            multiline1  // Enables multiline behavior
            error={!!errorText}
            sx={style}
        />
    );
};

export default JumboFormikSelectField;