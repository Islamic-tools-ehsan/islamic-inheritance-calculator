import { currencies } from "../utils/currencies";
export default () => (
  <select>{currencies.map(c => <option key={c}>{c}</option>)}</select>
);
