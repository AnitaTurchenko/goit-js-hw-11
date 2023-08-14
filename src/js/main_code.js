import { refs ,page} from "../index.js";
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

// const axios = require('axios').default;
let gallery = null;

const optionsSet = {
    captionDelay: 250,
    captionsData: 'alt',
    animationSpeed: 300,
    swipeTolerance: 50,
    fadeSpeed: 300,
    scrollZoomFactor: 0.1,
}  

async function fetchUrl(url) {
     try {
         const data = await axios.get(url);
         return data;
     } catch (error) {
         console.log(error);
        
     }
          
    
         
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
    if (refs.loadBtn.classList.contains('is-hidden')) {
        refs.loadBtn.classList.remove('is-hidden');
    }
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

export { fetchUrl, renderMarkup, clearMarkup };

// function scrollPage() {
//     const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//     top: cardHeight * 1.8,
//   behavior: "smooth",
// });
// }