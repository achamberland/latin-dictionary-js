import { Context, useMemo } from "react";
import { useSelector } from "react-redux";
import MultipleChoiceBase from "components/pages/game/steps/multipleChoice/multipleChoiceBase.js";
import StepWrapper from "components/pages/game/steps/stepWrapper.js";

// Switch between the active step of a game
export default function Stepper(props) {
  const { activeStep, steps } = useSelector(state => state.game);
  const { chunks, translations, words } = useSelector(state => state.hugeData);

  let activeStepData = steps[activeStep + 1];
  
  const StepComponentForType = useMemo(() => {
    switch(activeStepData?.type) {
      case "multipleChoice":
        return MultipleChoiceBase;
    }
  }, [activeStep, steps]);

  const chunk = useMemo(
    () => chunks.get(activeStepData?.chunk),
    [activeStepData?.chunk, chunks]
  );
  const translation = useMemo(
    () => translations.get(activeStepData?.translation),
    [activeStepData?.translation, translations]
  );
  const wordAnswered = useMemo(
    () => words.get(activeStepData?.answered),
    [activeStepData?.answered, words]
  );
  const wordExpected = useMemo(
    () => words.get(activeStepData?.expected),
    [activeStepData?.expected, words]
  );

  if (!activeStep || !steps) {
    return null;
  }

  if (!activeStepData) {
    throw new Error(
      `activeStep '${activeStep}' is too high for steps with length: '${steps.length}'`
    )
  }

  return (
    <StepWrapper {...props}>
      <StepComponentForType
        step={activeStepData}
        chunk={chunk}
        translation={translation}
        wordAnswered={wordAnswered}
        wordExpected={wordExpected}
      />
    </StepWrapper>
  )
}
