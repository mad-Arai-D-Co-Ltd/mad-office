import axios from 'axios';
import { useEffect,useState } from 'react';
import jwtDecode from "jwt-decode";
import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { VacationList } from '../sections/@dashboard/vacation';
// api
import api from '../config/services';
// ----------------------------------------------------------------------

export default function RequestVacation() {
    useEffect(() => {
        getVacationList("all");
      }, []);
    
      const [requestList, setRequestList] = useState([]);
      const getVacationList = (state) => {
        const data = {
            status : state
        }
        const url = `${api.requestVacationList}`;
        axios
          .post(url,data)
          .then((res) => {
            const { data } = res;
            if (data.type === 'success') {
                setRequestList(data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };

      const [state, setState] = useState("all");
      const handleFindNewList = (state) => {
        getVacationList(state);
        setState(state);
      }

  return (
    <Page title="Dashboard: Repair">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Request Vacation
          </Typography>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant={state === "all"?'contained':'outlined'} color='info' onClick={()=>handleFindNewList("all")}>ทั้งหมด</Button>
          <Button variant={state === "reject"?'contained':'outlined'} color='error' onClick={()=>handleFindNewList("reject")}>ไม่อนุมัติ</Button>
          <Button variant={state === "pending"?'contained':'outlined'} color='warning' onClick={()=>handleFindNewList("pending")}>รอการอนุมัติ</Button>
          <Button variant={state === "approve"?'contained':'outlined'} color='success' onClick={()=>handleFindNewList("approve")}>อนุมัติ</Button>
        </Stack>

        <Grid container spacing={3}>
          <VacationList requests={requestList} state={state} getVacationList={getVacationList}/>
        </Grid>
      </Container>
    </Page>
  );
}
