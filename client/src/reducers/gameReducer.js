// Manages global state for games

import { createSlice } from '@reduxjs/toolkit'

export const PHASE_INTRO = 1;
export const PHASE_PROFILE = 2;
export const PHASE_POST_PROFILE = 3;
export const PHASE_PRE_GAME = 6;
export const PHASE_GAME = 7;
export const PHASE_RESULTS = 8;
export const PHASES = [PHASE_INTRO, PHASE_PROFILE, PHASE_GAME, PHASE_RESULTS];

const initialState = {
  // "Phase" represents whether in intro, main game, or results if not shown as a step
  activePhase: 0,

  // Only applies to PHASE_PROFILE mode
  activeProfile: 0,
  
  // Only applies to PHASE_GAME mode
  activeStep: 0,

  // See src/constants/stepPropTypes#reducerSchema for schema
  steps: null,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startIntro: state => {
      state.activePhase = PHASE_INTRO;
    },

    startProfile: state => {
      state.activePhase = PHASE_PROFILE;
      state.activeProfile = 1;
    },

    startGame: (state, action) => {
      const { steps } = action.payload;
      // Validations
      if (!Array.isArray(steps) || steps.some(step => !step.name)) {
        throw new Error("Invalid steps array dispatched: ", steps);
      }
      state.activePhase = PHASE_GAME;
      state.activeProfile = 0;
      state.activeStep = 1;
      state.steps = steps;
    },

    submitAnswer: (state, action) => {
      const { answer } = action.payload;
      state.steps[state.activeStep - 1].answer = answer;
    },

    goNextStep: (state) => {
      const nextStep = state.activeStep + 1;
      if (nextStep > state.steps.length) {
        state.activePhase = PHASE_RESULTS;
      } else {
        state.activeStep = nextStep;
      }
    },

    goToPhase: (state, action) => {
      const { phase } = action.payload;
      state.activePhase = phase;
    },

    goToProfile: (state, action) => {
      const { profile } = action.payload;
      state.activeProfile = profile;
    },

    goToStep: (state, action) => {
      const { step } = action.payload;
      if (typeof step !== "number" || step < 1 || step > state.steps.length) {
        throw new Error("Tried to go to invalid step: ", step);
      }
      if (state.answers.length < step - 1) {
        throw new Error("Cannot go to step without answering previous step");
      }
      state.activeStep = step;
    },

    end: (state) => {
      state = initialState;
    }
  },
})

export const { startProfile, startGame, goNextStep, goToPhase, goToProfile, goToStep, submitAnswer, end } = gameSlice.actions

export default gameSlice.reducer
