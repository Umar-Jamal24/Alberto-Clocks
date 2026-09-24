/*
  geolocation.js
  ------------------------------------------------------------
  1. Store Locator Map
  2. Current Date & Time
  3. Visitor Location
  4. Manual Location Storage
*/

(function () {

  "use strict";


  /* =========================================================
     STORE LOCATOR
     ========================================================= */

  const STORE_LOCATIONS = [

    {
      name: "Alberto Clocks — Clifton",
      city: "Karachi, Pakistan",
      lat: 24.8138,
      lng: 67.0300
    },

    {
      name: "Alberto Clocks — Gulberg",
      city: "Lahore, Pakistan",
      lat: 31.5100,
      lng: 74.3436
    },

    {
      name: "Alberto Clocks — Blue Area",
      city: "Islamabad, Pakistan",
      lat: 33.7095,
      lng: 73.0563
    }

  ];


  function initStoreLocatorMap() {

    const mapElement =
      document.getElementById("storeLocatorMap");


    // Stop if map container does not exist
    if (!mapElement) {
      return;
    }


    // Stop if Leaflet is not loaded
    if (typeof L === "undefined") {

      console.error(
        "Leaflet is not loaded. Please check the Leaflet JS link."
      );

      return;
    }


    /*
      Create Map
    */

    const map = L.map(mapElement, {

      scrollWheelZoom: false

    });


    /*
      OpenStreetMap Tiles
    */

 L.tileLayer(
  "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png",
  {
    maxZoom: 19,

    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  }
).addTo(map);

    /*
      Create Markers
    */

    const markers = [];


    STORE_LOCATIONS.forEach(function (store) {

      const marker = L.marker([
        store.lat,
        store.lng
      ])
        .addTo(map)

        .bindPopup(`
          <div style="min-width: 180px;">
            <strong>${store.name}</strong>
            <br>
            <span>${store.city}</span>
          </div>
        `);


      markers.push(marker);

    });


    /*
      Automatically show all stores
    */

    if (markers.length > 0) {

      const group =
        L.featureGroup(markers);

      map.fitBounds(
        group.getBounds().pad(0.25)
      );

    }

  }


  /* =========================================================
     INITIALIZE MAP
     ========================================================= */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initStoreLocatorMap
    );

  } else {

    initStoreLocatorMap();

  }



  /* =========================================================
     LOCATION TICKER
     ========================================================= */

  const LOCATION_KEY =
    "albertoManualLocation";


  const tickerLocationTargets =
    document.querySelectorAll(
      "[data-ticker-location]"
    );


  const tickerDateTargets =
    document.querySelectorAll(
      "[data-ticker-date]"
    );


  const tickerTimeTargets =
    document.querySelectorAll(
      "[data-ticker-time]"
    );


  const locationForm =
    document.getElementById(
      "manualLocationForm"
    );


  const locationInput =
    document.getElementById(
      "manualLocationInput"
    );


  const locationStatus =
    document.getElementById(
      "locationStatus"
    );


  const SAMPLE_LOCATION =
    "Karachi, Pakistan (sample location)";


  /*
    Set location text
  */

  function setLocationText(text) {

    tickerLocationTargets.forEach(
      function (element) {

        element.textContent = text;

      }
    );

  }


  /*
    Update Date & Time
  */

  function updateClock() {

    const now = new Date();


    const dateString =
      now.toLocaleDateString(
        undefined,
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      );


    const timeString =
      now.toLocaleTimeString(
        undefined,
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }
      );


    tickerDateTargets.forEach(
      function (element) {

        element.textContent =
          dateString;

      }
    );


    tickerTimeTargets.forEach(
      function (element) {

        element.textContent =
          timeString;

      }
    );

  }



  /* =========================================================
     INITIALIZE VISITOR LOCATION
     ========================================================= */

  function initLocation() {

    const manualLocation =
      localStorage.getItem(
        LOCATION_KEY
      );


    /*
      If user previously entered
      a location, use it.
    */

    if (manualLocation) {

      setLocationText(
        manualLocation
      );


      if (locationStatus) {

        locationStatus.textContent =
          "Using the location you entered: " +
          manualLocation;

      }


      return;

    }


    /*
      Show sample location initially
    */

    setLocationText(
      SAMPLE_LOCATION
    );


    /*
      Check browser support
    */

    if (!("geolocation" in navigator)) {

      if (locationStatus) {

        locationStatus.textContent =
          "Your browser does not support geolocation. Enter your city below.";

      }

      return;

    }


    /*
      Ask for visitor location
    */

    navigator.geolocation.getCurrentPosition(

      function (position) {

        const latitude =
          position.coords.latitude.toFixed(3);


        const longitude =
          position.coords.longitude.toFixed(3);


        const coordinates =
          "Coordinates " +
          latitude +
          "°, " +
          longitude +
          "°";


        setLocationText(
          coordinates
        );


        if (locationStatus) {

          locationStatus.textContent =
            "Location permission granted. Coordinates detected. Enter your city below if you want a city name displayed.";

        }

      },


      function (error) {

        if (!locationStatus) {
          return;
        }


        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {

          locationStatus.textContent =
            "Location permission was denied, so a sample location is shown. Enter your city below if you'd like.";

        }

        else {

          locationStatus.textContent =
            "Your location could not be determined, so a sample location is shown. Enter your city below if you'd like.";

        }

      },


      {
        timeout: 8000
      }

    );

  }



  /* =========================================================
     MANUAL LOCATION FORM
     ========================================================= */

  if (locationForm) {

    locationForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        const value =
          locationInput
            ? locationInput.value.trim()
            : "";


        if (!value) {
          return;
        }


        /*
          Save location
        */

        localStorage.setItem(
          LOCATION_KEY,
          value
        );


        /*
          Update ticker
        */

        setLocationText(
          value
        );


        /*
          Update status
        */

        if (locationStatus) {

          locationStatus.textContent =
            "Using the location you entered: " +
            value;

        }


        /*
          Clear input
        */

        if (locationInput) {

          locationInput.value = "";

        }

      }
    );

  }



  /* =========================================================
     START CLOCK
     ========================================================= */

  updateClock();


  setInterval(
    updateClock,
    1000
  );


  /* =========================================================
     START LOCATION
     ========================================================= */

  initLocation();


})();