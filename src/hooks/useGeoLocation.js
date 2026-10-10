import { useEffect, useState } from "react";

const useGeoLocation = (options = {}) => {
  const [location, setLocation] = useState({});
  const [error, setError] = useState("");

  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setLocation({ latitude, longitude });
  };

  const handleError = (error) => {
    setError(error.message);
  };

  useEffect(() => {
    const { geoLocation } = navigator;

    if (!geoLocation) {
      setError("Geolocation이 지원되지 않습니다.");
      return;
    }

    geoLocation.getCurrentPosition(handleSuccess, handleError, options);
  }, [options]);

  return { location, error };
};

export default useGeoLocation;
