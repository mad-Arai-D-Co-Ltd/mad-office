import axios from 'axios';
import { useState , useEffect,Fragment} from 'react';
import PropTypes from 'prop-types';
import jwtDecode from "jwt-decode";
// material
import { Grid, Modal,Button,Box ,Typography,TextField,Snackbar,Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// api
import api from '../../../config/services';
// ----------------------------------------------------------------------

UserUpdateVacation.propTypes = {
    usersId: PropTypes.number.isRequired
};

export default function UserUpdateVacation({ usersId,vacations,getUserList, ...other }) {
    const userData = JSON.parse(localStorage.getItem('userInfo'));
  const decodeData = jwtDecode(userData.token);

  const [open, setOpen] = useState(false);

    const [popup, setPopup] = useState(false);
    const handlePopup = () => {
        setPopup(!popup);
        SetInputUserData({
        userId:usersId,
        vacationLeave:vacations.length > 0 ? vacations[0].vacationLeave : "",
        sickLeave:vacations.length > 0 ? vacations[0].sickLeave : "",
        personalLeave:vacations.length > 0 ? vacations[0].personalLeave : "",
        leaveWithoutPayment:vacations.length > 0 ? vacations[0].leaveWithoutPayment : ""
        });
      }
    const [inputUserData, SetInputUserData] = useState({
        userId:usersId,
        vacationLeave:vacations.length > 0 ? vacations[0].vacationLeave : "",
        sickLeave:vacations.length > 0 ? vacations[0].sickLeave : "",
        personalLeave:vacations.length > 0 ? vacations[0].personalLeave : "",
        leaveWithoutPayment:vacations.length > 0 ? vacations[0].leaveWithoutPayment : ""
    });
    const submitUpdateUserVacation = () => {
        updateVacation();
    };

    const inputEvent = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    SetInputUserData((lastValue) => {
        return {
        ...lastValue,
        [name]: value,
        };
    });

    if (errors !== '') {
        setErrors({});
    }
    };
    const [errors, setErrors] = useState({});
    const updateVacation = () => {
        const postUrl = api.updateVacation;
        const data = inputUserData;
        data.createdByUserId = decodeData.payload.id.toString();
        const config = {
          method: 'post',
          url: postUrl,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.token}`,
          },
          data:{data}
        };
        axios(config)
          .then((res) => {
            const { data } = res;
            if (data.type === 'success') {
                getUserList();
                SetInputUserData({});
                handlePopup();
            } else {
              errors.result = 'พบข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ';
              setErrors(errors);
              setOpen(true);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };

  return (
    <Box>
        <Box>
            <Button color='warning' variant='contained' onClick={handlePopup}>เเก้ไขวันลา</Button>
        </Box>
    <Modal
          open={popup}
          onClose={handlePopup}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={'center'}>
              Update Vacation
            </Typography>
            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',margin:'1rem'}}>
              <TextField 
                id="vacationLeave" 
                name="vacationLeave"
                label="วันลาพักร้อน" 
                variant="outlined"
                value={inputUserData.vacationLeave}
                onChange={inputEvent}
                error={Boolean(errors.vacationLeave)}
                helperText={errors.vacationLeave}/>
              <TextField 
                id="sickLeave" 
                name="sickLeave"
                label="วันลาป่วย" 
                variant="outlined"
                value={inputUserData.sickLeave}
                onChange={inputEvent}
                error={Boolean(errors.sickLeave)}
                helperText={errors.sickLeave}/>
              <TextField 
                id="personalLeave"
                name="personalLeave" 
                label="วันลากิจ" 
                variant="outlined"
                value={inputUserData.personalLeave}
                onChange={inputEvent}
                error={Boolean(errors.personalLeave)}
                helperText={errors.personalLeave}/>
            </Box>
            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',margin:'1rem'}}>
              <Button variant='contained' onClick={submitUpdateUserVacation}>Save</Button>
            </Box>
            <Snackbar open={open} autoHideDuration={6000}>
                <Alert severity="error">{errors.result}</Alert>
            </Snackbar>
          </Box>
          
            
        </Modal>
        </Box>
  );
}


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
