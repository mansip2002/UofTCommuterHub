import { useState,  useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL, START_TIME_OPTIONS } from "../lib/globals";
import { getStorage } from "../lib/storage";
import axios from "axios";

const MatchingSystem = () => {
  const navigate = useNavigate();
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchErrorMessage, setSearchErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startLocationSuggestions, setStartLocationSuggestions] = useState([]); 
  const [endLocationSuggestions, setEndLocationSuggestions] = useState([]); 

  useEffect(() => {
    // Use the effect hook for navigation
    if (getStorage("capstone-token") == null) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchLocationSuggestions = async (query, setLocationSuggestions) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&bounded=1&viewbox=-141.002622009,41.6751050889,-52.6480987209,83.23324&countrycodes=CA`
      );
      setLocationSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

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

  const handleSearch = async () => {
    setIsLoading(true);

    const token = getStorage("capstone-token");

    if (!startLocation || !endLocation || !dayOfWeek || !startTime) {
      setSearchErrorMessage("Please fill in all fields before searching.");
      return;
    }

    try {
      let url = `${BACKEND_URL}/search?startLocation=${startLocation}&endLocation=${endLocation}&dayOfWeek=${dayOfWeek}&startTime=${startTime}`;

      if (token) {
        url += `&token=${token}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setSearchResults(data);
      setSearchErrorMessage("");
    } catch (error) {
      // For debugging purposes
      console.error("Logged search error is:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="page-card">
      {/* HEADER */}
      <div>
        <h2>Find a match</h2>
        <div>Enter your travel details to find a commute buddy.</div>
      </div>

      {/* SEARCH FORM */}
      <form className="card-form-horizontal">
        {/* Start Location */}
        <div>
          <label htmlFor="startLocation">Start Location:</label>
          <input
            type="text"
            id="startLocation"
            value={startLocation}
            onChange={handleStartLocationChange}
            placeholder="Start Location"
            className="form-control rounded"
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
          <label htmlFor="endLocation">End Location:</label>
          <input
            type="text"
            id="endLocation"
            value={endLocation}
            onChange={handleEndLocationChange}
            placeholder="End Location"
            className="form-control rounded"
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
          <label htmlFor="dayOfWeek">Day of the Week:</label>
          <select
            id="dayOfWeek"
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
          <label htmlFor="startTime">Leave time:</label>
          <select
            id="startTime"
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
          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearch}
            className="btn btn-outline-primary"
          >
            Search
          </button>
        </div>

        {/* Search Error Message */}
        {searchErrorMessage && (
          <div>
            <p style={{ color: "red" }}>{searchErrorMessage}</p>
          </div>
        )}

        <br />
      </form>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Day</th>
            <th scope="col">Leave Time</th>
            <th scope="col">Start Location</th>
            <th scope="col">End Location</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading && searchResults.length > 0 ? (
            searchResults.map((result, i) => (
              <tr key={i}>
                <td>{result.full_name}</td>
                <td>
                  <a href={`mailto:${result.email}`}>{result.email}</a>
                </td>
                <td>{result.day_of_week}</td>
                <td>{result.start_time}</td>
                <td>{result.start_location}</td>
                <td>{result.end_location}</td>
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
                  "Adjust the search criteria to find a match."
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MatchingSystem;
