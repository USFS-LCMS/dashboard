require([
    "dojo/_base/array", 
    "modules/mod_one", 
    "esri/Map",
    "esri/views/MapView",
    "dojo/domReady!"
    ], function(arrayUtils, ModOne, Map, MapView) {

        const layer = new GeoJSONLayer({
            url: '../../geojson/LCMS-Summaries-DISTRICTNA_compressed.geojson'
          });
          
          const map = new Map({
            basemap: "hybrid",
            layers: [layer]
          });
  
          const view = new MapView({
            container: "viewDiv",
            map: map,
            zoom: 5,
            center: [-100,40]
          });


});