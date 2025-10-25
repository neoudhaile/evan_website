/**
 * Integration tests for Shows admin functionality in production
 * These tests verify that the admin interface works correctly for editing shows
 * and that changes are properly reflected on the public shows page.
 */

describe('Shows Admin Integration (Production)', () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const apiUrl = `${baseUrl}/api/admin/content/shows`

  // Test data for shows
  const testShowsData = {
    title: 'Test Show Dates',
    shows: [
      {
        date: '1/1/26',
        band: 'Test Band 1',
        venue: 'Test Venue 1',
        time: '8:00pm-10:00pm'
      },
      {
        date: '2/15/26',
        band: 'Test Band 2',
        venue: 'Test Venue 2',
        time: '7:30pm-9:30pm'
      },
      {
        date: '3/20/26',
        band: 'Test Band 3',
        venue: 'Test Venue 3',
        time: '9:00pm-11:00pm'
      }
    ]
  }

  describe('API Integration Tests', () => {
    it('should save shows data via POST request', async () => {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testShowsData),
      })

      expect(response.ok).toBe(true)

      const result = await response.json()
      expect(result.success).toBe(true)
      expect(result.message).toContain('saved successfully')
      expect(result.timestamp).toBeDefined()
    })

    it('should retrieve saved shows data via GET request', async () => {
      // First save the data
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testShowsData),
      })

      // Then retrieve it
      const response = await fetch(apiUrl)
      expect(response.ok).toBe(true)

      const result = await response.json()
      expect(result.success).toBe(true)
      expect(result.content).toMatchObject(testShowsData)
    })

    it('should handle empty shows array', async () => {
      const emptyData = {
        title: 'No Shows',
        shows: []
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emptyData),
      })

      expect(response.ok).toBe(true)

      const result = await response.json()
      expect(result.success).toBe(true)
    })

    it('should reject invalid data', async () => {
      const invalidData = {
        invalidField: 'invalid value'
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      })

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)

      const result = await response.json()
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('Data Persistence Tests', () => {
    it('should persist shows data across multiple requests', async () => {
      // Save initial data
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testShowsData),
      })

      // Retrieve data multiple times to ensure consistency
      for (let i = 0; i < 3; i++) {
        const response = await fetch(apiUrl)
        const result = await response.json()

        expect(result.success).toBe(true)
        expect(result.content.title).toBe(testShowsData.title)
        expect(result.content.shows).toHaveLength(testShowsData.shows.length)
        expect(result.content.shows[0]).toMatchObject(testShowsData.shows[0])
      }
    })

    it('should update existing data when saved again', async () => {
      // Save initial data
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testShowsData),
      })

      // Update the data
      const updatedData = {
        ...testShowsData,
        title: 'Updated Show Dates',
        shows: [
          ...testShowsData.shows,
          {
            date: '4/25/26',
            band: 'New Band',
            venue: 'New Venue',
            time: '8:30pm-10:30pm'
          }
        ]
      }

      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      // Verify the update
      const response = await fetch(apiUrl)
      const result = await response.json()

      expect(result.content.title).toBe('Updated Show Dates')
      expect(result.content.shows).toHaveLength(4)
      expect(result.content.shows[3].band).toBe('New Band')
    })
  })

  describe('Edge Case Tests', () => {
    it('should handle special characters in show data', async () => {
      const specialCharData = {
        title: 'Shows & Events',
        shows: [
          {
            date: '12/31/25',
            band: 'Band & The "Quoters"',
            venue: 'Café Münchën',
            time: '10:00pm-2:00am'
          }
        ]
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(specialCharData),
      })

      expect(response.ok).toBe(true)

      // Verify the data was saved correctly
      const getResponse = await fetch(apiUrl)
      const result = await getResponse.json()

      expect(result.content.shows[0].band).toBe('Band & The "Quoters"')
      expect(result.content.shows[0].venue).toBe('Café Münchën')
    })

    it('should handle large amounts of show data', async () => {
      const manyShows = Array(25).fill(null).map((_, i) => ({
        date: `${(i % 12) + 1}/${(i % 28) + 1}/26`,
        band: `Band ${i + 1}`,
        venue: `Venue ${i + 1}`,
        time: `${7 + (i % 4)}:00pm-${9 + (i % 4)}:00pm`
      }))

      const largeData = {
        title: 'Many Shows',
        shows: manyShows
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(largeData),
      })

      expect(response.ok).toBe(true)

      // Verify all shows were saved
      const getResponse = await fetch(apiUrl)
      const result = await getResponse.json()

      expect(result.content.shows).toHaveLength(25)
      expect(result.content.shows[0].band).toBe('Band 1')
      expect(result.content.shows[24].band).toBe('Band 25')
    })

    it('should handle concurrent save requests', async () => {
      const data1 = {
        title: 'Concurrent Test 1',
        shows: [{ date: '1/1/26', band: 'Band 1', venue: 'Venue 1', time: '8:00pm-10:00pm' }]
      }

      const data2 = {
        title: 'Concurrent Test 2',
        shows: [{ date: '2/2/26', band: 'Band 2', venue: 'Venue 2', time: '8:00pm-10:00pm' }]
      }

      // Send concurrent requests
      const [response1, response2] = await Promise.all([
        fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data1),
        }),
        fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data2),
        })
      ])

      expect(response1.ok).toBe(true)
      expect(response2.ok).toBe(true)

      // Verify one of them was saved (last write wins)
      const getResponse = await fetch(apiUrl)
      const result = await getResponse.json()

      expect(result.success).toBe(true)
      expect(['Concurrent Test 1', 'Concurrent Test 2']).toContain(result.content.title)
    })
  })

  describe('Performance Tests', () => {
    it('should handle API requests within reasonable time', async () => {
      const startTime = Date.now()

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testShowsData),
      })

      const endTime = Date.now()
      const duration = endTime - startTime

      expect(response.ok).toBe(true)
      expect(duration).toBeLessThan(5000) // Should complete within 5 seconds
    })

    it('should handle GET requests quickly', async () => {
      // First ensure there's data to retrieve
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testShowsData),
      })

      const startTime = Date.now()
      const response = await fetch(apiUrl)
      const endTime = Date.now()
      const duration = endTime - startTime

      expect(response.ok).toBe(true)
      expect(duration).toBeLessThan(3000) // Should complete within 3 seconds
    })
  })

  // Cleanup after tests
  afterAll(async () => {
    // Reset to original data or empty state
    const originalData = {
      title: 'Show Dates',
      shows: []
    }

    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(originalData),
      })
    } catch (error) {
      console.warn('Failed to cleanup test data:', error)
    }
  })
});