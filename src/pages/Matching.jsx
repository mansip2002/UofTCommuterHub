import { useState } from "react";

const TEST_DATA = (
  <>
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
        <tr key={123}>
          <td>Bob Loblaw</td>
          <td>
            <a href={`mailto:bob.loblaw1992.i.love.hotwheels@yahoo.net`}>
              bob.loblaw1992.i.love.hotwheels@yahoo.net
            </a>
          </td>
          <td>Monday, Tuesday</td>
          <td>8:00 AM</td>
          <td>123 Main St.</td>
          <td>Campus</td>
        </tr>
        <tr key={123}>
          <td>Kourtneigh Lee</td>
          <td>
            <a href={`mailto:bob.loblaw1992.i.love.hotwheels@yahoo.net`}>
              kourtneigh.lee@telecom.co.uk
            </a>
          </td>
          <td>Monday, Tuesday</td>
          <td>8:00 AM</td>
          <td>123 Main St.</td>
          <td>Campus</td>
        </tr>
      </tbody>
    </table>
  </>
);

const MatchingSystem = () => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday"); // Default to Monday
  const [startTime, setStartTime] = useState(""); // Default to an empty string

  const [searchResults, setSearchResults] = useState([]);
  const [searchErrorMessage, setSearchErrorMessage] = useState("");

  const handleSearch = async () => {
    if (!startLocation || !endLocation || !dayOfWeek || !startTime) {
      setSearchErrorMessage("Please fill in all fields before searching.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/search?startLocation=${startLocation}&endLocation=${endLocation}&dayOfWeek=${dayOfWeek}&startTime=${startTime}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setSearchResults(data || []);
      setSearchErrorMessage("");
    } catch (error) {
      // For debugging purposes
      console.error("Logged search error is:", error);
    }
  };

  // Generate time options for the dropdown (00:00 to 23:00)
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : `${i}`;
    return `${hour}:00`;
  });

  return (
    <div className="matchingSystem">
      <div>
        <div>
          <h2>Find a match</h2>
          <div>Enter your travel details to find a commute buddy.</div>
        </div>

        <div className="matchingSystemOptions">
          {/* Start Location */}
          <div className="searchRow">
            <label htmlFor="startLocation">Start Location:</label>
            <input
              type="text"
              id="startLocation"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="Start Location"
              className="form-control rounded"
            />
          </div>

          {/* End Location */}
          <div className="searchRow">
            <label htmlFor="endLocation">End Location:</label>
            <input
              type="text"
              id="endLocation"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              placeholder="End Location"
              className="form-control rounded"
            />
          </div>

          {/* Day of the Week and Leave time */}
          <div className="searchRow">
            <label htmlFor="dayOfWeek">Day of the Week:</label>
            <select
              id="dayOfWeek"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="form-control rounded"
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>
          <div className="searchRow">
            <label htmlFor="startTime">Leave time:</label>
            <select
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="form-control rounded"
            >
              <option value="">Select Time</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="searchRow">
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
            <div className="searchRow">
              <p style={{ color: "red" }}>{searchErrorMessage}</p>
            </div>
          )}

          <br />
        </div>

        <div className="searchResults">
          {searchResults.length > 0
            ? searchResults.map((result) => (
                <div className="searchCard" key={result.user_id}>
                  <div>
                    <div className="searchCardTitle">Name:</div>
                    <div>{result.name}</div>
                  </div>
                  <div>
                    <div className="searchCardTitle">Email:</div>
                    <a href={`mailto:${result.email}`}>{result.email}</a>
                  </div>
                  <div>
                    <div className="searchCardTitle">Day:</div>
                    <div>{result.day}</div>
                  </div>
                  <div>
                    <div className="searchCardTitle">Leave time:</div>
                    <div>{result.leave_time}</div>
                  </div>
                  <div>
                    <div className="searchCardTitle">Start location:</div>
                    <div>{result.start_location}</div>
                  </div>
                  <div>
                    <div className="searchCardTitle">End location:</div>
                    <div>{result.end_location}</div>
                  </div>
                </div>
              ))
            : TEST_DATA}
        </div>
      </div>
    </div>
  );
};

export default MatchingSystem;
