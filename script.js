'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const totalCountry = document.querySelector('.total__country');
const searchCountry = document.querySelector('.search__input');

///////////////////////////////////////

//Promises and the Fetch API,Consuming Promises All Country Information

const randerError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
};

const getJESONData = function (url, errMsg = 'Something Went Wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errMsg} (${response.status})`);
    }
    return response.json();
  });
};

const renderCountry = function (data, className = '') {
  countriesContainer.innerHTML = '';
  let html = '';
  totalCountry.textContent = `Toatal County: ${data.length}`;
  if (data.length === 0) return;
  else {
    data.forEach((data, index) => {
      html = `<article class="country ${className}">
  <img class="country__img" src="${data.flags.png}" />
  <div class="country__number"><span>${index + 1}</span></div>
  <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <p class="country__row"><span>👫</span>${data.population.toLocaleString()}</p>
    <p class="country__row"><span>🗣️</span>${
      typeof data.languages === 'object'
        ? data.languages[Object.keys(data.languages)[0]]
        : ''
    }</p>
    <p class="country__row"><span>💰</span>

    ${
      typeof data.currencies === 'object'
        ? data.currencies[Object.keys(data.currencies)[0]].name
        : ''
    }
    </p>
  </div>
</article>`;
      countriesContainer.insertAdjacentHTML('beforeend', html);
    });
  }
};

const getAllCountryData = function () {
  searchCountry.value = '';
  getJESONData('https://restcountries.com/v3.1/all', 'Country Not Found')
    .then(data => renderCountry(data))
    .catch(err => {
      alert(err);
      randerError(`Something was Wrong :${er.message} Try Again!!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

const getSpecificCountryData = function (country) {
  getJESONData(
    `https://restcountries.com/v3.1/name/${country}`,
    'Country Not Found'
  )
    .then(data => renderCountry(data))
    .catch(err => {
      alert(err);
      randerError(`Something was Wrong :${er.message} Try Again!!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

const getSpecificRegionCountryData = function (region) {
  searchCountry.value = '';
  getJESONData(
    `https://restcountries.com/v3.1/region/${region}`,
    'Country Not Found'
  )
    .then(data => renderCountry(data))
    .catch(err => {
      alert(err);
      randerError(`Something was Wrong :${er.message} Try Again!!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

getAllCountryData();

searchCountry.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const countryName = searchCountry.value.toLowerCase();
    getSpecificCountryData(countryName);
  }
});

//
//getSpecificRegionCountryData('europe');
