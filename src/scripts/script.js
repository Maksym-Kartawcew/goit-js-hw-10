import '../sass/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix, { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  let inputedText = event.target.value.trim();

  if (inputedText === '') {
    Notify.info('Type the name of the country');
    return;
  } else {
    fetchCountries(inputedText)
      .then(countries => {
        if (countries.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        } else if (countries.length === 1) {
          return oneCountry(countries);
        } else if (countries.length > 0) {
          return listOfCountries(countries);
        } else {
          throw new Error('Country not found');
        }
      })
      .catch(onError);
  }
}

function onError(error) {
  if (error.message === 'Country not found') {
    Notify.warning('Oops, there is no country with that name');
  }
}

function listOfCountries(countries) {
  let markup = countries.reduce(
    (markup, country) => markup + createListMarkup(country),
    ''
  );
  refs.countryList.innerHTML = markup;
}

function createListMarkup({ flags, name }) {
  return `<li class="country-list"> <img src=${flags.svg} width="30px"> ${name.official}</li>`;
}

function oneCountry(countries) {
  let markup = createCardMarkup(countries[0]);
  refs.countryInfo.innerHTML = markup;
}

function createCardMarkup({ flags, name, capital, population, languages }) {
  return `
    <img src=${flags.svg} width="30px">
    <h2 class="country-card-title">${name.official}</h2>
    <ul class="country-card-list">
      <li>Capital: ${capital}</li>
      <li>Population: ${population}</li>
      <li>Languages: ${languages.join(', ')}</li>
    </ul>
  `;
}
