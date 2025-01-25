import axios from "axios";
import { myToast } from "../helpers/extraFunctions";
import { setItem } from "../helpers/sessionStorage";
import { GET_DATA_ERROR, GET_DATA_LOADING, GET_DATA_SUCCESS } from "./actionTypes";
import { weatherAppAPI } from "../helpers/API"; // Ensure the correct path to the API.js file


const API_BASE_URL = "https://api.openweathermap.org/data/2.5"; // Ensure you include the base URL

export const getDataLoading = () => {
    return { type: GET_DATA_LOADING };
};

export const getDataSuccess = (payload) => {
    return { type: GET_DATA_SUCCESS, payload };
};

export const getDataError = () => {
    return { type: GET_DATA_ERROR };
};

export const syncData = (city, toast) => async (dispatch) => {
    try {
        dispatch(getDataLoading());

        // Fetch current weather data using /weather endpoint
        let weatherData = await axios.get(`/weather?q=${city}&appid=${weatherAppAPI}&units=metric`);
        weatherData = weatherData.data;

        // Only use the current weather data, no forecast data
        let payload = { weatherData };

        dispatch(getDataSuccess(payload));
        setItem("weather", payload);
        myToast(toast, "Data sync successfully", "success");
    } catch (err) {
        console.log(err);
        dispatch(getDataError());
        myToast(toast, "City weather data doesn't exist", "error");
    }
};


export const getWeatherByLocation = (toast) => async (dispatch) => {
    const success = async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            dispatch(getDataLoading());
            // Use current weather endpoint
            const weatherResponse = await axios.get(
                `${API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherAppAPI}`
            );
            const weatherData = weatherResponse.data;
            const payload = { weatherData }; // For free plan, exclude forecast data
            dispatch(getDataSuccess(payload));
            setItem("weather", payload);
            myToast(toast, "Your location weather updated", "success");
        } catch (error) {
            console.error(error);
            dispatch(getDataError());
        }
    };

    const error = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        myToast(toast, "Please turn on your location", "error");
    };

    navigator.geolocation.getCurrentPosition(success, error);
};

export const getWeatherByCity = (city, toast) => async (dispatch) => {
    try {
        dispatch(getDataLoading());
        // Use current weather endpoint
        const weatherResponse = await axios.get(
            `${API_BASE_URL}/weather?q=${city}&units=metric&appid=${weatherAppAPI}`
        );
        const weatherData = weatherResponse.data;
        const payload = { weatherData }; // For free plan, exclude forecast data
        dispatch(getDataSuccess(payload));
        setItem("weather", payload);
        myToast(toast, "City weather data updated", "success");
    } catch (error) {
        console.error(error);
        dispatch(getDataError());
        myToast(toast, "City weather data doesn't exist", "error");
    }
};
