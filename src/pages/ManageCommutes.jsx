import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getStorage } from "../lib/storage";
import { BACKEND_URL, START_TIME_OPTIONS } from "../lib/globals";

const ManageCommutes = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [commutes, setCommutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [startLocationSuggestions, setStartLocationSuggestions] = useState([]);
  const [endLocationSuggestions, setEndLocationSuggestions] = useState([]);
  const [isDisabledStartLocation, setIsDisabledStartLocation] = useState(false);
  const [isDisabledEndLocation, setIsDisabledEndLocation] = useState(false);

  const getUser = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/user?token=${getStorage("capstone-token")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        navigate("/sign-out");
      }

      if (!response.ok) {
        throw Error(`Fetch failed with status ${response.status}`);
      }

      const data = await response.json();

      setName(data.full_name);
    } catch (error) {
      setError("There was an error fetching your commutes. Please try again.");
      console.error("Error:", error);
    }
  };

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  const fetchLocationSuggestions = useCallback(
    debounce(async (query, setLocationSuggestions) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&bounded=1&viewbox=-141.002622009,41.6751050889,-52.6480987209,83.23324&countrycodes=CA`
        );
        const data = await response.json();
        setLocationSuggestions(data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    }, 500),
    []
  );

  const handleStartLocationChange = (event) => {
    const query = event.target.value;
    setStartLocation(query);
    fetchLocationSuggestions(query, setStartLocationSuggestions);
  };

  const handleEndLocationChange = (event) => {
    const query = event.target.value;
    setEndLocation(query);
    fetchLocationSuggestions(query, setEndLocationSuggestions);
  };

  const handleStartLocationClick = (suggestion) => {
    setStartLocation(suggestion.display_name);
    setStartLocationSuggestions([]);
  };

  const handleEndLocationClick = (suggestion) => {
    setEndLocation(suggestion.display_name);
    setEndLocationSuggestions([]);
  };

  const getCommutes = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/user_commutes?token=${getStorage("capstone-token")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      setCommutes(data);
    } catch (error) {
      setError("There was an error fetching your commutes. Please try again.");
      console.error("Error:", error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getUser();
    getCommutes();

    // Use the effect hook for navigation
    if (getStorage("capstone-token") == null) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      e.preventDefault();

      if (!startLocation || !endLocation || !startTime || !dayOfWeek) {
        setError(
          "Please fill in all required fields marked with an asteriks (*)."
        );
        throw Error("Missing start or end location.");
      }

      if (!isDisabledEndLocation && !isDisabledStartLocation) {
        setError("Please select at least one campus location.");
        throw Error("Missing start or end location.");
      }

      const response = await fetch(`${BACKEND_URL}/user_commute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: getStorage("capstone-token"),
          startTime,
          startLocation,
          endLocation,
          dayOfWeek,
          endTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("Commute already exists.");
        throw Error(data.error);
      }

      getCommutes();
      setMessage("Successfully added commute.");
    } catch (error) {
      console.error("Error:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="page-card">
      {/* HEADER */}
      <div>
        <h2>Welcome back, {name.split(" ")[0]}</h2>
        <div>
          Enter your travel details to add or remove commutes. All commutes are
          visible to UofT students for matching purposes.
        </div>
      </div>

      <form className="card-form-horizontal">
        {/* Start Location */}
        <div>
          <div className="d-flex gap-3">
            <label htmlFor="endLocation">
              Start<span className="text-danger">*</span>
            </label>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="check-end-campus"
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setStartLocation("40 St George St");
                    setIsDisabledStartLocation(true);
                  } else {
                    setStartLocation("");
                    setIsDisabledStartLocation(false);
                  }
                }}
              />
              <label className="form-check-label" htmlFor="check-end-campus">
                Campus
              </label>
            </div>
          </div>
          <input
            type="text"
            id="startLocation"
            value={startLocation}
            onChange={handleStartLocationChange}
            placeholder="Start Location"
            className="form-control rounded responsive-input"
            disabled={isDisabledStartLocation}
          />
          <div className="suggestions-container">
            <ul className="suggestions-list">
              {startLocationSuggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleStartLocationClick(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* End Location */}
        <div>
          <div className="d-flex gap-3">
            <label htmlFor="endLocation">
              End<span className="text-danger">*</span>
            </label>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="check-start-campus"
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setEndLocation("40 St George St");
                    setIsDisabledEndLocation(true);
                  } else {
                    setEndLocation("");
                    setIsDisabledEndLocation(false);
                  }
                }}
              />
              <label className="form-check-label" htmlFor="check-start-campus">
                Campus
              </label>
            </div>
          </div>
          <input
            type="text"
            id="endLocation"
            value={endLocation}
            onChange={handleEndLocationChange}
            placeholder="End Location"
            className="form-control rounded responsive-input"
            disabled={isDisabledEndLocation}
          />

          <div className="suggestions-container">
            <ul className="suggestions-list">
              {endLocationSuggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleEndLocationClick(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Day of the Week and Leave time */}
        <div>
          <label htmlFor="dayOfWeek">
            Day of the Week<span className="text-danger">*</span>
          </label>
          <select
            id="dayOfWeek"
            name="dayOfWeek"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="form-select rounded"
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
        </div>
        <div>
          <label htmlFor="startTime">
            Leave time<span className="text-danger">*</span>
          </label>
          <select
            id="startTime"
            name="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="form-select rounded"
          >
            <option value="">Select Time</option>
            {START_TIME_OPTIONS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="startTime">Return time</label>
          <select
            id="startTime"
            name="returnTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="form-select rounded"
          >
            <option value="">Select Time</option>
            {START_TIME_OPTIONS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-outline-primary"
          >
            Add
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && <div className="text-danger">{error}</div>}

      {/* Success Message */}
      {message && <div className="text-success">{message}</div>}

      {/* Existing Commutes */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Start Location</th>
              <th scope="col">End Location</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && commutes.length > 0 ? (
              commutes.map((result, i) => (
                <tr key={i}>
                  <td>{result.day_of_week}</td>
                  <td>{result.start_location}</td>
                  <td>{result.end_location}</td>
                  <td>{result.start_time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: "center", padding: "1rem 0" }}
                >
                  {isLoading ? (
                    <div className="spinner-border" role="status"></div>
                  ) : (
                    "No commutes added yet. Add a commute above to get started."
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCommutes;
