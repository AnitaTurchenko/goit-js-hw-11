
import axios from 'axios';

export { fetchUrl };

async function fetchUrl(url) {
     try {
         const data = await axios.get(url);
         return data;
     } catch (error) {
         console.log(error);  
     }   
}
