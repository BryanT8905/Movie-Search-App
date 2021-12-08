const key = 'api_key=69a018ce0a8ddcb9ba5853e983d2fccc';
const servicePoint = 'https://api.themoviedb.org/3';
const popularMoviesURL = servicePoint + '/discover/movie?sort_by=popularity.desc&'+key;
const inTheatresURL = servicePoint +  '/discover/movie?primary_release_date.gte=2021-11-01&primary_release_date.lte=2021-12-03&' + key;
const imageURL = 'https://image.tmdb.org/t/p/w500'
const imageURLsmall = 'https://image.tmdb.org/t/p/w200'
const searchURL = servicePoint + '/search/movie?' + key
const movieCast = servicePoint + '/movie/500/credits?' + key;

const mainDiv = document.getElementById("main")
const categoryTitle =document.getElementById('categoryTitle')
let resultsTitle = document.createElement('h3');
const searchForm = document.getElementById('form')
const searchInput = document.getElementById('searchInput')
const movieModal = document.getElementById('movieModal')
const castModal = document.getElementById('castModal')
const popularBtn = document.getElementById('popularBtn')
const inTheatersBtn = document.getElementById('inTheatersBtn')


displayPopularMovies()

//fetch api to get and display movie data 
function getMovies(url){
		fetch(url)
			.then(response => response.json())
			.then(data => {
							
				displayMovieInfo(data.results)
						
				})
				.catch(err => console.log(err))
}


//display popular movies on default page
function displayPopularMovies(){
		resultsTitle.innerHTML = "What's Popular"
		categoryTitle.appendChild(resultsTitle)

		getMovies(popularMoviesURL)

		
}

function displayInTheaters(){
	resultsTitle.innerHTML = "In Theatres"
	categoryTitle.appendChild(resultsTitle)

	getMovies(inTheatresURL)

}
//search movies function.  If search input is empty, popular movies as displayed by default
function searchMovie(){
	const term = searchInput.value;
	const param = '&query=' + term;

	resultsTitle.innerHTML = "Search results: " + term;
	let newTitle =resultsTitle
	categoryTitle.appendChild(newTitle)

	if(term===""){
		displayPopularMovies()
	}else{
		getMovies(searchURL + param)
	}
	
}


//display movies as cards with title, image and rating
function displayMovieInfo(data){
	mainDiv.innerHTML = "";

	data.forEach(movie => {
			const title = movie.title;
			const poster = movie.poster_path;
			const vote_avg = movie.vote_average;
			const movieDiv = document.createElement('div');
			const movieID = JSON.stringify(movie.id);
			
	
			movieDiv.classList.add("movies");
			movieDiv.innerHTML = `
				<img src="${imageURL+poster}" alt="movieImage" onclick = "getMovieDetail(${movieID})">
			<div class="title">
				<h3 onclick = "getMovieDetail(${movieID})">${title}</h3>
				<span class="rating">${vote_avg}</span>
			</div>
			` 
			
			mainDiv.appendChild(movieDiv)

		})
}


searchForm.addEventListener("submit", (event) => {
	event.preventDefault();
	searchMovie()

})

popularBtn.addEventListener("click", (displayPopularMovies))

inTheatersBtn.addEventListener("click", (displayInTheaters))

//fetch api to get movie detail data and display in popup modal
function getMovieDetail(id){
	movieModal.innerHTML = ""
	//const modalDiv = document.createElement('div');
	const modalInfo = document.createElement('div');

	const service_point ='https://api.themoviedb.org/3/movie/' + id +'?'+ key;
	fetch(service_point)
			.then(response => response.json())
			.then(data => {
				
				
				const title = data.title;
				const poster = data.poster_path;
				const lang = data.original_language;
				const prodComp = data.production_companies;
				const genres = data.genres;
				const revenue = data.revenue;
				const summary  = data.overview;
				
				modalInfo.classList.add('modalInfo')
				movieModal.classList.add('modal')
				

				modalInfo.innerHTML = `<span class="closebtn" onclick = "closeModal()">&times;</span>
    			<h4 id="image"><img src="${imageURLsmall+poster}"></h4>
            	<h2 id="title">${title}</h2>
            	<div id="summary">Overview: ${summary}</div>
            	<h4 id="language">Language: ${lang}</h4>
            	<h4 id="production company">${prodComp.map(comp => ` ${comp.name} `)}</h4>
            	<div id="release data">release date: ${data.release_date}</div>
            	<div id="genres">Genres: ${genres.map(genre => ` ${genre.name} `)}</div>
            	<div id="revenue">Revenue: ${revenue}</div>
            	<br>
            	<div id="cast">${getCast(id)}</div>`
            	
			})
				.catch(err => console.log(err))
				
	movieModal.appendChild(modalInfo)
	mainDiv.appendChild(movieModal)
	movieModal.style.display = 'block'

}

//fetch credits api to get movie cast data and append to movie detail modal
function getCast(id){
	let castList = "";
	const param = '/movie/' +id +'/credits?' + key; 
		fetch(servicePoint +param)
			.then(response => response.json())
			.then(data => {

			for(let i = 0; i<5; i++){
				castList += `<div onclick = "displayCastInfo(${data.cast[i].id})" ><span class = 'castlink'>${data.cast[i].name}</span>  as  ${data.cast[i].character}, </div>`;				
			}

			cast.innerHTML = `Main Cast: ${castList}`

		})
			.catch(err => console.log(err))

}

//fetch person api to retrieve actor information. Dsiplay in separate modal when name is clicked
function displayCastInfo(id){
	castModal.innerHTML = '';
	

	const castModalInfo = document.createElement('div');
	const param = '/person/' + id + '?' + key;

	fetch(servicePoint + param)
		.then(response => response.json())
		.then(data => {

		const castBio = data.biography;
		const castName = data.name;
		console.log(castBio);

		castModalInfo.classList.add('modalInfo')
		castModal.classList.add('castModal')	

		castModalInfo.innerHTML = `<span class="closebtn" onclick = "closeMovieModal()">&times;</span>
    				<h2 id="castName">${castName}</h2>
            		<h4 id="castBio">Biography: ${castBio}</h4>
            		`

		})
			.catch(err => console.log(err))


    castModal.appendChild(castModalInfo); 
     mainDiv.appendChild(castModal)
	castModal.style.display = 'block'     		

}

function closeModal(){

		movieModal.style.display = 'none'
	
}

function closeMovieModal(){
	castModal.style.display = 'none'
}

function listView(){
	const mainview = document.querySelector('main');
	
	mainview.style.display = 'grid';

}

function gridView(){
	const mainview = document.querySelector('main');
	mainview.style.display = 'flex'
	
}










