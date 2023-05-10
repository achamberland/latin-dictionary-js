import { Tip } from "grommet";
import { useCallback } from "react";
import {createUseStyles} from 'react-jss'


const useStyles = createUseStyles({
  word: {
    fontStyle: 'italic',
    fontSize: 24
  },
  wordActive: {
    textDecoration: "underline"
  }
})

export default function Word(props) {
  const { activeWord, onHover, translationChunk } = props;
  const styles = useStyles();

  return (
    <span
      onMouseOver={() => onHover(translationChunk)}
      className={
        `${styles.word} ${activeWord === translationChunk ? styles.wordActive : ""}`
      }
    >
      {/* <Tip
        content={"Word part"}
      > */}
        {translationChunk.word}
      {/* </Tip> */}
    </span>
  )
}