import SolarDataFetch from "../api/SolarDataFetch";
import Chart from "C:/Users/Ahmed/projects/SolarApp/data/scripts/chart.js";

let salt = new Date();

export default function() {
    return(SolarDataFetch(salt));
}