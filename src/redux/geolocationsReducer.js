import axios from "axios";

var initialState = {
  geolocations: [],
  dependentLocation: [],
  currLat: "",
  currLng: "",
  currLocation: "",

  isInBounds: true
};

const GET_GEOLOCATIONS = "GET_GEOLOCATIONS";
const FIND_DEPENDENT = "FIND_DEPENDENT";
const UPDATE_CURRENT_LOCATION = "UPDATE_LOCATION";
const IS_IN_BOUNDS = "IS_IN_BOUNDS";

export function getDependent() {
  return {
    type: FIND_DEPENDENT,
    payload: axios.get("/api/dependent")
  };
}

export function getGeolocations() {
  return {
    type: GET_GEOLOCATIONS,
    payload: axios.get("/api/geolocations")
  };
}
export function updateCurrentLocation() {
  return {
    type: UPDATE_CURRENT_LOCATION,
    payload: axios.post(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${
        process.env.REACT_APP_GEOLOCATION_API_KEY
      }`,
      {
        considerIp: "true",
        wifiAccessPoints: [{ macAddress: "98:01:a7:b4:be:e9" }]
      }
    )
  };
}
export function isInBounds(lat, lng) {
  console.log(initialState);
  return {
    type: IS_IN_BOUNDS,
    payload: axios.get(
      `https://api.fencer.io/v1.0/position/inside/${
        process.env.REACT_APP_DEV_KEY //CHANGED IT FROM REACT_APP_FENCER_API_KEY...WAS SAME THING...
      }`,
      {
        headers: {
          Authorization: `${process.env.REACT_APP_FENCER_API_KEY}`,
          "Lat-Pos": Number(lat),
          "Lng-Pos": Number(lng)
        }
      }
    )
  };
}

export default function geolocationsReducer(state = initialState, action) {
  var { currLat, currLng, currLocation } = state;
  switch (action.type) {
    case `${GET_GEOLOCATIONS}_FULFILLED`:
      return { ...state, geolocations: action.payload.data };
    case `${FIND_DEPENDENT}_FULFILLED`:
      return { ...state, dependentLocation: action.payload.data };
    case `${UPDATE_CURRENT_LOCATION}_FULFILLED`:
      return {
        ...state,
        currLocation: action.payload.data.location,
        currLat: action.payload.data.location.lat,
        currLng: action.payload.data.location.lng
      };
    case `${IS_IN_BOUNDS}_FULFILLED`:
      return { ...state, isInBounds: action.payload.data.data.inside };
    default:
      return state;
  }
}