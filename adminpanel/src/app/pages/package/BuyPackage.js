import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import Div from '@jumbo/shared/Div/Div';
import { Box, TextField } from '@mui/material';
import React from 'react';


const BuyPackage = () => {
    return (
        <JumboDemoCard title={"Sizes"} wrapperSx={{backgroundColor: 'background.paper', pt: 0}}>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': {m: 1, width: '24ch'},
                }}
                noValidate
                autoComplete="off"
            >
                <Div>
                    <TextField
                        label="Size"
                        id="outlined-size-small"
                        defaultValue="Small"
                        size="small"
                    />
                    <TextField label="Size" id="outlined-size-normal" defaultValue="Normal"/>
                </Div>
                <Div>
                    <TextField
                        label="Size"
                        id="filled-size-small"
                        defaultValue="Small"
                        variant="filled"
                        size="small"
                    />
                    <TextField
                        label="Size"
                        id="filled-size-normal"
                        defaultValue="Normal"
                        variant="filled"
                    />
                </Div>
                <Div>
                    <TextField
                        label="Size"
                        id="standard-size-small"
                        defaultValue="Small"
                        size="small"
                        variant="standard"
                    />
                    <TextField
                        label="Size"
                        id="standard-size-normal"
                        defaultValue="Normal"
                        variant="standard"
                    />
                </Div>
            </Box>
        </JumboDemoCard>
    );
};

export default BuyPackage;
