import axios from 'axios';
import { useEffect,useState } from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TextField,Button,Collapse,Typography } from '@mui/material';
// api
import api from '../../../config/services';

OrderList.propTypes = {
    requests: PropTypes.array.isRequired
  };

export default function OrderList({requests,state,getOrderList, ...other }) {

    const handleChangeStatus = (id,state) => {
        const data = {
         "orderId" : id.toString(),
         "status" : state
        }
        updateOrderStatus(data);
       }
    
       const updateOrderStatus = (data) => {
        const url = api.updateOrderStatus;
        
        axios
          .post(url, data)
          .then((res) => {
            const { data } = res;
            if (data.type === 'success') {
                getOrderList(state);
            } else {
              errors.result = 'พบข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ';
              setErrors(errors);
            }
          })
          .catch((err) => {
            console.log(err);
          });
       }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">ข้อมูลสั่งซื้อ</TableCell>
            <TableCell align="center">ปรับสถานะ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request,key) => (
            <TableRow
              key={request.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center">
                {request.detail}
              </TableCell>
                <TableCell align="center" sx={{display:"flex",flexDirection:"row",justifyContent:"space-evenly"}}>
                    <Button variant='contained' color='error' onClick={()=>handleChangeStatus(request.id,"ไม่รับคำร้อง")} >ไม่รับคำร้อง</Button>
                    <Button variant='contained' color='warning' onClick={()=>handleChangeStatus(request.id,"กำลังตรวจสอบ")} >กำลังตรวจสอบ</Button>
                    <Button variant='contained' color='success' onClick={()=>handleChangeStatus(request.id,"แก้ไขแล้ว")} >เเก้ไขเเล้ว</Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
