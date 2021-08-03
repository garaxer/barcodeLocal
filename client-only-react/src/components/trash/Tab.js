useEffect(() => {
  // temporary solution as I can't get navlinks and active routes to work with material ui tabs
  let {
    location: { pathname },
  } = history;
  const path = pathname.split('/')[1];
  const paths = {
    '/': 0,
    users: 1,
    barcodes: 2,
  };
  setTabValue(paths[path] || 0);
}, [setTabValue]);

const handleTabChange = (event, newValue) => {
  setTabValue(newValue);
};
import {
  Typography,
  Toolbar,
  AppBar,
  Container,
  Button,
  Tab,
  Tabs,
  Menu,
  MenuItem,
} from '@material-ui/core';
const [tabValue, setTabValue] = useState(0); // Which tab to underline
//
//{
//  permission === 'admin' && ( // change true to admin
//    <Tabs
//      value={tabValue}
//      onChange={handleTabChange}
//      centered
//      scrollButtons="auto"
//    >
//      <Tab component={Link} to={``} label="Barcode"></Tab>
//      <Tab component={Link} to={`/users`} label="Manage Users"></Tab>
//      <Tab component={Link} to={`/barcodes`} label="Manage Barcodes"></Tab>
//    </Tabs>
//  );
//}
