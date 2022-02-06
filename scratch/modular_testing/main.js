require([
    "dojo/_base/array",
    "modules/CreateOutput",
    "modules/CreateChart",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/tasks/support/Query",
    "dojo/domReady!"
    ], (
      arrayUtils,
      CreateOutput,
      CreateChart,
      Map, 
      MapView, 
      GeoJSONLayer, 
      Query
      ) => {

    const layer = new GeoJSONLayer({
        url: "../../geojson/LCMS-Summaries-DISTRICTNA_compressed.geojson"
    });

    const map = new Map({
      basemap: "hybrid",
      layers: [layer]
    })

    const view = new MapView({
      map: map,
      container: "viewDiv",
      zoom: 6,
      center: [-90, 37]
    });

    // DON'T DELETE YET // ********
    // Create a testing output -- experiment with setting class values. can comment out for now.
    // const crou = new CreateOutput({});
    // crou.MakeOutput("Hi there. Testing");
    // document.getElementById("feedback").innerHTML += crou.textOutput;
    // DON'T DELETE YET // *********

    view.when(()=>{

      var query = new Query();
      query.returnGeometry = true;
      query.outFields = null; //["total_area"]
      query.where = "1=1";
      query.num = 50;
      ///////////////////////////////////////////////////////////////////////
      // Need to listen for panning and zooming on the map to update charts
      // Since ESRI js api doesn't have a good drag-end or zoom-end listener, need to create one in order to not 
      // crash the browser
      // This method tries to ensure the user is finished panning/zooming before tabulating the graphs

      // Create instance of class that creates chart
      const c = CreateChart({});
      ///////////////////////////////////////////////////////////////////////
      // Listening for map clicks is easier
      view.on("click", (e) => {
        query.geometry = e.mapPoint;
        
        layer.queryFeatures(query).then((results) =>{
          
          if(results.features.length>0){
          
            c.setContentInfo(results);

            document.getElementById("chartDiv").innerHTML = ""; // Set inner html back to nothing before entering in new data.
            
            const fastLoss = c.fastlossStr;
            const years = c.yearStr;
            // document.getElementById("chartDiv").innerHTML += c.totalArea; // It works now! needed to query the 0th feature...
            // document.getElementById("chartDiv").innerHTML += c.flen; // This works too! preserve! 
            // document.getElementById("chartDiv").innerHTML += c.fastlossStr; // works. everything seems to be working pretty good with the test class.
            // document.getElementById("chartDiv").innerHTML += c.yearStr;

            
          }
        });
      });

      // Ok, querying with objects works like a dream.  But what about charts using the outputs? 

    })
  }
);