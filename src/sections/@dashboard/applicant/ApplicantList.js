import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import ApplicantCard from './ApplicantCard';

// ----------------------------------------------------------------------

ApplicantList.propTypes = {
  applicants: PropTypes.array.isRequired
};

export default function ApplicantList({ applicants, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {applicants.map((applicant) => (
        <Grid key={applicant.id} item xs={12} sm={6} md={3}>
          <ApplicantCard applicant={applicant} />
        </Grid>
      ))}
    </Grid>
  );
}
