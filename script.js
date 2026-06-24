const API_KEY = '9e526f0d81d00bfa25bb5d4285f48a17'
const moviesGrid = document.getElementById('movies-grid')
const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')

function createMovieCard(movie) {
    const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    const year = movie.release_date.slice(0, 4)
    
    return `
        <div class="movie-card" data-id="${movie.id}">
            <span class="rating-badge">⭐ ${movie.vote_average.toFixed(1)}</span>
            <img src="${posterUrl}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-year">${year}</p>
            </div>
        </div>
    `
}

async function getPopularMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ru-RU`)
    const data = await response.json()
    
    const movieCards = data.results.map(function(movie) {
        return createMovieCard(movie)
    })
    
    moviesGrid.innerHTML = movieCards.join('')
}

async function searchMovies() {
    const query = searchInput.value
    moviesGrid.innerHTML = '<p class="status-message">Загрузка...</p>'
    
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ru-RU&query=${query}`)
    const data = await response.json()
    
    if (data.results.length === 0) {
        moviesGrid.innerHTML = '<p class="status-message">Ничего не найдено 😕</p>'
        return
    }
    
    const movieCards = data.results.map(function(movie) {
        return createMovieCard(movie)
    })
    
    moviesGrid.innerHTML = movieCards.join('')
}

const modal = document.getElementById('modal')
const modalBody = document.getElementById('modal-body')
const modalClose = document.getElementById('modal-close')

async function getMovieDetails(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ru-RU`)
    const data = await response.json()
    
    const posterUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`
    const genres = data.genres.map(function(genre) {
        return genre.name
    }).join(', ')
    
    modalBody.innerHTML = `
        <img src="${posterUrl}" alt="${data.title}" style="width: 200px; border-radius: 12px; margin-bottom: 16px;">
        <h2>${data.title}</h2>
        <p>⭐ ${data.vote_average.toFixed(1)} · ${data.release_date.slice(0, 4)} · ${data.runtime} мин</p>
        <p style="margin-top: 12px; color: #c4b5fd;">${genres}</p>
        <p style="margin-top: 16px;">${data.overview}</p>
    `
    
    modal.classList.add('open')
}

searchBtn.addEventListener('click', searchMovies)

searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchMovies()
    }
})

modalClose.addEventListener('click', function() {
    modal.classList.remove('open')
})

moviesGrid.addEventListener('click', function(event) {
    const card = event.target.closest('.movie-card')
    if (card) {
        const movieId = card.dataset.id
        getMovieDetails(movieId)
    }
})

modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.classList.remove('open')
    }
})

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        modal.classList.remove('open')
    }
})
const genresBar = document.getElementById('genres-bar')

async function getGenres() {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=ru-RU`)
    const data = await response.json()
    
    const genreButtons = data.genres.map(function(genre) {
        return `<button class="genre-btn" data-genre-id="${genre.id}">${genre.name}</button>`
    })
    
    genresBar.innerHTML = genreButtons.join('')
}
async function getMoviesByGenre(genreId) {
    moviesGrid.innerHTML = '<p class="status-message">Загрузка...</p>'
    
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ru-RU&with_genres=${genreId}`)
    const data = await response.json()
    
    const movieCards = data.results.map(function(movie) {
        return createMovieCard(movie)
    })
    
    moviesGrid.innerHTML = movieCards.join('')
}

genresBar.addEventListener('click', function(event) {
    const btn = event.target.closest('.genre-btn')
    if (btn) {
        const allButtons = document.querySelectorAll('.genre-btn')
        allButtons.forEach(function(button) {
            button.classList.remove('active')
        })
        btn.classList.add('active')
        
        const genreId = btn.dataset.genreId
        getMoviesByGenre(genreId)
    }
})
const resetFilterBtn = document.getElementById('reset-filter-btn')

resetFilterBtn.addEventListener('click', function() {
    const allButtons = document.querySelectorAll('.genre-btn')
    allButtons.forEach(function(button) {
        button.classList.remove('active')
    })
    getPopularMovies()
})
getGenres()
getPopularMovies()