import { shape } from "prop-types";
import { useSelector } from "react-redux";
import stepPropType from "constants/stepPropTypes.js";

export default function MultipleChoiceBase(props) {
  const { stepData } = props;
  
  return (
    <div>
      
    </div>
  );
}

MultipleChoiceBase.propTypes = shape(stepPropType);
