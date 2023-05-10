import { Box } from "grommet";

const AppBar = ({ children, ...boxProps }) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation='medium'
    style={{ zIndex: '1' }}
    {...boxProps}
  >
    {children}
  </Box>
);

export default AppBar;
