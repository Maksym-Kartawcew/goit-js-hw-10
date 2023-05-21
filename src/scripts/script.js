import '../sass/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  let inputedText = event.target.value.trim();
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';

  if (inputedText === '') {
    return;
  } else
    fetchCountries(inputedText).then(countries => {
      if (countries.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length === 1) {
        const country = creareCountryCard(countries);
        refs.countryList.insertAdjacentHTML('beforeend', country);
      } else {
        return listOfCountries(countries);
      }
    });
}

function listOfCountries(countries) {
  let markup = countries.reduce(
    (markup, country) => markup + createListMarkup(country),
    ''
  );
  refs.countryList.innerHTML = markup;
}

function createListMarkup({ flags, name }) {
  return `<li> <img src="${flags.svg}" width="30px"> ${name.official}</li>`;
}

function creareCountryCard(countries) {
  return countries.reduce(
    (marcup, { name: { official }, capital, population, flags, languages }) => {
      languages = Object.values(languages).join(', ');
      return (
        marcup +
        `
          <img src="${flags.svg}" width="50"/>
          <h1>${official}</h1>
          <h3>Capital: ${capital}</h3>
          <h3>Population: ${population.toLocaleString()}</h3>
          <h3>Languages: ${languages}</h3>
      `
      );
    },
    ''
  );
}
