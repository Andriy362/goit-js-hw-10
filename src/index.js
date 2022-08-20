import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onCountrySearch, DEBOUNCE_DELAY)
);

function onCountrySearch(event) {
  let searchQuery = event.target.value.trim();

  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';

  console.log(searchQuery);

  if (searchQuery !== '') {
    fetchCountries(searchQuery).then(renderCountryCard).catch(onFetchError);
  }
}

function renderCountryCard(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (countries.length === 1) {
    refs.countryInfo.innerHTML = countryMarkup(countries);
    return;
  }

  refs.countryList.innerHTML = countriesMarkup(countries);
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  console.log(error);
}

function countryMarkup([
  {
    name: { official },
    capital,
    population,
    flags: { svg },
    languages,
  },
]) {
  const languageItems = Object.values(languages);

  return `<div class="card-body">
   <div class="card-header">
    <h1 class="card-title">  <img src="${svg}" alt="flag" width="30" height="20" class="card-image"> ${official}</h1>
    </div>
    <ul>
    <li class="card-text"> Capital: ${capital} </li>
    <li class="card-text"> Population: ${population}</li>
    <li class="card-text"> Languages: ${languageItems}</li>
    </ul>
    </div>`;
}
