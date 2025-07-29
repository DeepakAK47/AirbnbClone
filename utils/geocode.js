// // utils/geocode.js
// const axios = require("axios");

// async function getCoordinates(address) {
//   try {
//     const response = await axios.get("https://nominatim.openstreetmap.org/search", {
//       params: {
//         q: address,
//         format: "json",
//         limit: 1
//       },
//       headers: {
//         "User-Agent": "airbnb-clone/1.0"
//       }
//     });

//     if (response.data.length === 0) return null;

//     return {
//       lat: parseFloat(response.data[0].lat),
//       lng: parseFloat(response.data[0].lon)
//     };
//   } catch (err) {
//     console.error("Geocoding failed:", err);
//     return null;
//   }
// }

// module.exports = getCoordinates;
