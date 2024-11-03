// ************ PAUTA 1 ************

let moviesData = [];

async function loadMoviesData() {
    try {
        const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        moviesData = await response.json();
        console.log('Datos cargados exitosamente:', moviesData.length, 'películas');
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Función para convertir el puntaje a estrellas

function getStarsHtml(score) {
    const stars = Math.round(score / 2);
    let starsHtml = '';
    for (let i = 0; i < stars; i++) {
        starsHtml += '<i class="fa fa-star checked"></i>';
    }
    for (let i = stars; i < 5; i++) {
        starsHtml += '<i class="fa fa-star"></i>';
    }
    return starsHtml;
}

// Función para obtener la lista de generos 

function getGenresList(genres) {
    return genres.map(genre => genre.name).join(' - ');
}

// Función para transformar números a moneda

function formatCurrency(number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(number);
}

// Función para obtener el año de una fecha

function getYear(dateString) {
    return dateString.split('-')[0];
}

// ************ PAUTA 2 ************

function searchMovies() {
    const searchTerm = document.getElementById('inputBuscar').value.toLowerCase().trim();
    const listaElement = document.getElementById('lista');
    
    listaElement.innerHTML = '';
    if (!searchTerm) return;
    
    const filteredMovies = moviesData.filter(movie => {
        const titleMatch = movie.title.toLowerCase().includes(searchTerm);
        const taglineMatch = movie.tagline.toLowerCase().includes(searchTerm);
        const overviewMatch = movie.overview.toLowerCase().includes(searchTerm);
        const genreMatch = movie.genres.some(genre => 
            genre.name.toLowerCase().includes(searchTerm)
        );
        return titleMatch || taglineMatch || overviewMatch || genreMatch;
    });
    
    filteredMovies.forEach(movie => {
        const li = document.createElement('li');
        li.className = 'list-group-item bg-dark text-white';
        li.style.cursor = 'pointer';
        li.innerHTML = `
            <div class="row">
                <div class="col">
                    <h5>${movie.title}</h5>
                    <p>${movie.tagline}</p>
                </div>
                <div class="col-auto">
                    <span class="stars">${getStarsHtml(movie.vote_average)}</span>
                </div>
            </div>
        `;
        
// ************ PAUTA 3 ************
       
li.addEventListener('click', () => showMovieDetails(movie));

listaElement.appendChild(li);
});
}

// ************ PAUTAS 3 y 4 ************

function showMovieDetails(movie) {
    const modalContent = `
        <div class="modal fade" id="movieModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content bg-dark text-white">
                    <!-- PAUTA 3: Título, descripción y géneros -->
                    <div class="modal-header">
                        <h5 class="modal-title">${movie.title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${movie.overview}</p>
                        <hr>
                        <p><strong>Géneros:</strong> ${getGenresList(movie.genres)}</p>

                        <!-- PAUTA 4: Botón desplegable con información adicional -->
                        <div class="dropdown mt-3">
                            <button class="btn btn-secondary dropdown-toggle" 
                                    type="button" 
                                    id="dropdownMenuButton" 
                                    data-bs-toggle="dropdown" 
                                    aria-expanded="false">
                                More
                            </button>
                            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton">
                                <li><a class="dropdown-item">Year: ${getYear(movie.release_date)}</a></li>
                                <li><a class="dropdown-item">Runtime: ${movie.runtime} mins</a></li>
                                <li><a class="dropdown-item">Budget: ${formatCurrency(movie.budget)}</a></li>
                                <li><a class="dropdown-item">Revenue: ${formatCurrency(movie.revenue)}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalContent);

    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', function() {

// PAUTA 1: Cargar los datos al inicio

loadMoviesData();
    
// PAUTA 2: Eventos de búsqueda

    document.getElementById('btnBuscar').addEventListener('click', searchMovies);
    document.getElementById('inputBuscar').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchMovies();
        }
    });
});
