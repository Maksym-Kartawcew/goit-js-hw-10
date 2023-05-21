export function fetchCountries(countryName) {
  const fields = 'name,capital,population,flags,languages'

  return fetch(`https://restcountries.com/v3.1/name/${countryName}?fields=${fields}`).then(
    (response) => response.json());
}


