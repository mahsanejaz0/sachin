import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { deletenews, getnews, getuserslist} from 'backendServices/ApiCalls';
import { Button, Grid } from "@mui/material";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import { useNavigate } from 'react-router-dom';
// import DeleteIcon from '@mui/icons-material/Delete';


const ListofAlluser = () => {
    const [alluser, setAllUser] = useState([]);

    const [alertData, setalertData] = useState({
        show: false,
        message: "",
        variant: ""
    })
    const navigate = useNavigate();

    const Getalluserlist = () => {

        getuserslist((response) => {
            console.log("userlist", response)
            setAllUser(response?.data?.data);
            if (response?.data?.data?.status === "success") {
                console.log("response get Successfully");
            }
        }, (error) => {
            console.log(error?.response?.data);
        })
    }
console.log("state", alluser)
    useEffect(() => {
        Getalluserlist();
    }, [])


    const columns = [
        {
            field: "username",
            headerName: "User Name",
            width: 200,
            editable: true,

        },
        {
            field: "firstname",
            headerName: "First Name",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: "lastname",
            headerName: "Last Name",
            width: 200,
            editable: true,
            groupable: false,
        },
       

    ]


    const gridDesign = {
        '& .MuiDataGrid-toolbarContainer': {
            '& .MuiButton-text': {
                fontSize: '13px !important',
                color: '#fff',
            },
            '& .MuiBadge-badge': {
                backgroundColor: '#074682',
            },
            '& .MuiInput-root': {
                borderRadius: 2,
                paddingLeft: 2,
                overflow: 'hidden',
            },

        }
    }

    return (
        <Grid container fullWidth sm={12} xs={12} p={2} alignItems="center" justifyContent="center">
            <Grid item sm={12} xs={12}>
                <JumboDemoCard
                    title={'All Users'}
                    wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}
                >
                    {
                        alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
                    }

                    <Box sx={{ height: 500, width: 1 }}>
                        <DataGrid
                            initialState={{
                                pagination: { paginationModel: { pageSize: 6 } },
                            }}
                            rows={alluser}

                            getRowId={(row) => row.id}
                            columns={columns}
                            slots={{ toolbar: GridToolbar }}
                            sx={gridDesign}
                            pageSizeOptions={[6, 12, 18, 24, 30]}
                            slotProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                    quickFilterProps: { debounceMs: 500 },
                                },
                            }}
                        />
                    </Box>
                </JumboDemoCard>
            </Grid>
        </Grid>
    )
}

export default ListofAlluser