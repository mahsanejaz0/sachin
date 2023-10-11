import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { levelBonusSummaryApi } from 'backendServices/ApiCalls';
import { CheckCircleOutline } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import Div from '@jumbo/shared/Div';

const VISIBLE_FIELDS = ['sr', 'sender', 'amount', 'final_amount', 'date'];
const LevelBonusReport = () => {

  const [donationdata, setDonationData] = useState([])
  const [loader, setLoader] = useState(false)
  const DonationData = () => {
    setLoader(true)
    levelBonusSummaryApi((response) => {
      if (response?.data?.status === "success") {
        setDonationData(response?.data?.data)
      }
      setLoader(false)
    }, (error) => {
      setLoader(false)
      console.log(error?.response?.data);
    })
  }

  useEffect(() => {
    DonationData();
  }, [])

  const initialState = {
    initialState: {
      columns: {
        columnVisibilityModel: {
          id: false,
          avatar: false,
          website: false,
          email: false,
          phone: false,
          username: false,
          city: false,
          company: false,
          position: false,
          lastUpdated: false,
          salary: false,
        }
      }
    }
  }




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
  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = [

    {
      field: "senderusername",
      headerName: "Sender",
      dataGeneratorUniquenessEnabled: true,
      width: 150,
      editable: false,
      groupable: false,
      aggregable: false,
      aggregable: false,
      renderCell: (params) => {
        const senderUsername = params.row.senderusername;
        return <span>{senderUsername}</span>;
      }
    },
    {
      field: "receiverusername",
      headerName: "Receiver",
      dataGeneratorUniquenessEnabled: true,
      width: 150,
      editable: false,
      groupable: false,
      aggregable: false,
      aggregable: false,
      renderCell: (params) => {
        const senderUsername = params.row.receiverusername;
        return <span>{senderUsername}</span>;
      }
    },
    {
      field: "amount",
      headerName: "Amount",
      dataGeneratorUniquenessEnabled: true,
      width: 150,
      editable: false,
      groupable: false,
      aggregable: false,
      renderCell: (params) => `$${params.value}`
    },
    {
      field: "details",
      headerName: "Details",
      dataGeneratorUniquenessEnabled: true,
      width: 300,
      editable: false,
      groupable: false,
      aggregable: false,
      renderCell: (params) => {
        const details = params.row.details;
        const senderUsername = params.row.senderusername; // Assuming the username is stored in the variable 'username'
        const replacedString = details.replace("you", senderUsername);
        // In your React component, you can render the replaced string
        return <div>{replacedString}</div>;
      }
    },
    {
      field: "createdat",
      headerName: "Date",
      dataGeneratorUniquenessEnabled: true,
      width: 200,
      editable: false,
      groupable: false,
      aggregable: false,
    }

  ]

  const rows = donationdata


  if (loader) {
    return <Div
      sx={{
        display: 'flex',
        minWidth: 0,
        alignItems: 'center',
        alignContent: 'center',
        height: '100%',
      }}
    >
      <CircularProgress sx={{ m: '-40px auto 0' }} />
    </Div>
  }

  return (
    <JumboDemoCard
      title={"Level Bonus Summary"}
      wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}
    >
      <Box sx={{ height: 1020, width: 1 }}>

        <DataGrid
          initialState={{
            initialState,
            pagination: { paginationModel: { pageSize: 24 } },
          }}
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          sx={gridDesign}
          pageSizeOptions={[24, 48, 96]}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}

        />
      </Box>
    </JumboDemoCard>
  )
}

export default LevelBonusReport