import SolarDataFetch from "../api/SolarDataFetch";
import Chart from "C:/Users/Ahmed/projects/SolarApp/data/scripts/chart.js";
import Crypto from "C:/Users/Ahmed/projects/SolarApp/data/scripts/crypto-js.js";

let salt = new Date();

export default async function() {
    
    let res = await SolarDataFetch(salt);
    
    console.log(res.dat.row[1].field[12]);

    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$





    //requires("data/scripts/chart.js");
//requires("data/scripts/crypto-js.js");
var Username: String;
var Password: String;

/*document.addEventListener("DOMContentLoaded", function() {
    // JavaScript code here
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('update_input').value = currentDate;
});*/

/*function GetUsernameAndPassword() {
  console.log("Getting Username and Password");
  
  Username = document.getElementById("Username").value;
  Password = document.getElementById("Password").value;

  console.log(Username + ', ' + Password);
  
  let LoginElements = document.getElementsByClassName("Login");
  
  for (let index = 0; index < LoginElements.length; index++) {
    LoginElements[index].style.display = "none";
  }

  let updateElements = document.getElementsByClassName("update");
  
  for (let index = 0; index < updateElements.length; index++) {
    updateElements[index].style.display = "block";
  }

  const currentDate = new Date().toISOString().split('T')[0];
  document.getElementById('update_input').value = currentDate;
}*/

var MyChart;

// Getting the Token and the Secret for the querying of the database at shinemonitor
async function getTandS() {
    let TSArray: String[] = [];
    let Token;
    let Secret;
//    let Username = "";
//    let Password = "";
    let Salt = Date.now();
    let baseAction = `&action=authSource&usr=${Username.replace(' ', '+')}&company-key=bnrl_frRFjEz8Mkn&i18n=en_US&lang=en_US&source=1&_app_client_=android&_app_id_=wifiapp.volfw.watchpower&_app_version_=1.2.0.0`;
    let HashedPassword = await sha1(Password);
    
    let url = await getLogindUrl(baseAction, Salt, HashedPassword);
    
    console.log('Login URL: ' + url);

    await fetch(url)
    .then(
        response => {
            return response.json()
        }
    ).then(
        data => {
            Token = data.dat.token;
            Secret = data.dat.secret;
            TSArray.push(Token);
            TSArray.push(Secret);
        }
    )
  return TSArray;
}

/*
function hi(params) {
  console.log("HI!! How are you doing (Made with nvim)");
}
*/

function calculateArea(GraphData: []) {
    let area = 0;

    for (let i = 0; i < GraphData.length - 1; i++) {
        const wattage1 = GraphData[i];
        const wattage2 = GraphData[i + 1];
        const timeInterval = 5/60; // Assuming a uniform time interval of 5/60 units i.e 5 mins

        // Calculating the area of the trapezoid and adding it to the total area
        const trapezoidArea = (1/2) * (wattage1 + wattage2) * timeInterval;
        area += trapezoidArea;
    }

    return area;
}

function main(url: String) {

    let SolarEnergyArray: Number[] = [];
    let TimeStamp: String[] = [];
    let ACOutput: Number[] = [];

    console.log("In main: " + url);
    fetch(url: String).then(
        response => {
            if (response.status != 304 && response.status != 200) {
                document.getElementById('my_chart_errors').innerText = "\t\t\nSorry no data for this date is present !";
                document.getElementById("solar_output_day").textContent = "";
                document.getElementById("home_usage_day").textContent = ""
                return null;
            }
            document.getElementById('my_chart_errors').innerText = "";
            return response.json();
        }
    ).then(
        data => {
            for (let index = 0; index < data.dat.row.length; index++) {
                //Getting the Solar Energy data and storing in an Array (ylables)
                SolarEnergyArray.push(Number(data.dat.row[index].field[42]));

                //Getting the AC Power Usage data and storing it in an array (ylables)
                ACOutput.push(Number(data.dat.row[index].field[12]));
                
                //Getting the TimeStamp and storing it in an array. (xlables)
                TimeStamp.push(data.dat.row[index].field[1].split(" ")[1])
            }
        }
        ).then( () => {
            // Get the canvas element
            const ctx = document.getElementById('my_chart');

            // Check if a chart already exists
            if (MyChart) {
                // If the chart exists, update its data
                MyChart.data.labels = TimeStamp;
                MyChart.data.datasets[0].data = SolarEnergyArray;
                MyChart.data.datasets[1].data = ACOutput;
                MyChart.update();
            } else {       
            
                MyChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        
                        // Data to fill the chart with

                        labels: TimeStamp, // xlables
                        datasets: [ // ylables
                        {
                            label: 'Solar Production',
                            fill: 'origin',
                            //data: [12, 19, 3, 5, 2, 3],
                            data: SolarEnergyArray,
                            borderWidth: 1
                        },
                        {
                            label: 'Home Usage',
                            fill: "origin",
                            //data: [12, 19, 3, 5, 2, 3],
                            data: ACOutput,
                            borderWidth: 1
                        }
                    ]
                    },
                    options: {
                        scales: {
                        x: {
                            title: {
                            display: true,
                            text: 'Time (H:M:S)',
                            },
                        },

                        y: {
                            title: {
                            display:true,
                            text: "Watts(J/s)"
                            },
                            beginAtZero: true,
                        }
                        }
                    }
                })};
            
            //<!----------------------------------------------------------------------------------------------------->

            document.getElementById("solar_output_day").textContent = "Solar Energy Produced: " + (calculateArea(SolarEnergyArray)/1000).toFixed(2) + " Killo Watt Hours";
            document.getElementById("home_usage_day").textContent = "Home Usage: " + (calculateArea(ACOutput)/1000).toFixed(2) + " Killo Watt Hours";
            
            //<!----------------------------------------------------------------------------------------------------->

        }
    );
};

