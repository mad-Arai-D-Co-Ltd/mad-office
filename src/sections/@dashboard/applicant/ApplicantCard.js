import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack,Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import ApplicantPopover from './ApplicantPopover';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ApplicantCard.propTypes = {
  applicant: PropTypes.object,
};

export default function ApplicantCard({ applicant ,getApplicantList}) {
  const { id , jobApplicationType , gender , name , mobile ,expectSalary,position,avgRate} = applicant;
  const rating = avgRate === null ? '0':avgRate;
  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StarIcon 
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
              color:'#FFE800',
              fontSize: '2.8rem',
              
            }}
        />
        <Typography variant="subtitle2"
            sx={{
                zIndex: 9,
                top: 27.5,
                right: 33,
                position: 'absolute',
                textTransform: 'uppercase',
                fontSize: '1rem',
                color:'#7A7A7A',
              }}
        >
            {rating}
          </Typography>
        {/* <ProductImgStyle alt={name} src={cover} /> */}
        <PersonIcon sx={{top: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',}} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">
            {"ตำแหน่ง"}&nbsp;:&nbsp;{position}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">
            {jobApplicationType}
          </Typography>
        
          <Typography variant="subtitle2">
            {fCurrency(expectSalary)}&nbsp;/&nbsp;{"month"}
          </Typography>
        </Stack>
          <ApplicantPopover applicant={applicant} getApplicantList={getApplicantList}/>
      </Stack>
    </Card>
  );
}
