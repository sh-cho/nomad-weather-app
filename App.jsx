import React from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import * as Location from "expo-location";
import axios from "axios";
import Weather from "./Weather";

const OPENWEATHERMAP_API_KEY = "fill this";

export default class App extends React.Component {
  state = {
    isLoading: true,
  };

  getWeather = async (latitude, longitude) => {
    const params = {
      lat: latitude,
      lon: longitude,
      appid: OPENWEATHERMAP_API_KEY,
      units: "metric",
    };
    const {
      data: {
        main: { temp },
        weather,
      },
    } = await axios.get("http://api.openweathermap.org/data/2.5/weather", {
      params,
    });
    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temperature: temp,
    });
  };

  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();

      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  };

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const { isLoading, condition, temperature } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temperature={Math.round(temperature)} condition={condition} />
    );
  }
}
