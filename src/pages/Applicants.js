import axios from 'axios';
import { useState ,useEffect} from 'react';
// material
import { Container, Stack, Typography,Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// components
import Page from '../components/Page';
import { ApplicantSort, ApplicantList, ApplicantFilterSidebar } from '../sections/@dashboard/applicant';
// mock
import PRODUCTS from '../_mock/products';
// api
import api from '../config/services';
// ----------------------------------------------------------------------

export default function Applicants() {
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    getApplicantList();
  }, []);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  // get list
  const [applicantList, setApplicantList] = useState([]);
  const getApplicantList = () => {
    const url = `${api.applicantList}`;
    axios
      .get(url)
      .then((res) => {
        const { data } = res;
        if (data.type === 'success') {
          setApplicantList(data.data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  

  return (
    <Page title="Dashboard: Applicants">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
        Applicants
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <Button
            startIcon={
              <AddIcon/>
            }
            >
              Import
            </Button>
            <ApplicantFilterSidebar
              isOpenFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ApplicantSort />
          </Stack>
        </Stack>

        <ApplicantList applicants={applicantList} />
      </Container>
    </Page>
  );
}
