/*
Authors: 
- Wyatt McCurdy
- Claire Simpson
- Ian Houseman

Description: 
  This is the main script called by the LCMS Viewer2 webpage (I don't actually know what it's called, so I'll just go with Viewer2 for now.)
  It provides the user with a selection of questions and provides charts using LCMS data.
*/

//const { features } = require("process");

// Require is an AMD - Asynchronous Module Definition - staple.
// AMD is pretty much required when working with esri api and map views - and dashboards in general?

require([
    "dojo/_base/array",
    "modules/CreateChart",
    "modules/DownloadPDF",
    "modules/UserQuestionSelection_01",
    "modules/CreateDropdown",
    "modules/ACCORDION",
    "modules/ToggleSidebar",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/tasks/support/Query",
    "esri/Color",
    "esri/Graphic",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",    
    "dojo/domReady!"

    ], (
      arrayUtils,
      CreateChart,
      DownloadPDF,
      UserQuestionSelection,
      CreateDropdown,
      Accordion,
      ToggleSidebar,
      Map, 
      MapView, 
      GeoJSONLayer, 
      Query,
      Color,
      Graphic,
      SimpleFillSymbol,
      SimpleLineSymbol,
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


    // LOAD IN LAYERS - look in template for layer list widget. 

    const layer = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Chugach_National_Forest_Ecosection-outID.geojson",
      renderer: renderer
    });

    //
      // const chugach_ecosections = new GeoJSONLayer({
      //   url: "../../geojson/LCMS-Summaries-Chugach_National_Forest_Ecosection-outID.geojson",
      // })

      // console.log(layer);
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
      container: "main-map"
      // zoom: 6,
      // center: [-90, 37]
      // extent:
    });



    // *** BELOW SEE STEPS TAKEN AFTER MAP VIEW IS RENDERED ***

    view.when(()=>{

          // Zoom 2 ext of layer!
    layer.when(()=>{
      console.log('setting extent');
      view.extent = layer.fullExtent;
    });

      // const selectorElement = document.getElementById("features-select"); MAYBE BRING BACK LATER
      //const screenshotDiv = document.getElementById("screenshotDiv");

      // Create a new query instance, and set some default settings. 
      let query = new Query();
      query.returnGeometry = true;
      query.outFields = null; 
      query.where = "1=1";
      query.num = 50;

      // *INSTANTIATE CLASSES*

      // Chart class
      const c = CreateChart({});
      // PDF Download Class
      const d_pdf = DownloadPDF({});

      // Create a function that let you toggle visibility based on mouse click.
      const toggleSidebar = ToggleSidebar({});

      toggleSidebar.hamburgerToggle();


      // Question input class
      // const u_q = UserQuestionSelection({});
      // Dropdown class
      // const drpdown = CreateDropdown({});

      // CREATE BUTTON ONCLICK FUNCTIONALITY FOR USER QUESTIONS

      // * CREATE DROPDOWN MENU CONTROL FLOW *

      // Call CreateSimpleDropdown function to create a dropdown menu of questions
      // drpdown.addDropElems();
      
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
      document.getElementById("tree-shrub-question").onclick = () => {
        if (document.getElementById("chart-canvas") != null){
          document.getElementById("chart-canvas").remove();
      };

        p.textContent="Please Select a question.";
        // document.getElementById("side-chart").innerHTML = "";
        // p.innerHTML = "";

        // assumes that we have a blank dropdown menu 
        if ( document.getElementById("tree-shrub-question").value == "" ){
          
          // Ask user to select question if they have not yet.
          p.textContent = "Please select a question.";
        }
        else {
          // if no blank value, clear out the chart 
          p.textContent = "";

          p.textContent = c.createOutputObj(null, ["null"]);
        }
      }

      // * RESPOND TO USER MOUSE CLICK ON A FEATURE *
      // This function will listen for user click, and then apply above query to features, activating our plotting class.
      var storeResults =null;
      // Take a screenshot at the same resolution of the current view  
     
      view.on("click", (e) => {
        query = new Query();
        query.returnGeometry = true;
        query.maxAllowableOffset = 0;
        query.outFields = null; 
        query.where = "1=1";
        query.num = 50;
        query.geometry = e.mapPoint;
        
        layer.queryFeatures(query).then((results) =>{
          
          if(results.features.length>0){
            view.hitTest(e.screenPoint).then(function(response){
              var graphics= response.results;
              graphics.forEach(function(g){
                console.log('graphic:'+g);
                
                var geom = g.graphic.geometry;
                if (geom.type === "polygon") {
                  var symbol = new SimpleFillSymbol({
                    color:[205,66,47,.0001],
                    style:"solid",
                    outline:{
                      color:[205,66,47],//"yellow",
                      width:1
                    }

                  });
                  var graphic = new Graphic(geom, symbol);
                  view.graphics.removeAll(); // make sure to remmove previous highlighted feature
                  view.graphics.add(graphic);
                }


              })
            })            
            view.goTo(results.features[0].geometry);
            
            c.createOutputObj(results, ["Change---Fast Loss"]) // OOF, CHANGE THIS, THIS IS JUST HARDCODED 
            // c.createOutputObj(results, [button_relationships[document.getElementById("tree-shrub-question").value]])
            storeResults=results
            
          }
        });
      });

      document.getElementById("pdf-button").addEventListener("click",() => {//onclick = function() {
        //var newExtent = esri.graphicsExtent(storeResults.features);
        //map.setExtent(newExtent,true);
        //view.goTo(storeResults.features[0].geometry); //works, but called asynchronously so happens AFTER screenshot
        view.takeScreenshot({format:'png', width:2048,height:2048}).then(function(screenshot) {
          //showPreview(screenshot);
          //const viewCanvas = document.createElement("canvas");
          //const viewCanvasImg = document.createElement("img").setAttribute('id',"my_screenshot_img");
          //viewCanvasImg.src=screenshot.dataUrl;
  
          //var imageElement = document.getElementById("screenshotImage");
          const imageElement = document.getElementsByClassName(
            "js-screenshot-image"
          )[0];
          
          imageElement.src = screenshot.dataUrl;
          imageElement.height = screenshot.data.height;
          imageElement.width = screenshot.data.width;
          //screenshotDiv.classList.remove("hide");
          d_pdf.downloadPDF(storeResults)
          
        });
  
        
      });
    })
  }
);