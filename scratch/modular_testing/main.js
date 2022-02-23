// Require is an AMD - Asynchronous Module Definition - staple.
// AMD is pretty much required when working with esri api and map views - and dashboards in general?
require([
    "dojo/_base/array",
    "modules/CreatePlotlyObj",
    "modules/DownloadPDF",
    "modules/UserQuestionSelection_01",
    "modules/CreateSimpleDropdown",
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

        //MAYBE HIGHLIGHT OPTION IN RENDERER AS WELL

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
        renderer: renderer
    });

    // Map supplying layers & basemap
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

      // Create a new query instance, and set some default settings. Actually, what do these default settings mean?
      var query = new Query();
      query.returnGeometry = true;
      query.outFields = null; 
      query.where = "1=1";
      query.num = 50;

      // INSTANTIATE CLASSES
      // Chart class
      const c = CreatePlotlyObj({});
      // PDF Download Class
      const d_pdf = DownloadPDF({});
      // Question input class
      const u_q = UserQuestionSelection({});
      // Dropdown class
      const drpdown = CreateDropdown({});

      // CREATE BUTTON ONCLICK FUNCTIONALITY FOR USER QUESTIONS

      //get elements
      // const dropdownTitle = document.querySelector('.dropdown .title');
      // const dropdownOptions = document.querySelectorAll('.dropdown .option');

      //bind listeners to these elements
      // dropdownTitle.addEventListener('click', drpdown.toggleMenuDisplay);
      // dropdownOptions.forEach(option => option.addEventListener('click',drpdown.handleOptionSelected));
      drpdown.addDropElems();
      
      // button relationships
      const button_relationships = {
        "Q1": "Change---Fast Loss",
        "Q2": "Change---Slow Loss"
      };

      let div = document.getElementById("side-chart");
      let p = document.createElement("p");
      div.append(p);

      document.getElementById("options-dropdown").onchange = () => {
        if ( document.getElementById("options-dropdown").value == "" ){
          p.textContent = "Please select a question.";
        }
        else {
          // p.textContent = document.getElementById("options-dropdown").value;
          p.textContent = c.createOutputObj(null, ["null"]);
        }
      }

      // document.querySelector('.dropdown .title').addEventListener('change',drpdown.handleTitleChange);

      ///////////////////////////////////////////////////////////////////////
      // Listen for user mouse click on a polygon.
      // This function will listen for user click, and then apply above query to features, activating our plotting class.

      // SOMEWHERE IN ONCLICK, MAKE HIGHLIGHTING A THING
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