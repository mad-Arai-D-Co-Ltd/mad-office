import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import ApplicantCard from './ApplicantCard';

// ----------------------------------------------------------------------

ApplicantList.propTypes = {
  applicants: PropTypes.array.isRequired
};

export default function ApplicantList({ applicants,getApplicantList, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {applicants.map((applicant) => (
        <Grid key={applicant.id} item xs={12} sm={6} md={3}>
          <ApplicantCard applicant={applicant} getApplicantList={getApplicantList}/>
        </Grid>
      ))}
    </Grid>
  );
}
