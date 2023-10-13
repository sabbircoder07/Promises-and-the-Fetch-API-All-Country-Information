'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const totalCountry = document.querySelector('.total__country');
const searchCountry = document.querySelector('.search__input');
const regionOption = document.querySelector('#region');
const currentLocation = document.querySelector(
  '.country__header-current-location'
);

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

let countryNameList = [];
let regionListAllCountry = [];
let regionList = [];

const countryArray = function (data) {
  countryNameList = [];
  data.forEach(data => {
    countryNameList.push(data.name.common);
  });
};

const regionListArray = function (data) {
  regionOption.innerHTML = `<option value="0" selected>Filter by Region</option>`;
  regionList = [];
  regionListAllCountry = [];
  let html = '';
  data.forEach(data => {
    regionListAllCountry.push(data.region);
  });
  regionList = [...new Set(regionListAllCountry)];
  regionList.forEach(region => {
    html = `
    <option value="${region}">${region}</option>`;
    regionOption.insertAdjacentHTML('beforeend', html);
  });
};

const renderCountry = function (data, className = '') {
  countriesContainer.innerHTML = '';
  let html = '';
  if (data.length === 0) return;
  else {
    totalCountry.textContent = `Toatal County: ${data.length}`;
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
    .then(data => {
      renderCountry(data);
      countryArray(data);
      regionListArray(data);
    })
    .catch(err => {
      randerError(`Something was Wrong :${err.message} Try Again!!`);
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
      randerError(`Something was Wrong :${err.message} Try Again!!`);
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
      randerError(`Something was Wrong :${err.message} Try Again!!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

const getPosition = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereIAm = function () {
  getPosition()
    .then(pos => {
      const { latitude, longitude } = pos.coords;
      return fetch(
        `https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=162946408608323744884x64245`
      );
    })
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      currentLocation.innerHTML = `You are now in ${data.city}, ${data.country}`;
    })
    .catch(err => console.error(`${err.message}`));
};

getAllCountryData();
window.onload = whereIAm;

searchCountry.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const countryName = searchCountry.value.toLowerCase();
    if (countryName !== '') {
      countriesContainer.innerHTML = '';
      getSpecificCountryData(countryName);
    } else {
      getAllCountryData();
    }
  }
});

regionOption.addEventListener('change', function (event) {
  event.preventDefault();
  const region = regionOption.value.toLowerCase();
  if (region !== '0') {
    countriesContainer.innerHTML = '';
    getSpecificRegionCountryData(region);
  } else {
    countriesContainer.innerHTML = '';
    getAllCountryData();
  }
});

/*
const lotteryPromise = new Promise((resolve, reject) => {
  console.log('Lottery Draw are happening');
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('You are win the Game');
    } else {
      reject(new Error('You lose the game and lose your money.'));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

const wait = function (seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(2)
  .then(() => {
    console.log('I waited for 2 seconds');
    return wait(1);
  })
  .then(() => console.log('I wated for 1 second.'));

  */

/*
//Promisifying the Geolocation API

const getPosition = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const renderSpecificCountry = function (data, className = '') {
  countriesContainer.innerHTML = '';
  let html = '';
  if (data.length === 0) return;
  else {
    totalCountry.textContent = `Toatal County: ${data.length}`;
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
      countriesContainer.style.opacity = 1;
    });
  }
};

const whereIAm = function () {
  getPosition()
    .then(pos => {
      const { latitude, longitude } = pos.coords;
      return fetch(
        `https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=162946408608323744884x64245`
      );
    })
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(`You are in ${data.city}, ${data.country}`);
      return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);
      return res.json();
    })
    .then(data => {
      renderSpecificCountry(data);
    })
    .catch(err => console.error(`${err.message}`));
};

window.onload = whereIAm;
*/
/*
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const imgContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });
    img.addEventListener('error', function (err) {
      reject(new Error('Image not found.'));
    });
  });
};
let currentImage;

createImage('img/img-1.jpg')
  .then(img => {
    currentImage = img;
    console.log('image one load');
    return wait(4);
  })
  .then(() => {
    currentImage.style.display = 'none';
    return createImage('img/img-1.jpg');
  })
  .then(img => {
    currentImage = img;
    console.log('image two load');
    return wait(4);
  })
  .then(() => {
    currentImage.style.display = 'none';
  })
  .catch(err => console.error(err));
  */
