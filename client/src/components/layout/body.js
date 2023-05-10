import { Box } from "grommet";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(() => ({
  innerContent: {
    maxWidth: 1440,
    padding: "48px 60px"
  }
}))
 
const Body = ({ children }) => {
  const classes = useStyles();
  return (
    <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
      <Box className={classes.innerContent} flex align='stretch' justify='center'>
        {children}
      </Box>
    </Box>
  );
};

export default Body;
