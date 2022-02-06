require([
    "dojo/_base/array",
    "modules/CreateOutput",
    "modules/Create_xy_Vals",
    "modules/CreateChart",
    "modules/CreatePlotlyObj",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/tasks/support/Query",
    "dojo/domReady!"
    ], (
      arrayUtils,
      CreateOutput,
      Create_xy_Vals,
      CreateChart,
      CreatePlotlyObj,
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

      // Put down fields that you will use to query.
      q_fields = ["Change---Fast Loss","Change---Stable","Change---Non-Processing Area Mask","Change---Gain","Change---Slow Loss"]

      // Create instance of class that creates chart
      // const c = Create_xy_Vals({});
      const c = CreatePlotlyObj({});
      ///////////////////////////////////////////////////////////////////////
      // Listening for map clicks is easier
      view.on("click", (e) => {
        query.geometry = e.mapPoint;
        
        layer.queryFeatures(query).then((results) =>{
          
          if(results.features.length>0){
          
            // c.setContentInfo(results);

            document.getElementById("chartDiv").innerHTML = ""; // Set inner html back to nothing before entering in new data.
            
            // const fastLoss = c.fastlossStr.split(",").map(f => parseFloat(f)); // Call the fast loss property of the create chart class.
            // const years = c.yearStr.split(","); // Call the years property of the create chart class.
            // document.getElementById("chartDiv").innerHTML += c.totalArea; // It works now! needed to query the 0th feature...
            // document.getElementById("chartDiv").innerHTML += c.flen; // This works too! preserve! 
            // document.getElementById("chartDiv").innerHTML += c.fastlossStr; // works. everything seems to be working pretty good with the test class.
            // document.getElementById("chartDiv").innerHTML += c.yearStr; // Works. Everything good.

            // Create a chart within the Chart div and feed it the x and y values
            // $('#chartDiv').append(`<canvas id="myChart"><canvas>`);
            // document.getElementById("chartDiv").innerHTML += `<canvas id="myChart"></canvas>`;

 

            // document.getElementById("chartDiv").innerHTML += chartDict['datasets']['data']; // does not work. why?
            // document.getElementById("chartDiv").innerHTML += fastLoss; // This works but why doesn't above work?
            // document.getElementById("chartDiv").innerHTML += chartDict['datasets'][0]['data']; // This works! Just the 0th dataset. 

            // Putting chart data in works. Next step - can you put a dummy chart in there? 
           
            // const chartDict = {
            //   labels: ["1","2","3"],
            //   datasets: [{
            //     label: 'My First dataset',
            //     backgroundColor: 'rgb(255, 99, 132)',
            //     borderColor: 'rgb(255, 99, 132)',
            //     data: [1,2,3],
            //   }]
            // };

            // const config = {
            //   type: 'line',
            //   data: chartDict,
            //   options: {}
            // };

            // const myChart = new Chart(
            //   document.getElementById('myChart'),
            //   config
            // ); // Creating a new chart does not work. Can I do it with plotly more easily?

          // x = years;
          // y = fastLoss;
          // let trace = {
          //   x: x,
          //   y: y,
          //   type: 'scatter' }
          // const mydata = [trace]
          // Plotly.newPlot('chartDiv', mydata) // Wow! That worked. Ok, let's use Plotly. I like it better anyway. 

          // const cc = CreateChart({});
          // cc.outputChart(results, "chartDiv"); // Create a plotly chart using the charting class. This works, and maybe it's fine practice. But I'm going to make a chart using actual class method and property - maybe cleaner way to do it?

          c.createOutputObj(results, q_fields);
          
          document.getElementById("chartDiv").innerHTML += c.outputObj;
          // outObj = c.outputObj;
          
            

          // Plotly.newPlot("chartDiv", c.outputObj);

          }
        });
      });

      // Ok, querying with objects works like a dream.  But what about charts using the outputs? 

    })
  }
);