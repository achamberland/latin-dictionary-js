import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './reducers/gameReducer';
import familiarityReducer from './reducers/familiarityReducer';
import hugeDataReducer from 'reducers/hugeDataReducer.js';

export default configureStore({
  reducer: {
    familiarity: familiarityReducer,
    game: gameReducer,
    hugeData: hugeDataReducer
  }
});

// Other data:
// - Dictionary will be saved to the window (to avoid chance of duplicating)
// - Texts will be saved to the window