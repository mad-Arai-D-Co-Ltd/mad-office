import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';

// api
import api from '../../../config/services';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [adminUser, setAdminUser] = useState([]);
  const [dataerrors, setErrors] = useState({});

  
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      platform: 'web',
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      const postUrl = api.login;
      const dataSend = values;

      const config = {
        method: 'post',
        url: postUrl,
        headers: {
          'Content-Type': 'application/json',
          platform: 'web',
          fcmToken: '0',
        },
        data: dataSend,
      };

      axios(config)
        .then((res) => {
          const { data } = res;
          
          if (data.type === 'success') {
            setAdminUser(data.data);
            const resdata = data.data;
            localStorage.setItem('userInfo', JSON.stringify(resdata));
            localStorage.setItem('accessToken', data.token);

            navigate('/dashboard', { replace: true });
          } else {
            errors.email = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
            formik.setErrors(errors);
            setErrors(dataerrors);
            formik.setSubmitting(false);
          }
        })
        .catch((err) => {
          console.log(err);

          errors.email = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
          formik.setErrors(errors);
          formik.setSubmitting(false);
        });
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
