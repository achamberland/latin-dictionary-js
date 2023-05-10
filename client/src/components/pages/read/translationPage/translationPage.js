import Word from "components/pages/read/translationPage/word";
import { caseTranslations, genderTranslations, moodTranslations, personTranslations, pluralityTranslations, tenseTranslations, voiceTranslations, wordTypeTranslations } from "constants/forms";
import { formPronouns } from "constants/pronouns";
import { Box, Grid } from "grommet";
import { useEffect, useRef } from "react";
import { useMemo, useState } from "react";
import { createUseStyles } from "react-jss";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useStyles = createUseStyles({
  currentTranslation: {
    textAlign: "center"
  },
  definitionList: {
    listStyle: "none",
    padding: 0
  },
  definition: {
    marginBottom: 16
  },
  word: {
    fontStyle: 'italic',
    fontSize: 24
  },
  wordParts: {
    maxWidth: 800,
    margin: "auto",
    textAlign: "center"
  }
})

export default function ReadTranslationPage() {
  const classes = useStyles();
  const { translations } = useSelector(state => state.hugeData);
  const { name } = useParams();
  const keydownRef = useRef();

  const [activeWord, setActiveWord] = useState();

  const currentTranslation = useMemo(() => (
    Object.values(translations).find(translation => translation.name === name)
  ), [name]);

  let formFullSense = null;
  if (activeWord.type === "PRON") {
    formFullSense = formPronouns[activeWord?.form?.plurality]?.[activeWord?.form?.person];
    if (typeof formFullSense === "object") {
      formFullSense = formFullSense[activeWord?.form?.gender];
    }
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      event.preventDefault();
      const activeIndex = currentTranslation.chunks.indexOf(activeWord);
      if (activeIndex === -1) {
        setActiveWord(currentTranslation[0]);
        return;
      }
      const code = event.shiftKey ? `Shift${event.key}` : event.key;
      switch(code) {
        case "Tab":
        case "ArrowRight":
        case "ArrowDown":
          const nextChunk = currentTranslation.chunks[activeIndex + 1];
          if (nextChunk) {
            setActiveWord(nextChunk);
          } else {
            setActiveWord(null);
          }
          return;
        case "ShiftTab":
        case "ArrowLeft":
        case "ArrowUp":
          const prevChunk = currentTranslation.chunks[activeIndex - 1];
          if (prevChunk) {
            setActiveWord(prevChunk);
          } else {
            setActiveWord(null);
          }
          return;
        case "Escape":
          setActiveWord(null);
      }
    };

    if (keydownRef.current) {
      window.removeEventListener("keydown", keydownRef.current);
    }
    window.addEventListener("keydown", onKeyDown);
    keydownRef.current = onKeyDown;
    return () => (
      window.removeEventListener("keydown", keydownRef.current)
    );
  }, [currentTranslation, activeWord, setActiveWord]);

  return (
    <div>
      <div className={classes.currentTranslation}>
        {currentTranslation.chunks.map((chunk, index) => (
          <>
            {index > 0 && " "}
            <Word
              activeWord={activeWord}
              onHover={setActiveWord}
              translationChunk={chunk}
            />
          </>
        ))}
      </div>
      {activeWord && (
        <>
          <div className={classes.wordParts}>
            <h3>Parts</h3>
            <Grid
              columns={{
                count: 8,
                size: 'auto',
              }}
            >
              <Box>
                <h5>Type</h5>
                <p>{wordTypeTranslations[activeWord.definition.type]}</p>
              </Box>
              <Box>
                <h5>Case</h5>
                <p>{caseTranslations[activeWord.form.casus]}</p>
              </Box>
              {/* Nouns */}
              <Box>
                <h5>Gender</h5>
                <p>{genderTranslations[activeWord.form.gender]}</p>
              </Box>
              {/* Verbs */}
              <Box>
                <h5>Person</h5>
                <p>{personTranslations[activeWord.form.person]}</p>
              </Box>
              <Box>
                <h5>Tense</h5>
                <p>{tenseTranslations[activeWord.form.tense]}</p>
              </Box>
              <Box>
                <h5>Mood</h5>
                <p>{moodTranslations[activeWord.form.mood]}</p>
              </Box>
              <Box>
                <h5>Voice</h5>
                <p>{voiceTranslations[activeWord.form.voice]}</p>
              </Box>
              {/* Shared */}
              <Box>
                <h5>Plurality</h5>
                <p>{pluralityTranslations[activeWord.form.plurality]}</p>
              </Box>
            </Grid>
          </div>
          <div>
            <div>
              <h3>Full sense of the word</h3>
              <p>
                {activeWord.form.person && (
                  `(${formFullSense}) person`
                )}
                {activeWord.english}
              </p>
            </div>
            <h3>Definitions</h3>
            <ul className={classes.definitionList}>
              {!!activeWord.definition.description ?
                activeWord.definition.description.split(";").map(def => (
                <li className={classes.definition}>
                  {def}
                </li>
              )) : (
                "No definitions found"
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}