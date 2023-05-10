import buildSteps from "components/pages/game/games/discern/buildSteps.js";
import Phase from "components/pages/game/narrative/phase.js";
import Phaser from "components/pages/game/narrative/phaser.js";
import ProfileBuilder from "components/pages/game/narrative/profileBuilder.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PHASE_GAME, PHASE_PROFILE, PHASE_RESULTS, startProfile } from "reducers/gameReducer.js";


export default function DiscernPhases(props) {
  const dispatch = useDispatch();
  const { activePhase } = useSelector(state => state.game);

  useEffect(() => {
    if (!activePhase) {
      dispatch(startProfile());
    }
  }, [activePhase, dispatch]);

  return (
    <Phaser>
      <Phase number={PHASE_PROFILE}>
        <ProfileBuilder
          buildSteps={buildSteps}
        />
        BUILDER
      </Phase>
      <Phase number={PHASE_GAME}>
        GAME PHASE
      </Phase>
      <Phase number={PHASE_RESULTS}>Results PHASE</Phase>
    </Phaser>
  );
}