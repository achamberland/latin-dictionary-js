
const SCALE = 5;
const RANDOMNESS_FACTOR = 0.25;

export default function buildSteps(props) {
  const { familiarities, translations } = props;

  // TODO: Use previous selected translations

  const familiaritySortedTranslations = Object.entries(familiarities).sort((e1, e2) => (
    e1[1] - e2[1]
  ));

  // Where similar forms or words are 
  const similaritySortedTranslations = familiaritySortedTranslations;

  const nonHistorySortedTranslations = similaritySortedTranslations;
  
  const randomnessSortedTranslations = nonHistorySortedTranslations.sort((e1, e2) => (
    ((Math.random() * RANDOMNESS_FACTOR) + (e1 / SCALE)) - 
      ((Math.random() * RANDOMNESS_FACTOR) + (e2 / SCALE))
  ));

  return randomnessSortedTranslations;
};
