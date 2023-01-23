import axios from 'axios';
import { useRef, useState } from 'react';
import jwtDecode from "jwt-decode";
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box,Snackbar ,Alert, Divider, Typography, Stack, MenuItem, Avatar, TextField ,Button,Modal,Rating,Link,Table,TableCell,TableContainer,TableHead,TableRow,TableBody } from '@mui/material';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// api
import api from '../../../config/services';
// ----------------------------------------------------------------------

export default function ApplicantPopover({applicant,getApplicantList,...other}) {
  const anchorRef = useRef(null);

  let userdata = localStorage.getItem('userInfo');
  userdata = userdata ? JSON.parse(userdata) : null;
  let decodeData;
  if(userdata !== null){
    decodeData = jwtDecode(userdata.token);
  }

  const [open, setOpen] = useState(false);
  const [workSkillRate, setWorkSkillRate] = useState(0);
  const [attitudeRate, setAttitudeRate] = useState(0);
  const [professionalismRate, setProfessionalismRate] = useState(0);
  const [leadershipRate, setLeadershipRate] = useState(0);
  const [socialSkillRate, setSocialSkillRate] = useState(0);
  const [academicScoreRate, setAcademicScoreRate] = useState(0);
  const [otherSkillRate, setOtherSkillRate] = useState(0);
  const [comment, setComment] = useState("");
  const [inputData, SetInputData] = useState({});
  
  const [disabledSaveBtn,setDisabledSaveBtn] = useState(false);

  const [error, setError] = useState(false);
  
  const [userReview, setUserReview] = useState([]);
  const getUserReview = () => {
    const url = `${api.getUserReview}/${applicant.id}/${decodeData.payload.id}`;
    axios
      .get(url)
      .then((res) => {
        const { data } = res;
        if (data.type === 'success') {
          setUserReview(data.data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(false);
  };

  const inputEvent = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    SetInputData((lastValue) => {
      return {
        ...lastValue,
        [name]: value,
      };
    });

    if (errors !== '') {
      setErrors({});
    }
  };

  const portfolio = applicant.portfolio ? applicant.portfolio : applicant.portfolioLink;
  const expectedSalary = applicant.expectedSalary ? applicant.expectedSalary : applicant.expectedIncome;

  
  

  const handlePopup = () => {
    resetRate();
    getUserReview();
    if(userReview.length > 0){
      setWorkSkillRate(userReview[0].workSkillRate);
      setAttitudeRate(userReview[0].attitudeRate);
      setProfessionalismRate(userReview[0].professionalismRate);
      setLeadershipRate(userReview[0].leadershipRate);
      setSocialSkillRate(userReview[0].socialSkillRate);
      setAcademicScoreRate(userReview[0].academicScoreRate);
      setOtherSkillRate(userReview[0].otherSkillRate);
      setDisabledSaveBtn(true);
    }
    setOpen(!open);
  };

  const handlePopupClose = () => {
    setOpen(!open);
  };

  const resetRate = () => {
      setWorkSkillRate(0);
      setAttitudeRate(0);
      setProfessionalismRate(0);
      setLeadershipRate(0);
      setSocialSkillRate(0);
      setAcademicScoreRate(0);
      setOtherSkillRate(0);
  }
  
  const validateReview = () => {
    if(workSkillRate === 0 && 
      attitudeRate === 0 && 
      professionalismRate === 0 && 
      leadershipRate === 0 && 
      socialSkillRate === 0 && 
      academicScoreRate === 0 && 
      otherSkillRate === 0){
        setError(true);
    } else {
      postData();
    }
  }

  const onClickSave = () => {
    validateReview();
    
  }

  const postData = () => {
    const url = `${api.reviewApplicant}`;
    const data = {
      "userId":  decodeData.payload.id.toString(),
      "applicantId": applicant.id.toString(),
      "workSkillRate": workSkillRate.toString(),
      "attitudeRate": attitudeRate.toString(),
      "professionalismRate": professionalismRate.toString(),
      "leadershipRate": leadershipRate.toString(),
      "socialSkillRate": socialSkillRate.toString(),
      "academicScoreRate": academicScoreRate.toString(),
      "otherSkillRate": otherSkillRate.toString(),
      "comment": inputData.comment
    }
    axios
      .post(url,data)
      .then((res) => {
        const { data } = res;
        if (data.type === 'success') {
          handlePopup();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }


  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button variant='contained' color='info' onClick={handlePopup} sx={{width:"100%"}}>Detail</Button>
          {/* <Button variant='contained' color='success'>Review</Button> */}
        </Stack>
        
        <Modal
        open={open}
        onClose={handlePopupClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >

        <Box sx={{ ...style, width: '120vh' }}>
        
          <Snackbar open={error} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'top',
            horizontal: 'right',}}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              กรุณาให้คะเเนนก่อนกดบันทึก
            </Alert>
          </Snackbar>

          <Stack sx={{display:'flex',flexDirection: 'row',justifyContent: 'center'}}>
              <Box sx={{display:'flex',flexDirection: 'column',width : '70%',overflowY: 'auto',height: '50vh',padding:'1rem'}}>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                    <Typography variant='subtitle1'> รูปแบบการสมัคร&nbsp;:&nbsp;</Typography>
                    <Typography variant='body1' color={"#363636"}>{applicant.jobApplicationType}</Typography> 
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1'> Position&nbsp;:&nbsp; </Typography> 
                      <Typography variant='body1' color={"#363636"}>{applicant.position}</Typography>
                    </Stack>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1'> Expect Salary&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{fCurrency(expectedSalary)}</Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Email&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.email}</Typography>
                    </Stack>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Mobile&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.mobile}</Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Name&nbsp;:&nbsp;</Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.name}</Typography>
                    </Stack>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Gender&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.gender}</Typography>
                    </Stack>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Status&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.status}</Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Id code&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.idCode}</Typography>
                    </Stack>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Date of birth : </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.dateOfBirth}</Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Address&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.address}</Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Typography variant='subtitle1' > Portfolio&nbsp;:&nbsp;<Link href={portfolio}>{portfolio}</Link> </Typography>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Ref.&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.refEmployee}</Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Military&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.military}</Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > interest&nbsp;:&nbsp;</Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.interest}</Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <TableContainer sx={{marginBottom:'1rem'}}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">talent</TableCell>
                            <TableCell align="center">drivingAbility</TableCell>
                            <TableCell align="center">motorcycle</TableCell>
                            <TableCell align="center">thai</TableCell>
                            <TableCell align="center">english</TableCell>
                            <TableCell align="center">iosSystem</TableCell>
                            <TableCell align="center">pcSystem</TableCell>
                            <TableCell align="center">officeEquipment</TableCell>
                            <TableCell align="center">work in other</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell align="center">{applicant.talent}</TableCell>
                            <TableCell align="center">{applicant.drivingAbility}</TableCell>
                            <TableCell align="center">{applicant.motorcycle}</TableCell>
                            <TableCell align="center">{applicant.thai}</TableCell>
                            <TableCell align="center">{applicant.english}</TableCell>
                            <TableCell align="center">{applicant.iosSystem}</TableCell>
                            <TableCell align="center">{applicant.pcSystem}</TableCell>
                            <TableCell align="center">{applicant.officeEquipment}</TableCell>
                            <TableCell align="center">{applicant.workInOther}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Target&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.target}</Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > success&nbsp;pride&nbsp;:&nbsp;{applicant.successPride} </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.successPride}</Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > People&nbsp;dont&nbsp;know&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.peopleDontKnow}</Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > News&nbsp;from&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.newsFrom}</Typography>
                    </Stack>
                  </Stack>
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > About&nbsp;you&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.aboutYou}</Typography>
                    </Stack>
                  </Stack>
                  
                  <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Disease&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.disease}</Typography>
                    </Stack>
                    <Stack sx={{display:'flex',flexDirection: 'row',justifyContent:'flex-start'}}>
                      <Typography variant='subtitle1' > Emergency&nbsp;Contact&nbsp;:&nbsp; </Typography>
                      <Typography variant='body1' color={"#363636"}>{applicant.emergencyContact}</Typography>
                    </Stack>
                  </Stack>
              </Box>
              <Box sx={{display:'flex',flexDirection: 'column',alignItems:'center',width : '30%'}}>

                <Stack sx={{display:'flex',flexDirection: 'column',alignItems:'center',marginBottom:'0.5rem'}}>
                  <Typography component="legend">Work Skill Rate</Typography>
                  <Rating
                    name="simple-controlled"
                    value={userReview.length > 0 ? userReview[0].workSkillRate:workSkillRate}
                    onChange={(event, newValue) => {
                      setWorkSkillRate(newValue);
                    }}
                    readOnly={userReview.length > 0 ? true : !true}
                  />
                </Stack>

                <Stack sx={{display:'flex',flexDirection: 'column',alignItems:'center',marginBottom:'0.5rem'}}>
                  <Typography component="legend">Attitude Rate</Typography>
                  <Rating
                    name="simple-controlled"
                    value={userReview.length > 0 ? userReview[0].attitudeRate:attitudeRate}
                    onChange={(event, newValue) => {
                      setAttitudeRate(newValue);
                    }}
                    readOnly={userReview.length > 0 ? true : !true}
                  />
                </Stack>

                <Stack sx={{display:'flex',flexDirection: 'column',alignItems:'center',marginBottom:'0.5rem'}}>
                  <Typography component="legend">Professionalism Rate</Typography>
                  <Rating
                    name="simple-controlled"
                    value={userReview.length > 0 ? userReview[0].professionalismRate:professionalismRate}
                    onChange={(event, newValue) => {
                      setProfessionalismRate(newValue);
                    }}
                    readOnly={userReview.length > 0 ? true : !true}
                  />
                </Stack>

                <Stack sx={{display:'flex',flexDirection: 'column',alignItems:'center',marginBottom:'0.5rem'}}>
                  <Typography component="legend">Leadership Rate</Typography>
                  <Rating
                    name="simple-controlled"
                    value={userReview.length > 0 ? userReview[0].leadershipRate:leadershipRate}
                    onChange={(event, newValue) => {
                      setLeadershipRate(newValue);
                    }}
                    readOnly={userReview.length > 0 ? true : !true}
                  />
                </Stack>

                <Stack sx={{display:'flex',flexDirection: 'column',alignItems:'center',marginBottom:'0.5rem'}}>
                  <Typography component="legend">Social Skill Rate</Typography>
                  <Rating
                    name="simple-controlled"
                    value={userReview.length > 0 ? userReview[0].socialSkillRate:socialSkillRate}
                    onChange={(event, newValue) => {
                      setSocialSkillRate(newValue);
                    }}
                    readOnly={userReview.length > 0 ? true : !true}
                  />
                </Stack>

                <Stack sx={{display:'flex',flexDirection: 'column',alignItems:'center',marginBottom:'0.5rem'}}>
                  <Typography component="legend">Academic Score Rate</Typography>
                  <Rating
                    name="simple-controlled"
                    value={userReview.length > 0 ? userReview[0].academicScoreRate:academicScoreRate}
                    onChange={(event, newValue) => {
                      setAcademicScoreRate(newValue);
                    }}
                    readOnly={userReview.length > 0 ? true : !true}
                  />
                </Stack>

                <Stack sx={{display:'flex',flexDirection: 'column',alignItems:'center',marginBottom:'0.5rem'}}>
                  <Typography component="legend">Other Skill Rate</Typography>
                  <Rating
                    name="simple-controlled"
                    value={userReview.length > 0 ? userReview[0].otherSkillRate:otherSkillRate}
                    onChange={(event, newValue) => {
                      setOtherSkillRate(newValue);
                    }}
                    readOnly={userReview.length > 0 ? true : !true}
                  />
                </Stack>

                <Stack sx={{display:'flex',flexDirection: 'column',alignItems:'center',marginBottom:'0.5rem'}}>
                  <TextField 
                    id="comment" 
                    name='comment' 
                    label="comment" 
                    variant="outlined" 
                    onChange={inputEvent} 
                    value={inputData.comment} 
                    InputProps={{
                      readOnly:userReview.length > 0 ? true : !true
                    }}
                    
                    />
                </Stack>

                <Stack sx={{display:'flex',flexDirection: 'row',alignItems:'center',marginBottom:'0.5rem'}}>
                  <Button color='error' disabled={disabledSaveBtn} onClick={resetRate}>Reset</Button>
                  <Button disabled={disabledSaveBtn} onClick={onClickSave}>Save</Button>
                </Stack>
                
              </Box>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vh',
    height: '60vh',
    bgcolor: '#fff',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };