import paths from "components/pages/paths";
import { generatePath, Link } from "react-router-dom";


export default function ReadHome() {

  return (
    <div>
      <h2>Reading page placeholder</h2>
      <div>Choose a Translation (Debug menu)</div>
      <Link to={generatePath(paths.readTranslation, { name: "sign-of-the-cross" })}>
        Sign of the Cross
      </Link>
      <Link to={generatePath(paths.readTranslation, { name: "hail-mary" })}>
        The Hail Mary
      </Link>
      <div>
        <h3>Guides menu</h3>
        <h5>Nouns</h5>
        <p>Declensions</p>
        <p>Root words</p>
        <h5>Verbs</h5>
        <p>Conjugations</p>
        <p>Root words</p>
      </div>
      <div>Current translation (each word has tooltip and guide)</div>
    </div>
  );
}