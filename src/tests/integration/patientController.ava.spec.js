const test = require('ava');
const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Ensure the server is running at this URL



test.serial('POST /patients should create a new patient', async (t) => {
  johnDoe = {
    name: "John Doe",
    age: 30,
    gender: "Male",
    contact: "555-1234"
  };

  try {
    const response = await axios.post(`${BASE_URL}/api/patients`, johnDoe);

    // Assert the status code
    t.is(response.status, 201);

    // Assert the returned data matches expected
    t.is(response.data.name, johnDoe.name);
    t.is(response.data.age, johnDoe.age);
    t.is(response.data.gender, johnDoe.gender);
    t.is(response.data.contact, johnDoe.contact);

    // Assert the response contains an ID
    t.truthy(response.data.id);

    // store patient id
    id = response.data.id

  } catch (error) {
    t.fail(`API call failed: ${error.message}`);
    if (error.response) {
      console.error('Response error:', error.response.data);
    } else {
      console.error('Request error:', error.message);
    }
  }
});

test.serial('GET /patients/:id should return expected patient', async (t) => {

    janeDoe = {
        name: "Jane Doe",
        age: 28,
        gender: "Female",
        contact: "387-4994"
      };
  
    try {

      const setup = await axios.post(`${BASE_URL}/api/patients`, janeDoe);
      const id = await setup.data.id

      const response = await axios.get(`${BASE_URL}/api/patients/${id}`);
  
      // Assert the status code
      t.is(response.status, 200);
  
      // Assert the returned data matches the input
      t.is(response.data.name, janeDoe.name);
      t.is(response.data.age, janeDoe.age);
      t.is(response.data.gender, janeDoe.gender);
      t.is(response.data.contact, janeDoe.contact);
  
      // Assert the response contains an ID
      t.is(response.data.id, id);
  
    } catch (error) {
      t.fail(`API call failed: ${error.message}`);
      if (error.response) {
        console.error('Response error:', error.response.data);
      } else {
        console.error('Request error:', error.message);
      }
    }
  });

  test.serial('GET /patients should return all patients', async (t) => {
    try {

        const response = await axios.get(`${BASE_URL}/api/patients`);
    
        
        t.is(response.status, 200);
        t.true(response.data.length >= 2)
    
      } catch (error) {
        // Log the error for debugging
        t.fail(`API call failed: ${error.message}`);
        if (error.response) {
          console.error('Response error:', error.response.data);
        } else {
          console.error('Request error:', error.message);
        }
      }
  })
