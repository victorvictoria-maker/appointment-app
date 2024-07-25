import { google } from "googleapis";

// Get Google Calendar Client
export const getGoogleCalendarClient = (accessToken, refreshToken) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return google.calendar({ version: "v3", auth: oAuth2Client });
};

// Get HOD Availability
export const getHodAvailability = async (accessToken, refreshToken, email) => {
  const calendar = getGoogleCalendarClient(accessToken, refreshToken);
  const freeBusyResponse = await calendar.freebusy.query({
    requestBody: {
      timeMin: new Date().toISOString(),
      timeMax: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ).toISOString(),
      items: [{ id: email }],
    },
  });

  return freeBusyResponse.data.calendars[email].busy;
};

// Check Availability
export const checkAvailability = async (
  hodEmail,
  accessToken,
  refreshToken,
  time
) => {
  const calendar = getGoogleCalendarClient(accessToken, refreshToken);

  const freeBusyResponse = await calendar.freebusy.query({
    requestBody: {
      timeMin: new Date(time).toISOString(),
      timeMax: new Date(
        new Date(time).getTime() + 30 * 60 * 1000
      ).toISOString(),
      items: [{ id: hodEmail }],
    },
  });

  const busyTimes = freeBusyResponse.data.calendars[hodEmail].busy;
  return busyTimes.length === 0; // Return true if there are no busy times
};

// Book Appointment
export const bookAppointment = async (
  hodEmail,
  studentEmail,
  accessToken,
  refreshToken,
  time
) => {
  const calendar = getGoogleCalendarClient(accessToken, refreshToken);

  const event = {
    summary: `Appointment with ${studentEmail}`,
    start: {
      dateTime: new Date(time).toISOString(),
    },
    end: {
      dateTime: new Date(
        new Date(time).getTime() + 30 * 60 * 1000
      ).toISOString(),
    },
    attendees: [{ email: hodEmail }, { email: studentEmail }],
  };

  const response = await calendar.events.insert({
    calendarId: hodEmail,
    requestBody: event,
  });

  return response.data; // Return the event details
};
