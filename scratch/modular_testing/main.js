// Require is an AMD - Asynchronous Module Definition - staple.
// AMD is pretty much required when working with esri api and map views - and dashboards in general?
require([
    "dojo/_base/array",
    "modules/CreatePlotlyObj",
    "modules/DownloadPDF",
    "modules/UserQuestionSelection_01",
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
        renderer: renderer
    });

    // Map supplying layers & basemap
    const map = new Map({
      basemap: "hybrid",
      layers: [layer]
    })

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

      // Instantiate classes / modules here. 
      const c = CreatePlotlyObj({});
      const d_pdf = DownloadPDF({});
      const u_q = UserQuestionSelection({});

      // CREATE BUTTON ONCLICK FUNCTIONALITY FOR USER QUESTIONS
      document.getElementById("question-1").onclick = function() {u_q.pickChartType("question-1")};
      document.getElementById("question-2").onclick = function() {u_q.pickChartType("question-2")};

      
      ///////////////////////////////////////////////////////////////////////
      // Listen for user mouse click on a polygon.
      // This function will listen for user click, and then apply above query to features, activating our plotting class.
      view.on("click", (e) => {
        query.geometry = e.mapPoint;
        
        layer.queryFeatures(query).then((results) =>{
          
          if(results.features.length>0){
            
            c.createOutputObj(results, u_q.filt_val_list);
            
          }
        });
      });

      document.getElementById("pdf-button").onclick = function() {d_pdf.downloadPDF()};

    })
  }
);