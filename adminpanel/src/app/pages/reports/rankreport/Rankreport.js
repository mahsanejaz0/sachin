import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { RankReportApi } from 'backendServices/ApiCalls';
import { Grid, TableCell } from "@mui/material";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';

const Rankreport = () => {
    const [rankReport, setRankReport] = useState([]);

    const [alertData, setalertData] = useState({
        show: false,
        message: "",
        variant: ""
    })

    const RankReport = () => {

        RankReportApi((response) => {
            setRankReport(response?.data?.data?.entries);
            if (response?.data?.data?.status === "success") {
                console.log("response get Successfully");
            }
        }, (error) => {
            console.log(error?.response?.data);
        })
    }

    useEffect(() => {
        RankReport();
    }, [])
    const rowsWithIndex = rankReport?.map((row, index) => ({ ...row, id: index + 1 }));
    

    const columns = [
        {
            field: "index",
            headerName: "#",  
            width: 80,
            valueGetter: (params) => params.row.id,
        },
        {
            field: "username",
            headerName: "User Name",
            width: 200,
            editable: true,
            groupable: false,
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
        {
            field: "email",
            headerName: "Email",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: "new_rank_name",
            headerName: "New Rank",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: "old_rank_name",
            headerName: "Old Rank",
            width: 200,
            editable: true,
        },
        {
            field: "life_time_rank",
            headerName: "Life Time Rank",
            width: 215,
            editable: true,
            groupable: false,
        },
        {
            field: "dat",
            headerName: "Date",
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
                    title={'Rank Report'}
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
                            rows={rowsWithIndex}

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
                    {/* )} */}
                </JumboDemoCard>
            </Grid></Grid>
    )
}

export default Rankreport