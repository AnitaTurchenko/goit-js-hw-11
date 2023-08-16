import { fetchUrl } from "./js/main_code.js";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "./css/loader.css";
import "simplelightbox/dist/simple-lightbox.min.css";
import SimpleLightbox from 'simplelightbox';

let throttle = require('lodash.throttle');
const API_KEY = '38824644-118675bee850a06ea8955044c';
const BASE_URL = 'https://pixabay.com/api/';
let gallery = null;

const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector(".gallery"),
    loadBtn: document.querySelector('.load-more'),
     alertLoader : document.querySelector('.loader'),
};


refs.form.addEventListener('submit', fetchData);
refs.loadBtn.addEventListener('click', onLoadMore);
refs.loadBtn.classList.add('is-hidden');
refs.alertLoader.classList.add('is-hidden');

const optionsSet = {
    captionDelay: 250,
    captionsData: 'alt',
    animationSpeed: 300,
    swipeTolerance: 50,
    fadeSpeed: 300,
    scrollZoomFactor: 0.1,
}  
    
 function renderMarkup(dataArray) {
    if (dataArray.length === 0) {
        return;
    }
    const markup = dataArray.map(({ webformatURL,likes,views,comments,downloads,tags,largeImageURL }) => 
        `<a href="${largeImageURL}" class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" " />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</a>`
    ).join('');
    refs.gallery.insertAdjacentHTML("beforeend", markup);
   
    if (page === 1) {
        gallery = new SimpleLightbox('.gallery a', optionsSet);
    }
    else{
        gallery.refresh();
    }
    
}

function clearMarkup() {
    return refs.gallery.innerHTML = "";
}

    
Notify.init({
    width: '500px',
    fontSize: '25px',
    position: 'right-top',
    timeout: '1500',
    messageMaxLength: 150,
    distance: '20px',
    showOnlyTheLastOne: true,
    warning: {
        background: 'rgba(190, 194, 79, 1)',
        textColor: '#fff',
        childClassName: 'notiflix-notify-warning',
        notiflixIconColor: 'rgba(0,0,0,0.2)',
        fontAwesomeClassName: 'fas fa-exclamation-circle',
        fontAwesomeIconColor: 'rgba(0,0,0,1)',
        backOverlayColor: 'rgba(238,191,49,0.2)',
    },
});


const options = new URLSearchParams( {
    key: API_KEY,
    page: 1,
    per_page: 40,
    q: null,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
});

let page = Number(options.get('page'));
let perPage = Number(options.get('per_page'));
let totalHits = 0;

async function fetchData(event) {
    try {
        event.preventDefault();
        // page = Number(options.get('page'));
        let inputValue = (event.currentTarget.elements.searchQuery.value).trim();
        if (inputValue === "") {
            options.set('page', `1`);
            Notify.failure("Invalid value. Input text, please.");
            clearMarkup();
            return;
        }
        if (options.get('q') !== inputValue) {
            options.set('page', `1`);
            options.set('q', `${inputValue}`);
             }

        refs.alertLoader.classList.toggle('is-hidden');

        const result = await fetchUrl(`${BASE_URL}?${options}`);
        totalHits = result.data.totalHits;

        if (totalHits === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            clearMarkup();
           
        }
         else {
            Notify.success(`Hooray! We found ${totalHits} images.`);
            
        }
      
        clearMarkup();
        renderMarkup(result.data.hits);

        refs.alertLoader.classList.toggle('is-hidden');
        page += 1;
        options.set('page', `${page}`);
        window.addEventListener('scroll', throttle(() => { endlessScroll(); },1000));

        let maxPage = Math.ceil(totalHits / perPage);
        if (page === maxPage) {  
            // page = 1;
            options.set('page', `${page}`);
            window.removeEventListener('scroll', throttle(() => { endlessScroll(); },1000));
        }
        
               
    } catch (error) {
        console.log(error);
        options.set('page', `1`);
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        clearMarkup();  
     }
          
};



async function onLoadMore() {
    try {
       if (page > maxPage) {               
           window.removeEventListener('scroll', throttle(() => { endlessScroll(); },600));
           return;               
        }  
        
    //    refs.alertLoader.classList.toggle('is-hidden');
        
       const result = await fetchUrl(`${BASE_URL}?${options}`);                
         
        renderMarkup(result.data.hits);

        refs.alertLoader.classList.toggle('is-hidden');
        page += 1;              
        options.set('page', `${page}`);                
        return result;
        
    } catch (error) {
        console.log(error);
    }
}

async function endlessScroll() {
        
    let clientRect = document.documentElement.getBoundingClientRect();
    let clientHeightWindow = document.documentElement.clientHeight;
            
    if (clientRect.bottom < clientHeightWindow + 400) {    
        onLoadMore();
    };                      
};