import axios from 'axios';
import { useEffect,useState,useRef } from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box,TextField,Button,Collapse,Typography, Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Switch } from '@mui/material';

// component
import CircleIcon from '@mui/icons-material/Circle';
import Iconify from '../../../components/Iconify';
// api
import api from '../../../config/services';

OrderList.propTypes = {
    requests: PropTypes.array.isRequired
  };


export default function OrderList({requests,state,getOrderList, ...other }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

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
      
    const checkColor = (status) => {
      let color;
      switch (status) {
        case "ไม่รับคำร้อง":
          color = 'error';
          break;
        case "รอการตรวจสอบ":
          color = 'info';
          break;
        case "กำลังตรวจสอบ":
          color = 'warning';
          break;
        default:
          color = 'success';
          break;
      }
      return color;
    }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">ข้อมูลสั่งซื้อ</TableCell>
            <TableCell align="center">ความเร่งด่วน</TableCell>
            <TableCell align="center">สถานะ</TableCell>
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
              <TableCell align="center">
                {request.urgency}
              </TableCell>
              <TableCell align="center">
                <Box  sx={{display:"flex",flexDirection:"row",justifyContent:"center",alignContent:"center"}}>
                  <CircleIcon color={checkColor(request.status)}/>
                  {request.status}
                </Box>
                
              </TableCell>
              <TableCell align="center">
                <Button ref={ref} onClick={() => setIsOpen(true)}>
                  <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
                  <Typography variant='body1'>เปลี่ยนสถานะ</Typography>
                </Button>
                <Menu
                  open={isOpen}
                  anchorEl={ref.current}
                  onClose={() => setIsOpen(false)}
                  PaperProps={{
                    sx: { width: 200, maxWidth: '100%' },
                  }}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={()=>handleChangeStatus(request.id,"ไม่รับคำร้อง")} sx={{ color: 'text.secondary' }}>
                    <ListItemText>ไม่รับคำร้อง</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={()=>handleChangeStatus(request.id,"กำลังตรวจสอบ")} sx={{ color: 'text.secondary' }}>
                    <ListItemText>กำลังตรวจสอบ</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={()=>handleChangeStatus(request.id,"สั่งซื้อแล้ว")} sx={{ color: 'text.secondary' }}>
                    <ListItemText>สั่งซื้อแล้ว</ListItemText>
                  </MenuItem>
                  
                  
                </Menu>
                    
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
