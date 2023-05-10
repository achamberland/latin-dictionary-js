import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeGroupIndex: 0,
  values: {
    // 0 to 5
    doxologiaMinor: 0,
    // etc.
    // probably not worth filling in everything here for the 0's
  }
};

export const familiaritySlice = createSlice({
  name: 'familiarity',
  initialState,
  reducers: {
    addGroup: (state, action) => {
      const { familiarities } = action.payload;
      if (Array.isArray(familiarities)) {
        throw new Error("Familiarity group must be an array");
      }
      state.values = Array.from(state.values).concat(familiarities);
    },
    remove: (state, action) => {
      const { name } = action.payload;
      delete state.values[name];
    },
    levelUp: (state, action) => {
      const { name } = action.payload;
      state.values[name] += 1;
    },
    levelDown: (state, action) => {
      const { name } = action.payload;
      state.values[name] -= 1;
    },
    clear: state => {
      state = { ...initialState };
    },
  },
})

export const { addGroup, remove, clear, levelUp, levelDown } = familiaritySlice.actions

export default familiaritySlice.reducer
