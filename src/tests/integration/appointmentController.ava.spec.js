const test = require('ava');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000'; // Ensure the server is running at this URL


test.serial('POST /appointments should process appointments from a CSV file with one appointment', async (t) => {
    const filePath = path.resolve(__dirname, 'fixtures/test-appointment.csv')

    // Ensure the file exists before proceeding
    t.true(fs.existsSync(filePath), `File does not exist: ${filePath}`);

    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Construct the multipart body manually
    const boundary = `----WebKitFormBoundary${Math.random().toString(16)}`;
    const body = Buffer.concat([
        Buffer.from(`--${boundary}\r\n`),
        Buffer.from(`Content-Disposition: form-data; name="file"; filename="${path.basename(filePath)}"\r\n`),
        Buffer.from('Content-Type: text/csv\r\n\r\n'),
        fileBuffer,
        Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

  try {
    const response = await axios.post(`${BASE_URL}/api/appointments`, body, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      }
    });

    t.is(response.status, 201);
    t.is(response.data.message, 'CSV processing event received. Processing will happen asynchronously.');

  } catch (error) {
    console.error(error);
    t.fail(`API call failed: ${error.message}`);
  }
});

test.serial('POST /appointments should process appointments from a CSV file with multiple appointments', async (t) => {
    const filePath = path.resolve(__dirname, 'fixtures/test-appointments.csv')

    // Ensure the file exists before proceeding
    t.true(fs.existsSync(filePath), `File does not exist: ${filePath}`);

    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Construct the multipart body manually
    const boundary = `----WebKitFormBoundary${Math.random().toString(16)}`;
    const body = Buffer.concat([
        Buffer.from(`--${boundary}\r\n`),
        Buffer.from(`Content-Disposition: form-data; name="file"; filename="${path.basename(filePath)}"\r\n`),
        Buffer.from('Content-Type: text/csv\r\n\r\n'),
        fileBuffer,
        Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

  try {
    const response = await axios.post(`${BASE_URL}/api/appointments`, body, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      }
    });

    t.is(response.status, 201);
    t.is(response.data.message, 'CSV processing event received. Processing will happen asynchronously.');

  } catch (error) {
    console.error(error);
    t.fail(`API call failed: ${error.message}`);
  }
});

test.serial('GET /appointments should return all appointments', async (t) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/appointments`);

    t.is(response.status, 200);
    t.true(Array.isArray(response.data)); 

    t.true(response.data.length > 0);
  } catch (error) {
    console.error(error);
    t.fail(`API call failed: ${error.message}`);
  }
});

test.serial('GET /appointments/:id should return a specific appointment', async (t) => {



  try {
    // get first appointment
    const res = await axios.get(`${BASE_URL}/api/appointments`);
    const firstAppointment = res.data[0]
    const id = firstAppointment.id

    // Fetch the same appointment by id
    const response = await axios.get(`${BASE_URL}/api/appointments/${id}`);

    t.is(response.status, 200); // Verify that the request was successful
    t.is(response.data.patient_id, firstAppointment.patient_id);
    t.is(response.data.doctor, firstAppointment.doctor);
    t.is(response.data.appointment_date, firstAppointment.appointment_date);
    t.is(response.data.reason, firstAppointment.reason);
  } catch (error) {
    console.error(error);
    t.fail(`API call failed: ${error.message}`);
  }
});

test.serial('GET /appointments with doctor query should return filtered appointments', async (t) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/appointments`, {
      params: { doctor: 'Dr. Smith' },
    });

    t.is(response.status, 200);
    t.true(response.data.every((appointment) => appointment.doctor === 'Dr. Smith'));
  } catch (error) {
    console.error(error);
    t.fail(`API call failed: ${error.message}`);
  }
});

test.serial('GET /appointments with patient_id query should return filtered appointments', async (t) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/appointments`, {
        params: { patient_id: 103 },
      });
  
      t.is(response.status, 200);
      t.true(response.data.every((appointment) => appointment.patient_id === 103));
    } catch (error) {
      console.error(error);
      t.fail(`API call failed: ${error.message}`);
    }
  });
