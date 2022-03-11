/*
Authors: 
- Wyatt McCurdy
- Claire Simpson
- Ian Houseman

Description: 
  This is the main script called by the LCMS Viewer2 webpage (I don't actually know what it's called, so I'll just go with Viewer2 for now.)
  It provides the user with a selection of questions and provides charts using LCMS data.
*/

// Require is an AMD - Asynchronous Module Definition - staple.
// AMD is pretty much required when working with esri api and map views - and dashboards in general?
require([
    "dojo/_base/array",
    "modules/CreateChart",
    "modules/DownloadPDF",
    "modules/UserQuestionSelection_01",
    "modules/CreateDropdown",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/tasks/support/Query",
    "dojo/domReady!"
    ], (
      arrayUtils,
      CreatePlotlyObj,
      DownloadPDF,
      UserQuestionSelection,
      CreateDropdown,
      Map, 
      MapView, 
      GeoJSONLayer, 
      Query
      ) => {

    // *** BELOW SEE ARCGIS SETUP STEPS - RENDERING LAYER AND MAP ETC. ***

    // Dictionary object that is supplied to the layer - visibility parameters.
    const renderer = {
      type: "simple",  
      symbol: {
        type: "simple-fill",  
        color: [ 75, 75, 75, 0.3 ],
        outline: {  
          width: 1.3,
          color:'#00897B'
        }
      }
    };

    // Layer that is added to the map
    const layer = new GeoJSONLayer({
        url: "../../geojson/LCMS-Summaries-DISTRICTNA_compressed.geojson",
        renderer: renderer,
        outFields: ["EW_ID"]
    });
    console.log(layer);
    // const layer_west = new GeoJSONLayer({
    //   url: "../../geojson/split-geojson/LCMS-Summaries-DISTRICTNA_compressed_west.geojson",
    //   renderer: renderer
    // });

    // const layer_east = new GeoJSONLayer({
    //   url: "../../geojson/split-geojson/LCMS-Summaries-DISTRICTNA_compressed_east.geojson",
    //   renderer: renderer
    // });

    // Map supplying layers & basemap
    

    // Try querying features and only adding those to the map.

    // let queryhalf = new Query();
    // queryhalf.returnGeometry = true;
    // queryhalf.outFields = null;
    // queryhalf.where = "EW_ID = 1";

    // half_layer = layer.queryFeatures(layerSelectQuery).then((response) => {
    //   return response;
    //   // returns a feature set with features containing the following attributes
    //   // STATE_NAME, COUNTY_NAME, POPULATION, POP_DENSITY
    // });

    const map = new Map({
      basemap: "hybrid",
      layers: [layer]
    });

    // Map view - visualize map and pass it to html div element.
    const view = new MapView({
      map: map,
      container: "main-map",
      zoom: 6,
      center: [-90, 37]
    });

    // *** BELOW SEE STEPS TAKEN AFTER MAP VIEW IS RENDERED ***

    view.when(()=>{

      console.log();
      const selectorElement = document.getElementById("features-select");

      // selectorElement.addEventListener("click", doSomething);

      
      // * CREATE LAYER SELECTION FUNCTION BELOW


      // const fQuery = {
      //   "1": "EW_ID = '1'", 
      //   "2": "EW_ID = '2'"
      // }

      // function showF(event) {
      //   const fQuery = event.target.value;

      //   view.layers.forEach((layer) => {
      //     layer.definitionExpression = fQuery
      //   })
      // }

      // * CREATE LAYER SELECTION FUNCTION ABOVE


      // Create a new query instance, and set some default settings. 
      let query = new Query();
      query.returnGeometry = true;
      query.outFields = null; 
      query.where = "1=1";
      query.num = 50;

      // *INSTANTIATE CLASSES*

      // Chart class
      const c = CreatePlotlyObj({});
      // PDF Download Class
      const d_pdf = DownloadPDF({});
      // Question input class
      const u_q = UserQuestionSelection({});
      // Dropdown class
      const drpdown = CreateDropdown({});

      // CREATE BUTTON ONCLICK FUNCTIONALITY FOR USER QUESTIONS

      // * CREATE DROPDOWN MENU CONTROL FLOW *

      // Call CreateSimpleDropdown function to create a dropdown menu of questions
      drpdown.addDropElems();
      
      // Create a dictionary of button relationships.
      const button_relationships = {
        "Question1": "Change---Fast Loss",
        "Question2": "Change---Slow Loss"
      };

      // Create a div to populate 
      let div = document.getElementById("side-chart");
      // Create a paragraph in the div
      let p = document.createElement("p");
      div.append(p);

      // If there is a change in button status, do something
      document.getElementById("options-dropdown").onchange = () => {
        if (document.getElementById("chart-canvas") != null){
          document.getElementById("chart-canvas").remove();
      };

        p.textContent="Please Select a question.";
        // document.getElementById("side-chart").innerHTML = "";
        // p.innerHTML = "";

        if ( document.getElementById("options-dropdown").value == "" ){
          
          // Ask user to select question if they have not yet.
          p.textContent = "Please select a question.";
        }
        else {
          p.textContent = "";
          p.textContent = c.createOutputObj(null, ["null"]);
        }
      }

      // * RESPOND TO USER MOUSE CLICK ON A FEATURE *
      // This function will listen for user click, and then apply above query to features, activating our plotting class.
      view.on("click", (e) => {
        query.geometry = e.mapPoint;
        
        layer.queryFeatures(query).then((results) =>{
          
          if(results.features.length>0){
            
            c.createOutputObj(results, [button_relationships[document.getElementById("options-dropdown").value]])
            
          }
        });
      });
      document.getElementById("pdf-button").onclick = function() {d_pdf.downloadPDF()};
    })
  }
);