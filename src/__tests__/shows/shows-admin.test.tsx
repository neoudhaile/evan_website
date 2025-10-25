import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShowsEditor from '@/app/admin/components/ShowsEditor'

// Mock fetch
global.fetch = jest.fn()

const mockShowsContent = {
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

describe('Shows Admin Editor', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    (fetch as jest.Mock).mockClear()

    // Mock successful content loading
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        content: mockShowsContent
      })
    })
  })

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<ShowsEditor />)
      expect(screen.getByText('Show Dates')).toBeInTheDocument()
    })

    it('shows loading state initially', () => {
      render(<ShowsEditor />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.getByText('Loading current Shows content...')).toBeInTheDocument()
    })

    it('loads and displays existing shows', async () => {
      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('Show Dates')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Pippin')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Toledo Repertoire Theatre')).toBeInTheDocument()
        expect(screen.getByDisplayValue('EMP Trio feat. Chris Coles')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Bop Stop')).toBeInTheDocument()
      })
    })
  })

  describe('Show Management', () => {
    it('displays correct number of shows', async () => {
      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByText('Shows (2)')).toBeInTheDocument()
        expect(screen.getByText('Show #1')).toBeInTheDocument()
        expect(screen.getByText('Show #2')).toBeInTheDocument()
      })
    })

    it('allows adding a new show', async () => {
      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByText('Shows (2)')).toBeInTheDocument()
      })

      const addButton = screen.getByText('+ Add Show')
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Shows (3)')).toBeInTheDocument()
        expect(screen.getByText('Show #3')).toBeInTheDocument()
      })
    })

    it('allows editing show fields', async () => {
      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('Pippin')).toBeInTheDocument()
      })

      const bandInput = screen.getByDisplayValue('Pippin')
      await user.clear(bandInput)
      await user.type(bandInput, 'Updated Band Name')

      expect(bandInput).toHaveValue('Updated Band Name')
    })

    it('allows deleting a show', async () => {
      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByText('Shows (2)')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.getByText('Shows (1)')).toBeInTheDocument()
      })
    })
  })

  describe('Form Validation', () => {
    it('allows editing all show fields', async () => {
      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('9/12/25')).toBeInTheDocument()
      })

      // Test editing date
      const dateInput = screen.getByDisplayValue('9/12/25')
      await user.clear(dateInput)
      await user.type(dateInput, '12/25/25')
      expect(dateInput).toHaveValue('12/25/25')

      // Test editing time
      const timeInput = screen.getByDisplayValue('7:30pm-10:00pm')
      await user.clear(timeInput)
      await user.type(timeInput, '8:00pm-11:00pm')
      expect(timeInput).toHaveValue('8:00pm-11:00pm')

      // Test editing venue
      const venueInput = screen.getByDisplayValue('Toledo Repertoire Theatre')
      await user.clear(venueInput)
      await user.type(venueInput, 'New Venue')
      expect(venueInput).toHaveValue('New Venue')
    })

    it('handles empty shows gracefully', async () => {
      // Mock empty content
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          content: { title: 'Show Dates', shows: [] }
        })
      })

      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByText('Shows (0)')).toBeInTheDocument()
      })

      const addButton = screen.getByText('+ Add Show')
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('Shows (1)')).toBeInTheDocument()
        expect(screen.getByText('Show #1')).toBeInTheDocument()
      })
    })
  })

  describe('Save Functionality', () => {
    it('saves content when save button is clicked', async () => {
      // Mock successful save
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })

      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('Show Dates')).toBeInTheDocument()
      })

      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/admin/content/shows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('Show Dates')
        })
      })
    })

    it('shows success state after saving', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })

      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByText('Save Changes')).toBeInTheDocument()
      })

      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText('✓ Saved')).toBeInTheDocument()
      })
    })

    it('handles save errors gracefully', async () => {
      // Mock error console.error to avoid test output noise
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByText('Save Changes')).toBeInTheDocument()
      })

      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to save:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Refresh Functionality', () => {
    it('has a refresh button', async () => {
      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByText('🔄 Refresh')).toBeInTheDocument()
      })
    })

    it('refreshes content when refresh button is clicked', async () => {
      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByText('🔄 Refresh')).toBeInTheDocument()
      })

      // Mock another API call for refresh
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          content: {
            title: 'Refreshed Title',
            shows: [{ date: '1/1/26', band: 'New Band', venue: 'New Venue', time: '8:00pm-10:00pm' }]
          }
        })
      })

      const refreshButton = screen.getByText('🔄 Refresh')
      await user.click(refreshButton)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/admin/content/shows')
      })
    })
  })

  describe('Preview Functionality', () => {
    it('shows a preview section', async () => {
      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByText('Preview')).toBeInTheDocument()
      })
    })

    it('displays preview table with shows', async () => {
      render(<ShowsEditor />)

      await waitFor(() => {
        const preview = screen.getByText('Preview').closest('div')
        expect(preview).toBeInTheDocument()

        // Check for table headers
        expect(screen.getByText('Date')).toBeInTheDocument()
        expect(screen.getByText('Band/Desc.')).toBeInTheDocument()
        expect(screen.getByText('Venue')).toBeInTheDocument()
        expect(screen.getByText('Time')).toBeInTheDocument()
      })
    })

    it('limits preview to first 5 shows and shows count', async () => {
      // Mock content with more than 5 shows
      const manyShows = Array(8).fill(null).map((_, i) => ({
        date: `${i + 1}/1/26`,
        band: `Band ${i + 1}`,
        venue: `Venue ${i + 1}`,
        time: '8:00pm-10:00pm'
      }))

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          content: { title: 'Show Dates', shows: manyShows }
        })
      })

      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByText('Shows (8)')).toBeInTheDocument()
        expect(screen.getByText('Showing first 5 shows. Total: 8')).toBeInTheDocument()
      })
    })
  })

  describe('API Integration', () => {
    it('calls the correct API endpoint for loading', async () => {
      render(<ShowsEditor />)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/admin/content/shows')
      })
    })

    it('sends the correct data structure when saving', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })

      render(<ShowsEditor />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('Show Dates')).toBeInTheDocument()
      })

      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      await waitFor(() => {
        const call = (fetch as jest.Mock).mock.calls.find(call => call[1]?.method === 'POST')
        expect(call).toBeDefined()

        const body = JSON.parse(call[1].body)
        expect(body).toHaveProperty('title')
        expect(body).toHaveProperty('shows')
        expect(Array.isArray(body.shows)).toBe(true)

        if (body.shows.length > 0) {
          expect(body.shows[0]).toHaveProperty('date')
          expect(body.shows[0]).toHaveProperty('band')
          expect(body.shows[0]).toHaveProperty('venue')
          expect(body.shows[0]).toHaveProperty('time')
        }
      })
    })
  })
});