import { hanafi } from "../fiqh/hanafi";
import { shafii } from "../fiqh/shafii";
import { maliki } from "../fiqh/maliki";
import { hanbali } from "../fiqh/hanbali";
import { ijma } from "../fiqh/ijma";

export function calculateInheritance(e:any,h:any,f:any){
  return ({hanafi,shafii,maliki,hanbali,ijma} as any)[f](e,h);
}
