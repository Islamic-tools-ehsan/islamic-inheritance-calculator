export default ({ heirs, setHeirs }: any) =>
  Object.keys(heirs).map(h => (
    <div key={h}>
      {h}
      <input type="number" value={heirs[h]}
        onChange={e => setHeirs({ ...heirs, [h]: +e.target.value })} />
    </div>
  ));
