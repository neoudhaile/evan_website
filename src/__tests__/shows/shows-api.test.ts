import { GET, POST } from '@/app/api/admin/content/shows/route'
import { NextRequest } from 'next/server'

// Mock content storage
jest.mock('@/lib/content-storage', () => ({
  ContentStorage: {
    load: jest.fn(),
    save: jest.fn(),
  }
}))

import { ContentStorage } from '@/lib/content-storage'

describe('/api/admin/content/shows', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('returns shows content successfully', async () => {
      const mockContent = {
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
          }
        ]
      }

      ContentStorage.load.mockResolvedValue(mockContent)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toMatchObject({
        success: true,
        content: mockContent,
        source: 'blob'
      })
    })

    it('returns 404 when content not found', async () => {
      ContentStorage.load.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toMatchObject({
        success: false,
        error: 'Content not found'
      })
    })

    it('handles storage errors gracefully', async () => {
      ContentStorage.load.mockRejectedValue(new Error('Storage error'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toMatchObject({
        success: false,
        error: 'Storage error'
      })
    })
  })

  describe('POST', () => {
    it('saves valid shows content successfully', async () => {
      const validContent = {
        title: 'Updated Show Dates',
        shows: [
          {
            date: '12/25/25',
            band: 'Holiday Concert',
            venue: 'Music Hall',
            time: '7:00pm-9:00pm'
          }
        ]
      }

      ContentStorage.save.mockResolvedValue(undefined)

      const request = new NextRequest('http://localhost/api/admin/content/shows', {
        method: 'POST',
        body: JSON.stringify(validContent),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toMatchObject({
        success: true,
        message: 'Shows content saved successfully'
      })
      expect(data.timestamp).toBeDefined()
      expect(ContentStorage.save).toHaveBeenCalledWith('shows', validContent)
    })

    it('handles empty shows array', async () => {
      const validContent = {
        title: 'No Shows Yet',
        shows: []
      }

      ContentStorage.save.mockResolvedValue(undefined)

      const request = new NextRequest('http://localhost/api/admin/content/shows', {
        method: 'POST',
        body: JSON.stringify(validContent),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('handles large number of shows', async () => {
      const manyShows = Array(50).fill(null).map((_, i) => ({
        date: `${i + 1}/1/26`,
        band: `Band ${i + 1}`,
        venue: `Venue ${i + 1}`,
        time: '8:00pm-10:00pm'
      }))

      const validContent = {
        title: 'Many Shows',
        shows: manyShows
      }

      ContentStorage.save.mockResolvedValue(undefined)

      const request = new NextRequest('http://localhost/api/admin/content/shows', {
        method: 'POST',
        body: JSON.stringify(validContent),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(ContentStorage.save).toHaveBeenCalledWith('shows', validContent)
    })

    it('validates content structure', async () => {
      const invalidContent = {
        wrongField: 'wrong value'
      }

      const request = new NextRequest('http://localhost/api/admin/content/shows', {
        method: 'POST',
        body: JSON.stringify(invalidContent),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toMatchObject({
        success: false,
        error: 'Invalid content data'
      })
    })

    it('handles null/undefined content', async () => {
      const request = new NextRequest('http://localhost/api/admin/content/shows', {
        method: 'POST',
        body: JSON.stringify(null),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toMatchObject({
        success: false,
        error: 'Invalid content data'
      })
    })

    it('handles non-object content', async () => {
      const request = new NextRequest('http://localhost/api/admin/content/shows', {
        method: 'POST',
        body: JSON.stringify('string content'),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toMatchObject({
        success: false,
        error: 'Invalid content data'
      })
    })

    it('handles invalid JSON', async () => {
      const request = new NextRequest('http://localhost/api/admin/content/shows', {
        method: 'POST',
        body: 'invalid json{',
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toMatchObject({
        success: false,
        error: 'Invalid content data'
      })
    })

    it('handles storage save errors', async () => {
      const validContent = {
        title: 'Test Shows',
        shows: [
          {
            date: '1/1/26',
            band: 'Test Band',
            venue: 'Test Venue',
            time: '8:00pm-10:00pm'
          }
        ]
      }

      ContentStorage.save.mockRejectedValue(new Error('Save failed'))

      const request = new NextRequest('http://localhost/api/admin/content/shows', {
        method: 'POST',
        body: JSON.stringify(validContent),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toMatchObject({
        success: false,
        error: 'Save failed'
      })
    })

    it('handles unknown errors gracefully', async () => {
      const validContent = {
        title: 'Test Shows',
        shows: []
      }

      ContentStorage.save.mockRejectedValue('Unknown error')

      const request = new NextRequest('http://localhost/api/admin/content/shows', {
        method: 'POST',
        body: JSON.stringify(validContent),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toMatchObject({
        success: false,
        error: 'Failed to save content'
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles special characters in show data', async () => {
      const validContent = {
        title: 'Shows with Special Characters',
        shows: [
          {
            date: '12/31/25',
            band: 'Band & The Group',
            venue: 'Venue "The Hall"',
            time: '9:00pm-12:00am'
          }
        ]
      }

      ContentStorage.save.mockResolvedValue(undefined)

      const request = new NextRequest('http://localhost/api/admin/content/shows', {
        method: 'POST',
        body: JSON.stringify(validContent),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('handles long venue and band names', async () => {
      const validContent = {
        title: 'Shows with Long Names',
        shows: [
          {
            date: '1/15/26',
            band: 'Very Long Band Name That Goes On And On And Includes Many Musicians',
            venue: 'The Very Long Venue Name With Multiple Words And Descriptive Elements',
            time: '7:30pm-11:30pm'
          }
        ]
      }

      ContentStorage.save.mockResolvedValue(undefined)

      const request = new NextRequest('http://localhost/api/admin/content/shows', {
        method: 'POST',
        body: JSON.stringify(validContent),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
});