import { languages } from "../utils/languages";
export default () => (
  <select>{languages.map(l => <option key={l}>{l}</option>)}</select>
);
