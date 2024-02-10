// If you're running into issues spinning up the server locally, please ask in the groupchat.
export const BACKEND_URL =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://maryam-capstone-backend.niceground-7634a6f1.eastus.azurecontainerapps.io";

// Generate time options for form dropdown (00:00 to 23:00)
export const START_TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i < 10 ? `0${i}` : `${i}`;
  return `${hour}:00`;
});
