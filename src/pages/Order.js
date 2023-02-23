import axios from 'axios';
import { useEffect,useState } from 'react';
import jwtDecode from "jwt-decode";
import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { OrderList } from '../sections/@dashboard/order';
// api
import api from '../config/services';
// ----------------------------------------------------------------------

export default function Repair() {
    useEffect(() => {
        getOrderList("รอการตรวจสอบ");
      }, []);
    
      const [orderList, setOrderList] = useState([]);
      const getOrderList = (state) => {
        const data = {
            status : state
        }
        const url = `${api.requestOrderList}`;
        axios
          .post(url,data)
          .then((res) => {
            const { data } = res;
            if (data.type === 'success') {
                setOrderList(data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };

      const [state, setState] = useState("รอการตรวจสอบ");
      const handleFindNewList = (state) => {
        getOrderList(state);
        setState(state);
      }

  return (
    <Page title="Dashboard: Repair">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Repair
          </Typography>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <Button variant={state === "ไม่รับคำร้อง"?'contained':'outlined'} color='error' onClick={()=>handleFindNewList("ไม่รับคำร้อง")}>ไม่รับคำร้อง</Button>
          <Button variant={state === "รอการตรวจสอบ"?'contained':'outlined'} color='info' onClick={()=>handleFindNewList("รอการตรวจสอบ")}>รอการตรวจสอบ</Button>
          <Button variant={state === "กำลังตรวจสอบ"?'contained':'outlined'} color='warning' onClick={()=>handleFindNewList("กำลังตรวจสอบ")}>กำลังตรวจสอบ</Button>
          <Button variant={state === "แก้ไขแล้ว"?'contained':'outlined'} color='success' onClick={()=>handleFindNewList("แก้ไขแล้ว")}>แก้ไขแล้ว</Button>
        </Stack>

        <Grid container spacing={3}>
          <OrderList requests={orderList} state={state} getOrderList={getOrderList}/>
        </Grid>
      </Container>
    </Page>
  );
}
