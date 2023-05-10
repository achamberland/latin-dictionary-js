import { node, oneOf } from "prop-types";
import { PHASES } from "reducers/gameReducer.js";

/*
 * Syntax sugar wrapper (candy wrapper?) for Phases.
 * 
 * See phaser.js for usage.
 */
const Phase = ({ children, number }) => (
  <div data-phase={number}>
    {children}
  </div>
);

Phase.propTypes = {
  children: node.isRequired,
  number: oneOf(PHASES)
};

export default Phase;
