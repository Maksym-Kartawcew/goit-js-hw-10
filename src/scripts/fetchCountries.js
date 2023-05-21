import Notiflix from "notiflix"

export function fetchCountries(countryName) {
  const fields = 'name,capital,population,flags,languages'

  return fetch(`https://restcountries.com/v3.1/name/${countryName}?&fields=name,capital,population,flags,languages`).then(
    (response) => {
      if (!response.ok) {
        Notiflix.Notify.failure("Oops, there is no country with that name")
      }
      return response.json();
    }
  );
}

