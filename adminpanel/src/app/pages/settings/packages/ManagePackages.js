import React, {  useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { IconButton, Tooltip } from '@mui/material';
import { FileCopy as FileCopyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

import CancelIcon from '@mui/icons-material/Cancel';

import { CircularProgress } from '@mui/material';
import Div from '@jumbo/shared/Div/Div';

const VISIBLE_FIELDS = ['sr','title', 'amount', 'roi', 'createdat'];


const ManagePackages = ({packageData,isloading,handleActionClick}) => {
    const [copiedRows, setCopiedRows] = useState([]);

    const generateRowId = () => {
        return `row-${Math.random().toString(36).substr(2, 9)}`;
      };

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
          },
        };
      
            

    if (isloading) {
        return  <Div
        sx={{
            display: 'flex',
            minWidth: 0,
            alignItems: 'center',
            alignContent: 'center',
            height: '100%',
        }}
      >
        <CircularProgress sx={{m: '-40px auto 0'}}/>
      </Div>
    }
    const rows= packageData?.data || []
    let idCounter = 1;
    const rowsWithId = rows.map((row) => ({
      ...row,
      id: idCounter++,
    }));
  return (
    <JumboDemoCard title={'Manage Packages'} wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}>

      <Box sx={{ height: 400, width: 1 }}>
        <DataGrid
          initialState={{
            initialState: {
              columns: {
                columnVisibilityModel: {
                  id: false,
                  coinname: false,
                  walletmessage: false,
                  walletaddress: false,
                  walletqrcode: false
                },
              },
            },
            pagination: { paginationModel: { pageSize: 24 } },
          }}
          rows={rowsWithId}
          getRowId={(row) => generateRowId()}
          columns={[
            ...VISIBLE_FIELDS.map((field) => {
              if (field === 'sr') {
                return {
                  field,
                  headerName: 'Sr',
                  width: 150,
                  renderCell: (params) => <strong>{params.row.id}</strong>,
                };
              } else if (field === 'title') {
                return {
                  field,
                  headerName: 'Title',
                  width: 150,
                };
              } else if (field === 'amount') {
                return {
                  field,
                  headerName: 'Amount',
                  width: 150,
                  renderCell: (params) => `$${params.value}`
                };
              } 
              else if (field === 'roi') {
                return {
                  field,
                  headerName: 'Daily Income',
                  width: 150,
                  renderCell: (params) => `${params.value}%`
                };
              } 
              else{
              return {
                field,
                headerName: field,
                width: 150,
              };
            }
            }),
            {
              field: 'actions',
              headerName: 'Actions',
              width: 120,
              renderCell: (params) => (
                <>

                  <Tooltip title="Delete" placement="top">
                    <IconButton
                      onClick={() => handleActionClick(params.row.tid,'reject')}
                      sx={{ color: 'error.main' }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ),
            },
            
          ]}
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
  )
}

export default ManagePackages