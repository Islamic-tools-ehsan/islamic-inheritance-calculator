export default ({ value, onChange }: any) => (
  <select value={value} onChange={e => onChange(e.target.value)}>
    <option value="hanafi">Hanafi</option>
    <option value="shafii">Shafi‘i</option>
    <option value="maliki">Maliki</option>
    <option value="hanbali">Hanbali</option>
    <option value="ijma">General Sunni</option>
  </select>
);
