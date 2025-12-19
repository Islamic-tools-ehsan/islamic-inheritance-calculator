export default ({ result }: any) => (
  <table border={1}>
    <tbody>
      {result.map((r: any, i: number) => (
        <tr key={i}><td>{r.heir}</td><td>{r.amount}</td></tr>
      ))}
    </tbody>
  </table>
);
