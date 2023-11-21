import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  background: #f2f2f2;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background: #4d4dff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #3333cc;
  }
`;

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    startLocation: "",
    endLocation: "",
    commutingTimes: {
      monday: { start: "", end: "", isSelected: false },
      tuesday: { start: "", end: "", isSelected: false },
      wednesday: { start: "", end: "", isSelected: false },
      thursday: { start: "", end: "", isSelected: false },
      friday: { start: "", end: "", isSelected: false },
    },
  });

  const handleInputChange = (e, type) => {
    const { value } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [type]: value,
    }));
  };

  const handleCheckboxChange = (day) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      commutingTimes: {
        ...prevUserInfo.commutingTimes,
        [day]: {
          ...prevUserInfo.commutingTimes[day],
          isSelected: !prevUserInfo.commutingTimes[day].isSelected,
        },
      },
    }));
  };

  const handleCommutingTimesChange = (day, timeType, value) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      commutingTimes: {
        ...prevUserInfo.commutingTimes,
        [day]: {
          ...prevUserInfo.commutingTimes[day],
          [timeType]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
  
	// Sanitize user input
	const sanitizedUserInfo = {
	  name: sanitizeString(userInfo.name),
	  startLocation: sanitizeString(userInfo.startLocation),
	  endLocation: sanitizeString(userInfo.endLocation),
	  commutingTimes: Object.keys(userInfo.commutingTimes).map((day) => {
		const { start, end, isSelected } = userInfo.commutingTimes[day];
		return isSelected ? { day, start: sanitizeString(start), end: sanitizeString(end) } : null;
	  }).filter(Boolean),
	};
  
	try {
	  const response = await fetch("http://127.0.0.1:5000/user_profile", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify(sanitizedUserInfo),
	  });
  
	  if (!response.ok) {
		// Handle error
		console.error("Error submitting data to the server");
	  } else {
		// Handle success
		console.log("Data submitted successfully");
	  }
	} catch (error) {
	  console.error("Error:", error);
	}
  };
  
  // Helper function to sanitize strings
  const sanitizeString = (input) => {
	// Implement your sanitization logic here
	// For example, you can use a library like DOMPurify
	// or custom logic to strip HTML tags, prevent SQL injection, etc.
	return input; // Placeholder, replace with actual sanitization
  };
  

  return (
    <Container>
      <FormContainer>
        <h1>User Profile</h1>
        <form onSubmit={handleSubmit}>
          <Label>
            Name:
            <Input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={(e) => handleInputChange(e, "name")}
            />
          </Label>
          <Label>
            Start Location:
            <Input
              type="text"
              name="startLocation"
              value={userInfo.startLocation}
              onChange={(e) => handleInputChange(e, "startLocation")}
            />
          </Label>
          <Label>
            End Location:
            <Input
              type="text"
              name="endLocation"
              value={userInfo.endLocation}
              onChange={(e) => handleInputChange(e, "endLocation")}
            />
          </Label>
          {Object.keys(userInfo.commutingTimes).map((day) => (
            <div key={day}>
              <Label>
                {day.charAt(0).toUpperCase() + day.slice(1)}:
                <input
                  type="checkbox"
                  checked={userInfo.commutingTimes[day].isSelected}
                  onChange={() => handleCheckboxChange(day)}
                />
                {userInfo.commutingTimes[day].isSelected && (
                  <>
                    <Select
                      value={userInfo.commutingTimes[day].start}
                      onChange={(e) =>
                        handleCommutingTimesChange(day, "start", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select Start Time
                      </option>
                      {[...Array(24).keys()].map((hour) => (
                        <option key={hour} value={`${hour}:00`}>
                          {`${hour < 10 ? "0" : ""}${hour}:00`}
                        </option>
                      ))}
                    </Select>
                    <Select
                      value={userInfo.commutingTimes[day].end}
                      onChange={(e) =>
                        handleCommutingTimesChange(day, "end", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select End Time
                      </option>
                      {[...Array(24).keys()].map((hour) => (
                        <option key={hour} value={`${hour}:00`}>
                          {`${hour < 10 ? "0" : ""}${hour}:00`}
                        </option>
                      ))}
                    </Select>
                  </>
                )}
              </Label>
            </div>
          ))}
          <Button type="submit">Save</Button>
        </form>
      </FormContainer>
    </Container>
  );
};

export default UserProfile;
