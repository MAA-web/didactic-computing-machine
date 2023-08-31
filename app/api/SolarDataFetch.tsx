
export default async function SolarDataFetch(date: Date) {
    try {
      // Fetch the data and store the JSON response
      const response = await fetch("http://localhost:8000/data/2023-08-19.json");
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      let jsonData = await response.json(); // Store the JSON response
  
      //console.log(jsonData.dat.row[1].field[12]);
      return jsonData;
    } catch (error) {
      console.error('Error fetching solar data:', error);
      return null; // Handle the error or set data to null as needed
    }
  }
  