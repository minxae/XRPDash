import * as w_1 from "./widgets/widget-wallet-info.js";
import * as w_2 from "./widgets/widget-tx-info.js";
import * as w_3 from  "./widgets/widget-holdings-info.js"

// List of widgets that are on the dashboard
export function setAllData(address){
    w_1.setData(address);
    w_2.setData(address);
}