// For testing purposes only
// Put this function in the button
async function UpdateData() {
    let Date = document.querySelector("#update_input").value;
    MyChart.destroy();
    main("http://localhost:3000/" + Date + ".json");
    console.log(Date);
    console.log(sha1(Date));
    console.log("http://localhost:3000/" + Date + ".json");
};

//--------------------------------------- Cryptography -----------------------------------------------//

/*
async function sha1(bArr) {
    try {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha1');
        hash.update(bArr);
        return hash.digest("hex").toString();
    } catch (error) {
        console.error("call SHA-1 function failed:", error.toString());
        return null;
    }
}
*/

async function sha1(cArr : string) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(cArr);

        const buffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(buffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    } catch (error: Error) {
        console.error("call SHA-1 function failed:", error.toString());
        return null;
    }
}

async function getLogindUrl(baseAction: String, Salt: String, HashedPassword: String) {
    let sign = await sha1(Salt + HashedPassword + baseAction);
    let url = `http://api.shinemonitor.com/public/?sign=${sign}&salt=${Salt}${baseAction}`;
    return url;
}

async function getFormattedUrl(baseAction: String, Salt: String) {
    let sign = await sha1(Salt + Secret + Token + baseAction);
    let url = `http://api.shinemonitor.com/public/?sign=${sign}&salt=${Salt}&token=${Token}${baseAction}`;
    return url;
}

let counter = 0;
var Token: String;
var Secret: String;
var TSArray: String[];
async function NewAPICall() {
    
    // Salt
    let Salt = Date.now();
    
    let date = document.querySelector("#update_input").value;

    if (counter == 0) {
        TSArray = await getTandS();
        Token = TSArray[0];
        Secret = TSArray[1];
        counter++;
    } else {
        console.log("Already Stored Token and Secret: " + Token + ', ' + Secret);
    }

    console.log(date);
    console.log(TSArray);

    let baseActionQuery = `&action=queryDeviceDataOneDay&pn=W0820091184710&devcode=2400&sn=92932010100438&devaddr=1&date=${date}&i18n=en_US&lang=en_US&source=1&_app_client_=android&_app_id_=wifiapp.volfw.watchpower&_app_version_=1.2.0.0`;

    let sign = await sha1(Salt + Secret + Token + baseActionQuery);
    let url = `http://api.shinemonitor.com/public/?sign=${sign}&salt=${Salt}&token=${Token}${baseActionQuery}`;

    console.log("In NewAPICall: " + url);

    //MyChart.destroy();
    main(url);
}

//-------------------------------------------------------------------------------------------//


//document.addEventListener("DOMContentLoaded",() => {
    //main("http://localhost:3000/2023-08-23.json")
    //main("https://api.shinemonitor.com/public/?sign=cdcaf33d79bcd16737767a481aae358d561924d7&salt=1692738603930&token=6cb48f07fa045267adfceadf1a7f8d57e650f611293f873205a8a20c5422a693&action=queryDeviceDataOneDay&pn=W0820091184710&devcode=2400&sn=92932010100438&devaddr=1&date=2023-08-23&i18n=en_US&lang=en_US&source=1&_app_client_=android&_app_id_=wifiapp.volfw.watchpower&_app_version_=1.2.0.0")
    //main("http://api.shinemonitor.com/public/?sign=5e9441360750b3f09145115ef5d6a1259a9f3a29&salt=1692945743408&token=6cb48f07fa045267adfceadf1a7f8d57e650f611293f873205a8a20c5422a693&action=queryDeviceDataOneDay&pn=W0820091184710&devcode=2400&sn=92932010100438&devaddr=1&date=2023-08-24&i18n=en_US&lang=en_US&source=1&_app_client_=android&_app_id_=wifiapp.volfw.watchpower&_app_version_=1.2.0.0")
    //main("http://api.shinemonitor.com/public/?sign=edc729277875ab35150f3b49d8d8b15ac7eaa1b5&salt=1692945688858&token=6cb48f07fa045267adfceadf1a7f8d57e650f611293f873205a8a20c5422a693&action=queryDeviceDataOneDay&pn=W0820091184710&devcode=2400&sn=92932010100438&devaddr=1&date=2023-08-25&i18n=en_US&lang=en_US&source=1&_app_client_=android&_app_id_=wifiapp.volfw.watchpower&_app_version_=1.2.0.0")
    //main("http://api.shinemonitor.com/public/?sign=9fcca6770cadced76d3d9a67afa67586e290bf2d&salt=1692998271093&token=3e7c9222aa94bfe8a07917851732c3e65559d2d4f6edbeed5d843999e5e857fa&action=queryDeviceDataOneDay&pn=W0820091184710&devcode=2400&sn=92932010100438&devaddr=1&date=2023-08-26&i18n=en_US&lang=en_US&source=1&_app_client_=android&_app_id_=wifiapp.volfw.watchpower&_app_version_=1.2.0.0")
    //document.removeEventListener("DOMContentLoaded",
    //console.log("haaaaaaaaaaaaaaaaaaaa       removed   aaaaaaaaaaahahaha"));
//});






    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$



    return(
        <>
        <div>
            <canvas id="myChart"></canvas>
        </div>
        </>
    );
}