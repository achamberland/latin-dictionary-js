import Stepper from "components/pages/game/narrative/stepper.js";
import StepWrapper from "components/pages/game/steps/stepWrapper.js";
import ScaleRadioGroup from "components/widgets/scaleRadioGroup.js";
import { Box, Button } from "grommet";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import kebabCase from "lodash.kebabcase";
import { addGroup } from "reducers/familiarityReducer.js";
import { goToProfile, startGame } from "reducers/gameReducer.js";

// Go from simplest to hardest
const profileGroups = [
  {
    name: "Ordinary Form of the Mass",
    type: "single",
    translationNames: ["agnusDei"],
  },
  {
    name: "Common Prayers of the Rosary",
    type: "single",
    translationNames: [
      "signOfTheCross", "apostlesCreed", "ourFather", "hailMary", "gloryBe",
      "fatimaPrayer", "hailHolyQueen", "rosaryFinalPrayer"
    ]
  },
  {
    name: "The Divine Office (Modern rubric)",
    type: "group",
    translationNames: [] // TBD
  }
]

export default function ProfileBuilder(props) {
  const { buildSteps } = props;
  
  const dispatch = useDispatch();
  const { activeProfile } = useSelector(state => state.game);
  const { translations } = useSelector(state => state.hugeData);

  const [familiarities, setFamiliarities] = useState({});

  const profileGroupData = profileGroups.map(group => ({
    ...group,
    translations: group.translationNames.map(name => (
      translations[name]
    ))
  }));

  const handleFamiliarityChange = useCallback((translation, event) => (
    setFamiliarities({
      ...familiarities,
      [translation.name]: event.target.value
    })
  ), {});

  const handleNextStepClick = () => {
    dispatch(addGroup({ familiarities }));
    if (activeProfile < profileGroupData.length) {
      dispatch(goToProfile({ profile: activeProfile + 1 }));
    } else {
      const steps = buildSteps({ familiarities, translations });
      dispatch(startGame({ steps }));
    }
  }

  const activeGroup = profileGroupData[activeProfile - 1];

  return (
    <div>
      <div key={activeGroup.name}>
        <h3>{activeGroup.name}</h3>
        {activeGroup.type === "single" ? (
          <Box container>
            {activeGroup.translations.filter(t => t).map(translation => (
              <Box>
                <h5>{translation.name}</h5>
                <p>{"DUMMY" || translation.toEnglish}</p>
                <ScaleRadioGroup
                  name={kebabCase(translation.name)}
                  onChange={event => handleFamiliarityChange(translation, event)}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <div>TBD</div>
        )}
        <Button
          onClick={handleNextStepClick}
          disabled={!Object.keys(familiarities).length}
        >
          Next
        </Button>
      </div>
    </div>
  );
}