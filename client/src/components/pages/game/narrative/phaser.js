import Phase from "components/pages/game/narrative/phase.js";
import { arrayOf, instanceOf, node, oneOf, shape, string } from "prop-types";
import { Context } from "react";
import { useSelector } from "react-redux";

/*
 * Simple component to switch between phases of a game.
 * 
 * Usage:
 * <Phaser>
 *   <Phase>
 *     <GameIntroPhase {...theProps} />
 *   </Phase>
 * </Phaser>
 */
export default function Phaser(props) {
  const { children } = props;
  const { activePhase } = useSelector(state => state.game);

  const phaseNodes = children.filter(child =>
    child.type.name === Phase.name
  ).sort((p1, p2) => p2.props.number - p1.props.number);

  if (!activePhase) {
    return null;
  }

  let activePhaseNode = phaseNodes.find(node => node.props.number === activePhase);
  if (!activePhaseNode) {
    throw new Error(
      `activePhase '${activePhase}' is too high for phases with length: '${phaseNodes.length}'`
    )
  }

  return activePhaseNode;
}

Phaser.propTypes = {
  children: arrayOf(shape({ type: oneOf([Phase]) })).isRequired
};