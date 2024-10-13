import type { ApiResponse, Resource, Metadata } from './types'
import {
  apiUrl,
  page,
  searchInput,
  searchButton,
  prevPageButton,
  nextPageButton,
  resultsBody,
  entriesInfo,
  pageNumbers,
} from './constants'

// Event Listeners
searchButton.addEventListener('click', async () => {
  page.current = 1
  await fetchData()
})

searchInput.addEventListener('keypress', async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    page.current = 1
    await fetchData()
  }
})

prevPageButton.addEventListener('click', async () => {
  if (page.current > 1) {
    page.current--
    await fetchData()
  }
})

nextPageButton.addEventListener('click', async () => {
  page.current++
  await fetchData()
})

// Functions
async function fetchData(): Promise<void> {
  const query = searchInput.value
  const url = new URL(`${apiUrl}/search`)

  url.searchParams.append('q', query)
  url.searchParams.append('page', page.current.toString())
  url.searchParams.append('size', page.size.toString())

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    const data: ApiResponse = await response.json()
    renderTable(data.resources)
    renderPagination(data.metadata)
  } catch (error) {
    console.error('Error fetching data:', error)
    renderTable(null)
  }
}

function renderTable(resources: Resource[] | null): void {
  resultsBody.innerHTML = '' // Clear previous results

  if (!resources || resources.length === 0) {
    const row = document.createElement('tr')
    row.innerHTML = `
        <td colspan="4" class="py-4 px-6 text-gray-500 text-center">No results found</td>
      `
    resultsBody.appendChild(row)
    return
  }

  resources.forEach((resource) => {
    const row = document.createElement('tr')
    row.classList.add('bg-white', 'hover:bg-gray-100', 'transition-all')

    row.innerHTML = `
        <td class="py-4 px-6 text-gray-800">${resource.id}</td>
        <td class="py-4 px-6 text-gray-800">${resource.type}</td>
        <td class="py-4 px-6 text-gray-800">${new Date(resource.updatedAt).toLocaleString()}</td>
        <td class="py-4 px-6 text-gray-800">${resource.lastVersion.revision}</td>
      `

    resultsBody.appendChild(row)
  })
}

function renderPagination(metadata: Metadata): void {
  entriesInfo.textContent = `Showing ${Math.min(metadata.totalCount, page.size)} of ${metadata.totalCount} entries`
  pageNumbers.textContent = `Page ${page.current} of ${metadata.totalPages}`

  prevPageButton.disabled = metadata.currentPage === 1
  nextPageButton.disabled = metadata.currentPage === metadata.totalPages
}

// Initial data fetch on page load
void fetchData()
