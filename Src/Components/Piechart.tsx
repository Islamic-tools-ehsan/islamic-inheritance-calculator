import { Pie } from "react-chartjs-2";
export default ({ result }: any) =>
  <Pie data={{ labels: result.map((r:any)=>r.heir),
  datasets:[{data:result.map((r:any)=>r.amount)}] }} />;
