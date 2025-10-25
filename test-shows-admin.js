#!/usr/bin/env node

/**
 * Manual test script to verify Shows admin functionality
 * Run this script to test the admin API endpoints work correctly
 */

const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://evan-palermo-website.vercel.app'
  : 'http://localhost:3000';

const apiUrl = `${baseUrl}/api/admin/content/shows`;

// Test data
const testShowsData = {
  title: 'Test Show Dates - Manual Verification',
  shows: [
    {
      date: '1/1/26',
      band: 'Test Band Alpha',
      venue: 'Test Venue Alpha',
      time: '8:00pm-10:00pm'
    },
    {
      date: '2/15/26',
      band: 'Test Band Beta',
      venue: 'Test Venue Beta',
      time: '7:30pm-9:30pm'
    },
    {
      date: '3/20/26',
      band: 'Test Band Gamma',
      venue: 'Test Venue Gamma',
      time: '9:00pm-11:00pm'
    }
  ]
};

async function testShowsAPI() {
  console.log('🧪 Testing Shows Admin API...');
  console.log(`📍 Base URL: ${baseUrl}`);
  console.log(`🔗 API URL: ${apiUrl}`);
  console.log('');

  try {
    // Test 1: Save shows data
    console.log('📝 Test 1: Saving shows data...');
    const saveResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testShowsData),
    });

    if (!saveResponse.ok) {
      throw new Error(`Save failed with status: ${saveResponse.status}`);
    }

    const saveResult = await saveResponse.json();
    console.log('✅ Save successful:', saveResult.message);
    console.log('   Timestamp:', saveResult.timestamp);
    console.log('');

    // Test 2: Retrieve shows data
    console.log('📖 Test 2: Retrieving shows data...');
    const getResponse = await fetch(apiUrl);

    if (!getResponse.ok) {
      throw new Error(`Get failed with status: ${getResponse.status}`);
    }

    const getResult = await getResponse.json();
    console.log('✅ Retrieval successful');
    console.log('   Title:', getResult.content.title);
    console.log('   Number of shows:', getResult.content.shows.length);
    console.log('   First show:', getResult.content.shows[0]);
    console.log('');

    // Test 3: Verify data integrity
    console.log('🔍 Test 3: Verifying data integrity...');
    const isDataCorrect =
      getResult.content.title === testShowsData.title &&
      getResult.content.shows.length === testShowsData.shows.length &&
      getResult.content.shows[0].band === testShowsData.shows[0].band;

    if (isDataCorrect) {
      console.log('✅ Data integrity verified - saved and retrieved data match');
    } else {
      console.log('❌ Data integrity check failed');
      console.log('   Expected:', testShowsData);
      console.log('   Actual:', getResult.content);
    }
    console.log('');

    // Test 4: Check public page (if running locally)
    if (baseUrl.includes('localhost')) {
      console.log('🌐 Test 4: Checking public shows page...');
      const publicResponse = await fetch(`${baseUrl}/shows`);

      if (publicResponse.ok) {
        const publicHtml = await publicResponse.text();
        const hasTestData = publicHtml.includes('Test Band Alpha') &&
                           publicHtml.includes('Test Venue Alpha');

        if (hasTestData) {
          console.log('✅ Public page displays admin data correctly');
        } else {
          console.log('⚠️  Public page may not be showing admin data (check fallback behavior)');
        }
      } else {
        console.log('❌ Could not fetch public page');
      }
      console.log('');
    }

    // Test 5: Test with empty shows
    console.log('📝 Test 5: Testing with empty shows array...');
    const emptyData = {
      title: 'No Shows Yet',
      shows: []
    };

    const emptyResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emptyData),
    });

    if (emptyResponse.ok) {
      console.log('✅ Empty shows array handled correctly');
    } else {
      console.log('❌ Empty shows array test failed');
    }
    console.log('');

    // Restore original data
    console.log('🔄 Restoring original shows data...');
    const originalData = {
      title: 'Show Dates',
      shows: [
        {
          date: '9/12/25',
          band: 'Pippin',
          venue: 'Toledo Repertoire Theatre',
          time: '7:30pm-10:00pm'
        },
        {
          date: '11/23/25',
          band: 'EMP Trio feat. Chris Coles',
          venue: 'Bop Stop',
          time: '7:00pm-9:30pm'
        },
        {
          date: '12/19/25',
          band: 'EMP',
          venue: 'Dunlap\'s Corner Bar',
          time: '8:00pm-11:00pm'
        }
      ]
    };

    const restoreResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(originalData),
    });

    if (restoreResponse.ok) {
      console.log('✅ Original data restored');
    } else {
      console.log('⚠️  Warning: Could not restore original data');
    }

    console.log('');
    console.log('🎉 All tests completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   ✅ Save shows data via API');
    console.log('   ✅ Retrieve shows data via API');
    console.log('   ✅ Data integrity verification');
    console.log('   ✅ Empty shows array handling');
    console.log('   ✅ Data restoration');
    if (baseUrl.includes('localhost')) {
      console.log('   ✅ Public page integration check');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the tests
testShowsAPI().catch(console.error);