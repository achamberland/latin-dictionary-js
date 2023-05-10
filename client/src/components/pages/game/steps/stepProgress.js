import { Box } from "grommet";
import { CircleAlert } from "grommet-icons";
import { useSelector } from "react-redux";


export default function StepProgress() {
  const { activeStep, steps } = useSelector(state => state.game);
  return (
    <Box
      direction="row"
      pad="medium"
    >
      {steps.map((_step, index) => (
        <Box>
          <CircleAlert
            size={activeStep === index + 1 ? "large" : "small"}
            color="dark-3"
          />
        </Box>
      ))}
    </Box>
  );
}