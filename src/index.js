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
  debounce(CountrySearch, DEBOUNCE_DELAY)
);

function CountrySearch(event) {
  let searchQuery = event.target.value.trim();

  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';

  console.log(searchQuery);

  if (searchQuery !== '') {
    fetchCountries(searchQuery).then(CountryCard).catch(FetchError);
  }
}

function CountryCard(countries) {
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

function FetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  console.log(error);
}

function countriesMarkup(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `
      <li> <img src="${flags.svg}" alt="${name.official}" width="30" height="20" class="card-image"> ${name.official} </li>`;
    })
    .join('');

  return markup;
}
function countryMarkup(data) {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<div class="card-body">
      <div class="card-header">
      <h1><img src="${flags.svg}" alt="${
        name.official
      }" width="50" height="30" class="card-image">${name.official}</h1>  </div>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p> </div>`
  );
}
