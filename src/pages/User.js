import axios from 'axios';
import { filter } from 'lodash';
import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Modal,
  Box,
  TextField,
  MenuItem,
  InputAdornment ,
  OutlinedInput,
} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
// api
import api from '../config/services';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'email', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'lastLogin', label: 'Last Login', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(25);

  const userData = JSON.parse(localStorage.getItem('userInfo'));
  const decodeData = jwtDecode(userData.token);
  const navigate = useNavigate();

  useEffect(() => {
    checkNavi();
    getUserList();
    getRoleList();
  }, []);
  
  const checkNavi = () => {
    if (decodeData.payload.roles[0].name === 'Chief' || decodeData.payload.roles[0].name === 'Employee') {
      navigate("/");
    }
  }

  // get list
  const [userList, setUserList] = useState([]);
  const getUserList = () => {
    
    const url = `${api.userList}`;
    axios
      .get(url)
      .then((res) => {
        const { data } = res;
        if (data.type === 'success') {
          setUserList(data.data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [roleList, setRoleList] = useState([]);
  const getRoleList = () => {
    const url = `${api.roleList}`;
    axios
      .get(url)
      .then((res) => {
        const { data } = res;
        if (data.type === 'success') {
          setRoleList(data.data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  // create 
  const [open, setOpen] = useState(false);
  

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const [selectRole, setSelectRole] = useState("");
  const handleSelectRole = (event) => {
    setSelectRole(event.target.value);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [inputUserData, SetInputUserData] = useState({});
  const submitCreateUser = () => {
    if (validateCreateUser()) {
      createAdminUser();
    }
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
  function validateCreateUser() {
    const input = inputUserData;
    const errors = {};
    let isValid = true;

    if (!input.firstName) {
      isValid = false;
      errors.firstName = 'โปรดใส่ชื่อ';
    }

    if (!input.lastName) {
      isValid = false;
      errors.firstName = 'โปรดใส่นามสกุล';
    }

    if (!input.email) {
      isValid = false;
      errors.email = 'โปรดใส่ชื่อ';
    }
    const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if (!input.password) {
      isValid = false;
      errors.password = 'โปรดใส่รหัสผ่าน';
    }

    if(!regularExpression.test(input.password)){
      isValid = false;
      errors.password = 'รหัสผ่านไม่ถูกต้อง';
    }

    setErrors(errors);

    return isValid;
  }
  
  const createAdminUser = () => {
    const postUrl = api.createUser;
    const data = inputUserData;
    data.roleId = selectRole.toString();
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
          
          window.location.reload();
        } else {
          errors.result = 'พบข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ';
          setErrors(errors);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, firstName,lastName, roles, email, lastLogin } = row;
                    const isItemSelected = selected.indexOf(firstName) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, firstName)} /> */}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {firstName} {lastName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{roles[0].name}</TableCell>
                        <TableCell align="left">{lastLogin}</TableCell>

                        <TableCell align="right">
                          <UserMoreMenu />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={'center'}>
              Create New User
            </Typography>
            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',margin:'1rem'}}>
              <TextField 
                id="firstName" 
                name="firstName"
                label="Firstname" 
                variant="outlined"
                value={inputUserData.firstName}
                onChange={inputEvent}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}/>
              <TextField 
                id="lastName" 
                name="lastName"
                label="Lastname" 
                variant="outlined"
                value={inputUserData.lastName}
                onChange={inputEvent}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}/>
              <TextField 
                id="email"
                name="email" 
                label="Email" 
                variant="outlined"
                value={inputUserData.email}
                onChange={inputEvent}
                error={Boolean(errors.email)}
                helperText={errors.email}/>
            </Box>
            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',margin:'1rem'}}>
              <OutlinedInput 
                id="password" 
                name="password"
                // label="Password" 
                placeholder='password'
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                value={inputUserData.password}
                onChange={inputEvent}
                error={Boolean(errors.password)}
                helperText={errors.password}
                type={showPassword ? 'text' : 'password'}
                sx={{width:'100%'}}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
              <TextField
                    select
                    id="roleId"
                    value={selectRole}
                    label="Select Role"
                    InputLabelProps={{ shrink: true }}
                    sx={{ height: '48px', marginTop: '10px' }}
                    onChange={handleSelectRole}
                    variant="standard"
                >
                {roleList.map((role) => (
                    <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                ))}
                </TextField>
            </Box>
            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',margin:'1rem'}}>
              <Button variant='contained' onClick={submitCreateUser}>Save</Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </Page>
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