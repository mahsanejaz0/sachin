import React from 'react'
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,} from '@mui/material';
import KeepMountedModal from '../components/mui/Modals/KeepMountedModal';


const OrderHistory = () => {
  return (
    <>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead style={{fontWeight: 'bolder'}}>
            <TableRow >
              <TableCell>Order ID</TableCell>
              <TableCell>Order OrderHistory</TableCell>
            </TableRow>
          </TableHead>
  
          <TableBody>
         
             <>
             <TableRow >
                <TableCell>1</TableCell>
                <TableCell>
                  <Button>
                  <KeepMountedModal/>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow >
                <TableCell>2</TableCell>
                <TableCell>
                  <Button>
                  <KeepMountedModal/>
                  </Button>
                </TableCell>
              </TableRow>
 
             </>
        
         

          </TableBody>
        </Table>
      </TableContainer>

    </>
  )
}

export default OrderHistory
