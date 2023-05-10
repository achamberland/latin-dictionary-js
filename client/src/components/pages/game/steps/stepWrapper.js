import StepProgress from "components/pages/game/steps/stepProgress.js";


export default function StepWrapper({ children }) {
  return (
    <div>
      <StepProgress />
      {children}
    </div>
  )
}
