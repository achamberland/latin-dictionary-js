import React, { useState } from 'react';

import { Box, Grommet, RadioButtonGroup, ThemeContext } from 'grommet';
import { grommet } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

const theme = deepMerge(grommet, {
  radioButtonGroup: {
    container: {
      gap: 'medium',
    },
  },
  radioButton: {
    border: {
      color: 'dark-5',
      width: '5px',
    },
    container: {
      extend: css`
        color: black;
      `,
    },
    hover: {
      border: {
        color: 'dark-2',
      },
    },
    size: '30px', // affects the size of the outer circle
    icon: {
      size: '15px', // affects the size of the inner circle
    },
    check: {
      radius: '20%',
    },
  },
});

const DEFAULT_SCALE = 5;

export const ScaleRadioGroup = ({ name, onChange, scale = DEFAULT_SCALE, ...props }) => {
  const options = [];
  for (let i = 0; i < scale; i++) {
    options.push({
      label: i + 1,
      value: i + 1
    });
  }
  return (
    <Grommet theme={theme}>
      <ThemeContext.Consumer>
        {(theme) => console.log(JSON.stringify(theme.radioButton))}
      </ThemeContext.Consumer>
      <Box align="center" pad="large">
        <RadioButtonGroup
          name={name}
          onChange={onChange}
          options={options}
          {...props}
        />
      </Box>
    </Grommet>
  );
};

export default ScaleRadioGroup;
