require([
    "dojo/_base/array",
    "modules/CreatePlotlyObj",
    "modules/DownloadPDF",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/tasks/support/Query",
    "dojo/domReady!"
    ], (
      arrayUtils,
      CreatePlotlyObj,
      DownloadPDF,
      Map, 
      MapView, 
      GeoJSONLayer, 
      Query
      ) => {

    const renderer = {
      type: "simple",  // autocasts as new SimpleRenderer()
      symbol: {
        type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        color: [ 75, 75, 75, 0.3 ],
        outline: {  // autocasts as new SimpleLineSymbol()
          width: 1.3,
          // color: '#1B1716',
          color:'#00897B'
        }
      }
    };

    const layer = new GeoJSONLayer({
        url: "../../geojson/LCMS-Summaries-DISTRICTNA_compressed.geojson",
        renderer: renderer
    });

    const map = new Map({
      basemap: "hybrid",
      layers: [layer]
    })

    const view = new MapView({
      map: map,
      container: "main-map",
      zoom: 6,
      center: [-90, 37]
    });

    view.when(()=>{

      // Create a new query instance, and set some default settings. Actually, what do these default settings mean?
      var query = new Query();
      query.returnGeometry = true;
      query.outFields = null; //["total_area"]
      query.where = "1=1";
      query.num = 50;

      // Put down fields that you will use to query.
      q_fields = ["Change---Fast Loss","Change---Stable","Change---Gain","Change---Slow Loss"];

      // CLASSES GET INSTANTIATED HERE, OUTSIDE OF THE ONCLICK FUNCIONALITY
      const c = CreatePlotlyObj({});
      const d_pdf = DownloadPDF({});

      ///////////////////////////////////////////////////////////////////////
      // Listen for user mouse click on a polygon.
      // This function will listen for user click, and then apply above query to features, activating our plotting class.
      view.on("click", (e) => {
        query.geometry = e.mapPoint;
        
        layer.queryFeatures(query).then((results) =>{
          
          if(results.features.length>0){

            // document.getElementById("side-chart").innerHTML = ""; // Set inner html back to nothing before entering in new data.

            c.createOutputObj(results, q_fields);

          }
        });
      });

      document.getElementById("pdf-button").onclick = function() {d_pdf.downloadPDF()};

    })
  }
);