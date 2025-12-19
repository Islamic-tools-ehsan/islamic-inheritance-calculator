
import { useState } from "react";
import HeirInput from "./components/HeirInput";
import ResultTable from "./components/ResultTable";
import PieChart from "./components/PieChart";
import FiqhSelector from "./components/FiqhSelector";
import CurrencySelector from "./components/CurrencySelector";
import LanguageSelector from "./components/LanguageSelector";
import { calculateInheritance } from "./logic/inheritanceEngine";

export default function App() {
  const [fiqh, setFiqh] = useState("hanafi");
  const [estate, setEstate] = useState(1000000);
  const [heirs, setHeirs] = useState({ wife: 1, daughter: 1 });

  const result = calculateInheritance(estate, heirs, fiqh);

  return (
    <div style={{ padding: 20 }}>
      <h1>Islamic Inheritance Calculator</h1>
      <FiqhSelector value={fiqh} onChange={setFiqh} />
      <CurrencySelector />
      <LanguageSelector />
      <input type="number" value={estate} onChange={e => setEstate(+e.target.value)} />
      <HeirInput heirs={heirs} setHeirs={setHeirs} />
      <ResultTable result={result} />
      <PieChart result={result} />
    </div>
  );
}
