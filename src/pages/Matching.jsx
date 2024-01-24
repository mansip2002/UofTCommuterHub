import React, { useState } from "react";

const MatchingSystem = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday'); // Default to Monday
  const [startTime, setStartTime] = useState(''); // Default to an empty string

  const [searchResults, setSearchResults] = useState([]);
  const [searchErrorMessage, setSearchErrorMessage] = useState('');

  const handleSearch = async () => {
    if (!startLocation || !endLocation || !dayOfWeek || !startTime) {
      setSearchErrorMessage('Please fill in all fields before searching.');
      return;
    }

    try {
      const response = await fetch(`https://uoftcommuterhubbackend-dntd.onrender.com/api/search?startLocation=${startLocation}&endLocation=${endLocation}&dayOfWeek=${dayOfWeek}&startTime=${startTime}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

      const data = await response.json();
      setSearchResults(data);
      setSearchErrorMessage('');

    } catch (error) {
      // For debugging purposes
      console.error('Logged search error is:', error);
    }
  };

  // Generate time options for the dropdown (00:00 to 23:00)
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : `${i}`;
    return `${hour}:00`;
  });

  return (
    <div className="matchingSystem">
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

      {/* Day of the Week and Start Time */}
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

        <label htmlFor="startTime">Start Time:</label>
        <select
          id="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="form-control rounded"
        >
          <option value="">Select Time</option>
          {timeOptions.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>

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
          <p style={{ color: 'red' }}>{searchErrorMessage}</p>
        </div>
      )}

      <br />

      <div className="container">
        <div className="row">
          <div className="row justify-content-center">
            <ul>
              {searchResults.map(result => (
                <div className="searchCard" key={result.user_id}>
                  <div className="searchBox">
                    <br />
                    <span style={{ color: 'blue' }}>Name:</span> {result.name},{' '}
                    <span style={{ color: 'blue' }}>Email:</span> {result.email},{' '}
                    <span style={{ color: 'blue' }}>Day of the Week:</span> {result.day_of_week},{' '}
                    <span style={{ color: 'blue' }}>Start Time:</span> {result.start_time},{' '}
                    <span style={{ color: 'blue' }}>Start Location:</span>{' '}{result.start_location},{' '}
                    <span style={{ color: 'blue' }}>End Location:</span>{' '}{result.end_location}
                    <br />
                  </div>
                  <br />
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingSystem;



