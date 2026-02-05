const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const INSURANCE_CREDENTIALS = {
  email: 'agent@beirutinsurance.com',
  password: 'company123'
};
const SEED_VIN = 'WBA1234567890ABCD';

async function runTest() {
  console.log('--- STARTING MVP FLOW TEST ---\n');

  try {
    // 1. LOGIN
    console.log('1. Logging in as Insurance Partner...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, INSURANCE_CREDENTIALS);
    const token = loginRes.data.token;
    console.log(`   Success! Logged in as: ${loginRes.data.companyName}`);
    console.log(`   Token received (truncated): ${token.substring(0, 20)}...\n`);

    // 2. FETCH VEHICLE (BEFORE)
    console.log(`2. Fetching Vehicle History for VIN: ${SEED_VIN}...`);
    const initialFetch = await axios.get(`${API_URL}/events/vehicle/${SEED_VIN}`);
    console.log(`   Found Vehicle: ${initialFetch.data.vehicle.year} ${initialFetch.data.vehicle.make} ${initialFetch.data.vehicle.model}`);
    console.log(`   Event Count: ${initialFetch.data.events.length}`);
    if (initialFetch.data.aiSummary) {
        console.log(`   AI Summary exists: "${initialFetch.data.aiSummary.summary.substring(0, 50)}"...\n`);
    } else {
        console.log(`   AI Summary: None yet (will be generated on next request if configured)\n`);
    }

    // 3. REPORT NEW EVENT
    console.log('3. Reporting a new "Inspection" event...');
    const newEvent = {
      vin: SEED_VIN,
      eventType: 'inspection',
      dateOccurred: new Date().toISOString(),
      description: 'Annual safety inspection passed. Brakes and tires in good condition.'
    };
    
    const reportRes = await axios.post(`${API_URL}/events`, newEvent, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   Event Reported! ID: ${reportRes.data._id}`);
    console.log(`   Description: "${reportRes.data.description}"\n`);

    // 4. FETCH VEHICLE (AFTER)
    console.log('4. Verifying Event was appended...');
    const finalFetch = await axios.get(`${API_URL}/events/vehicle/${SEED_VIN}`);
    const newCount = finalFetch.data.events.length;
    console.log(`   New Event Count: ${newCount} (Expected: ${initialFetch.data.events.length + 1})`);
    
    const latestEvent = finalFetch.data.events[0]; // Sorted by date desc
    if (latestEvent.description === newEvent.description) {
        console.log('   SUCCESS: The new event is at the top of the list.');
    } else {
        console.log('   WARNING: The new event was not found at the top.');
    }
    
    // Check AI Summary status (it might be cleared or regenerating)
    if (finalFetch.data.aiSummary) {
        console.log(`   AI Summary Status: Present (Note: Logic invalidates it on update, so this might be a fresh generation or old if async)`);
    }

    console.log('\n--- TEST COMPLETE: SYSTEM FUNCTIONAL ---');

  } catch (error) {
    console.error('\n!!! TEST FAILED !!!');
    if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Data:`, error.response.data);
    } else {
        console.error(error.message);
    }
  }
}

runTest();
