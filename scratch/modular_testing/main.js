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
    "esri/geometry/geometryEngine",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/layers/GraphicsLayer",
    "esri/geometry/geometryEngineAsync",
    "esri/widgets/FeatureTable",
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
      geometryEngine,
      SketchViewModel,
      GraphicsLayer,
      geometryEngineAsync,
      FeatureTable
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
      url: "../../geojson/LCMS-Summaries-Chugach_National_Forest_Ecosection-outID.geojson",//"https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Chugach_National_Forest_Ecosection-outID.geojson",
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
      

      
    function getArea(polygon) {
      const geodesicArea = geometryEngine.geodesicArea(polygon, "square-kilometers");
      const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");
      console.log(geodesicArea+"geodes area");
      console.log(planarArea+"planar area")
      return planarArea;

    }

    const map = new Map({
      basemap: "hybrid",
      layers: [layer]
    });

    // Map view - visualize map and pass it to html div element.
    const view = new MapView({
      map: map,
      container: "main-map",
      highlightOptions: {
        color: "orange"
      }
      // zoom: 6,
      // center: [-90, 37]
      // extent:
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //////// CODE TO DRAW RECTANGLE TO SELECT MULTIPLE POLYGON FEATURES 
    ////////////////////////////////////////////////////////////////////////////////////////////////
    let myLayerView;
    layer
      .when(() => {
        view.whenLayerView(layer).then(function (layerView) {
          myLayerView = layerView;
        });
      })
      .catch(errorCallback);

    // create a new instance of a FeatureTable
    const featureTable = new FeatureTable({
      view: view,
      layer: layer,
      highlightOnRowSelectEnabled: false,
      fieldConfigs: [
        {
          name: "outID",
          label: "outID"
        },       
       
      ],
      container: document.getElementById("tableDiv")
    });

    // this array will keep track of selected feature objectIds to
    // sync the layerview feature effects and feature table selection
    let features = [];

    // Listen for the table's selection-change event
    featureTable.on("selection-change", (changes) => {
      // if the feature is unselected then remove the objectId
      // of the removed feature from the features array
      changes.removed.forEach((item) => {
        const data = features.find((data) => {
          return data === item.outID;
        });
        if (data) {
          features.splice(features.indexOf(data), 1);
        }
      });

      // If the selection is added, push all added selections to array
      changes.added.forEach((item) => {
        features.push(item.outID);
      });

      // set excluded effect on the features that are not selected in the table
      myLayerView.featureEffect = {
        filter: {
          objectIds: features
        },
        excludedEffect: "grayscale(50%)"//"blur(5px) grayscale(90%) opacity(40%)"
      };
    });

    // polygonGraphicsLayer will be used by the sketchviewmodel
    // show the polygon being drawn on the view
    const polygonGraphicsLayer = new GraphicsLayer();
    map.add(polygonGraphicsLayer);

    // add the select by rectangle button the view
    const selectButton = document.getElementById("select-by-rectangle");

    // click event for the select by rectangle button
    selectButton.addEventListener("click", () => {
      view.popup.close();
      sketchViewModel.create("rectangle");
    });

    // add the clear selection button the view
    document
      .getElementById("clear-selection")
      .addEventListener("click", () => {
        featureTable.clearSelection();
        featureTable.filterGeometry = null;
        polygonGraphicsLayer.removeAll();
      });

    // create a new sketch view model set its layer
    const sketchViewModel = new SketchViewModel({
      view: view,
      layer: polygonGraphicsLayer
    });

    // Once user is done drawing a rectangle on the map
    // use the rectangle to select features on the map and table
    sketchViewModel.on("create", async (event) => {
      if (event.state === "complete") {
        // this polygon will be used to query features that intersect it
        const geometries = polygonGraphicsLayer.graphics.map(function (
          graphic
        ) {
          return graphic.geometry;
        });
        const queryGeometry = await geometryEngineAsync.union(
          geometries.toArray()
        );
        selectFeatures(queryGeometry);
      }
    });

    // This function is called when user completes drawing a rectangle
    // on the map. Use the rectangle to select features in the layer and table
    function selectFeatures(geometry) {
      if (myLayerView) {
        // create a query and set its geometry parameter to the
        // rectangle that was drawn on the view
        const query = {
          geometry: geometry,
          outFields: ["*"]
        };

        // query graphics from the csv layer view. Geometry set for the query
        // can be polygon for point features and only intersecting geometries are returned
        myLayerView
          .queryFeatures(query)
          .then((results) => {
            if (results.features.length === 0) {
              clearSelection();
            } else {
              // pass in the query results to the table by calling its selectRows method.
              // This will trigger FeatureTable's selection-change event
              // where we will be setting the feature effect on the csv layer view
              featureTable.filterGeometry = geometry;
              featureTable.selectRows(results.features);
            }
          })
          .catch(errorCallback);
      }
    }

    function errorCallback(error) {
      console.log("error happened:", error.message);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////


    // *** BELOW SEE STEPS TAKEN AFTER MAP VIEW IS RENDERED ***

    view.when().then(()=>{
      

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

      
      // PDF Download Class
      const d_pdf = DownloadPDF({});


      // TOGGLE SIDEBAR VISIBILITY ***
      // Create a function that let you toggle visibility based on mouse click.
      const toggleSidebar = ToggleSidebar({});

      // TOGGLE HAMBURGER - QUESTION VISIBILITY
      toggleSidebar.hamburgerToggle("hamburger", "multilevel-accordion-menu"); //out div, inner div

      toggleSidebar.hamburgerToggle("accordion-item-2", "accordion-item-2-a");

      toggleSidebar.hamburgerToggle("accordion-item-3", "accordion-item-3-a");
      toggleSidebar.hamburgerToggle("accordion-item-4", "accordion-item-4-a");

      toggleSidebar.hamburgerToggle("accordion-item-1", "r10-questions");
      toggleSidebar.hamburgerToggle("climate-qs", "accordion-item-1-a");
      toggleSidebar.hamburgerToggle("encroachment-qs", "accordion-item-1-b");

      toggleSidebar.hamburgerToggle("forest-health-qs", "accordion-item-1-c");
      toggleSidebar.hamburgerToggle("forest-health-qs", "accordion-item-1-d");
      toggleSidebar.hamburgerToggle("forest-health-qs", "accordion-item-1-e");
      toggleSidebar.hamburgerToggle("forest-health-qs", "accordion-item-1-f");
      toggleSidebar.hamburgerToggle("forest-health-qs", "accordion-item-1-g");

      toggleSidebar.hamburgerToggle("snow-glacier-qs", "accordion-item-1-h");
      toggleSidebar.hamburgerToggle("snow-glacier-qs", "accordion-item-1-i");
      toggleSidebar.hamburgerToggle("snow-glacier-qs", "accordion-item-1-j");
      toggleSidebar.hamburgerToggle("snow-glacier-qs", "accordion-item-1-k");
      
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

      // CHANGE NECESSARY HERE. NEED TO DO THIS FOR ALL QUESTIONS.
      document.getElementById("accordion-item-1-a").onclick = () => {
        if (document.getElementById("chart-canvas") != null){
          document.getElementById("chart-canvas").remove();
      };

        p.textContent="Please Select a question.";
        // document.getElementById("side-chart").innerHTML = "";
        // p.innerHTML = "";

        // assumes that we have a blank dropdown menu 
        if ( document.getElementById("accordion-item-1-a").value == "" ){
          
          // Ask user to select question if they have not yet.
          p.textContent = "Please select a question.";
        }
        else {
          // if no blank value, clear out the chart 
          p.textContent = "";

          p.textContent = c.createOutputObj(null, ["null"]);
        }
      }

      return layer
    }).then(function (layer) {


        // * RESPOND TO USER MOUSE CLICK ON A FEATURE *
        // This function will listen for user click, and then apply above query to features, activating our plotting class.
        var storeResults = null;
        // Take a screenshot at the same resolution of the current view  
        view.on("click", eventAction);
        //view.on("mouse-drag",eventAction);
        function eventAction(e){
          //click -> query -> zoom to selection -> highlight feature
          view.graphics.removeAll(); // make sure to remmove previous highlighted feature
          var query = new Query();
          query.returnGeometry = true;
          query.maxAllowableOffset = 0;
          query.outFields = null;
          query.where = "1=1";
          query.num = 50;
          query.geometry = e.mapPoint;          
          layer.queryFeatures(query).then((results) => {
            view.goTo({ target: results.features[0].geometry })
            return results;
          }).then((results)=>{             
               //.then(function() {//, zoom:12});
              if (view.extent) {  
                console.log("results len: " + results.features.length);  
                if (results.features.length > 0) { 
                  //highlight selected feature
                  //view.whenLayerView(results).then(function(layerView){
                    view.hitTest(e.mapPoint).then(function (response) {
                    var graphics = response.results;
                    graphics.forEach(function (g) {
                      console.log('graphic:' + g);
  
                      var geom = g.graphic.geometry;
                      if (geom.type === "polygon") {
                        var symbol = new SimpleFillSymbol({
                          color: [205, 66, 47, .0001],
                          style: "solid",
                          outline: {
                            color: [249, 226, 76],
                            width: 1
                          }
                        });
                        var graphic = new Graphic(geom, symbol);
                        //console.log("graphic geom: "+graphic.geometry.Area())
                        //results.features[0].planarArea = getArea(graphic.geometry);
                        results.features[0].attributes["planarArea"] = getArea(graphic.geometry);
  
                        view.graphics.add(graphic);
                      }
                    });
                  });
                //});
                // Chart class
                  const c = CreateChart({});
                  c.createOutputObj(results, ["Change---Fast Loss"]); // OOF, CHANGE THIS, THIS IS JUST HARDCODED   
                  // c.createOutputObj(results, [button_relationships[document.getElementById("tree-shrub-question").value]])
                  storeResults = results;
                }
              } //)
            });

          }

          
        });

        document.getElementById("pdf-button").addEventListener("click", () => {
          view.takeScreenshot({ format: 'png', width: 2048, height: 2048 }).then(function (screenshot) {

            const imageElement = document.getElementsByClassName(
              "js-screenshot-image"
            )[0];

            imageElement.src = screenshot.dataUrl;
            imageElement.height = screenshot.data.height;
            imageElement.width = screenshot.data.width;
            d_pdf.downloadPDF(storeResults);

          });


        });
      //})
  }
);