// State
export const apiUrl = 'http://localhost:3000'
export const page = { size: 10, current: 1 }

// DOM Elements
export const searchInput = document.getElementById('searchInput') as HTMLInputElement
export const searchButton = document.getElementById('searchButton') as HTMLButtonElement
export const prevPageButton = document.getElementById('prevPage') as HTMLButtonElement
export const nextPageButton = document.getElementById('nextPage') as HTMLButtonElement
export const resultsBody = document.getElementById('resultsBody') as HTMLTableSectionElement
export const entriesInfo = document.getElementById('entriesInfo') as HTMLElement
export const pageNumbers = document.getElementById('pageNumbers') as HTMLElement
