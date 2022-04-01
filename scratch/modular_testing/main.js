/*
Authors: 
- Wyatt McCurdy
- Claire Simpson
- Ian Houseman

Description: 
  This is the main script called by the LCMS data explainer.
  It provides the user with a selection of questions and provides charts using LCMS data.
*/

// Require is an AMD - Asynchronous Module Definition - staple.
// AMD is useful when working with esri api and map views.
require([
    "dojo/_base/array",
    "modules/CreateChart",
    "modules/DownloadPDF",
    "modules/UserQuestionSelection_01",
    "modules/CreateDropdown",
    "modules/ToggleSidebar",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/rest/support/Query",
    "esri/Color",
    "esri/Graphic",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",    
    "esri/geometry/geometryEngine",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Extent",
    "esri/geometry/geometryEngineAsync",
    "esri/widgets/FeatureTable",
    "esri/views/draw/Draw",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/geometry/Multipoint",
    "dojo/domReady!"

    ], (
      arrayUtils,
      CreateChart,
      DownloadPDF,
      UserQuestionSelection,
      CreateDropdown,
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
      Extent,
      geometryEngineAsync,
      FeatureTable,
      Draw,
      Point,
      Polygon,
      Multipoint
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

      
    function getArea(polygon) {
      // const geodesicArea = geometryEngine.geodesicArea(polygon, "square-kilometers");
      const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");
      // console.log(geodesicArea+"geodes area");
      // console.log(planarArea+"planar area")
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
    var storeResults = null;




    // *** BELOW SEE STEPS TAKEN AFTER MAP VIEW IS RENDERED ***

    view.when().then(()=>{
      

      // Zoom 2 ext of layer!
      layer.when(()=>{
        // console.log('setting extent');
        view.extent = layer.fullExtent;
      });

      // const selectorElement = document.getElementById("features-select"); MAYBE BRING BACK LATER
      //const screenshotDiv = document.getElementById("screenshotDiv");

      // Updated based on whether the user has clilcked or dragged
      let hasUserSelected = false;

      // Create a new query instance, and set some default settings. 
      let query = new Query();
      query.returnGeometry = true;
      query.outFields = null; 
      query.where = "1=1";
      query.num = 50;

      // *INSTANTIATE CLASSES*

      empty_chart = CreateChart({});
      // empty_chart.updateChartContent(view, layer);

      // Below, watch for movement of map and update charts based on visible features.
      let pastExtent = view.extent;

      let stillComputing = false;

      // Watch extent to see if user is panning or zooming
      view.watch('extent', function(evt){
          // If something is still happening, hold off, watch, wait
          if(!stillComputing){
              viewWatched = true;
              setTimeout( () => {
                  // If we've stopped navigating, run a query of features
                  if(!view.navigating  && viewWatched  && pastExtent !== view.extent) {
                      pastExtent = view.extent;
                      layer.queryFeatures({
                          geometry: view.extent,
                          returnGeometry: true
                      }).then( (results) => {
                          // console.log(results.features.length);
                          stillComputing = true;
                          if(results.features.length>0){
                              // Call function below
                              ['Change','Land_Cover','Land_Use'].map((w) => empty_chart.setContentInfo(results,w,"side-chart"));
                              stillComputing = false;
                              viewWatched = false;
                          }else{
                              viewWatched = false; 
                          };
                      } )
                  }
              }, 1000)
          }
      })
      /////////////////////////////////////////////////////////////////////////////////////////////////
      ///// CODE TO CTRL+CLICK TO SELECT MULTIPLE POLYGONS
      /////////////////////////////////////////////////////////////////////////////////////////////////
      const pntGraphics = new GraphicsLayer();
      let viewClickEvtHandler = null, viewMouseMoveEvtHandler = null;
      var renderer = {
          type: "simple", // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [255, 255, 255, 0.5],
            style: "none",
            outline: {  // autocasts as new SimpleLineSymbol()
              color: "white",
              width: 2
            }
          }
        };
     
      let drawPnt, graphic, ctrlKey = false, moveCtrlKey = false, highlight, statesLyrView;


      layer.when(function(){
        view.whenLayerView(layer).then(function(layerView) {
          statesLyrView = layerView;
        });
      })

      const draw = new Draw({
        view: view
      });

      var sym = {
        type: "simple-marker",
        style: "circle",
        color: [0, 255, 255, 0.6],
        size: "8px",
        outline: {
          color: [0, 255, 255, 1],
          width: 1
        }
      };

      // view.ui.add("point-button", "top-left");

      document.getElementById("point-button").onclick = drawPoint; //when user click the point button on RH side of screen..
      console.log("*NOTE* To select multiple items, user must hold 'CTRL' before the first click through the last click AND move mouse after final click to see highlight")
      // function zoomToLayer(layer) {
      //   console.log("zoom to layer")
      //   return layer.queryExtent(query).then((response) => {
      //     view.goTo(response.extent).catch((error) => {
      //       console.error(error);
      //     });
      //   });
      // }
    
      function drawPoint() {
        if(viewMouseMoveEvtHandler){
          viewMouseMoveEvtHandler.remove()
          viewMouseMoveEvtHandler = null
        }
        if(viewClickEvtHandler){
          viewClickEvtHandler.remove()
          viewClickEvtHandler = null
        }
        const action = draw.create("point");
        viewMouseMoveEvtHandler = view.on('pointer-move', (evt) => {
          //when mouse is moved, check if ctrl key is pressed
          if (evt.native.ctrlKey) {moveCtrlKey = true;}
          else{moveCtrlKey = false;}
        })
        viewClickEvtHandler = view.on('pointer-down', (evt)=>{
          //when mouse is clicked, check if ctrl key is pressed
          if (evt.native.ctrlKey) {
            console.log("ctrl: "+evt.native.ctrlKey)
            ctrlKey = true;
          }else{
            ctrlKey = false;
          }
        })
        //removed any existing highlight
        if (highlight) {
          highlight.remove();
        }
  
        action.on("cursor-update", function (evt) {
          view.graphics.removeAll();
          drawPnt = new Point({
            x: evt.coordinates[0],
            y: evt.coordinates[1],
            spatialReference: view.spatialReference
          });
          graphic = new Graphic({
            geometry: drawPnt,
            symbol: sym
          });
          view.graphics.add(graphic);
          if(ctrlKey && !moveCtrlKey){  //
            //if the ctrl button was held when the mouse was clicked (pointer-down) 
            //and was NOT pressed when the cursor was moving?
            // then reset the graphics and re-select

            //i.e. dont run selectStates func. until mouse moves while CTRL button NOT clicked
            //ie. if ctrl button clicked and mouse is moving -- wait
            //if ctrl button not clicked and mouse is moving -- dont do anything
            draw.reset(); //resets drawing by clearing active action
            view.graphics.removeAll(); //remove graphics
            selectStates();
          }
        });

        action.on("draw-complete", function (evt) {
          console.log("draw complete"+"ctrl: "+ctrlKey)
          drawPnt = new Point({
            x: evt.coordinates[0],
            y: evt.coordinates[1],
            spatialReference: view.spatialReference
          });

          graphic = new Graphic({
            geometry: drawPnt,
            symbol: sym
          });
          pntGraphics.add(graphic);
          if (ctrlKey) {
            drawPoint(); //recursive (this is wrapped up in drawPoint() )
          } else {
            view.graphics.removeAll();
            selectStates();
          }
          //view.add(graphic)

        });

        view.focus();
      };
      //weird: use must move mouse from multiselected polygons in order for them to get highlighted
      //ie event to trigger highlight is move of mouse without ctrl clicked
      //need to highlight selected feature as soon as as mouse clicks 
      //i.e. NOT when draw event is over I guess

      function selectStates(){
        ctrlKey = false
        moveCtrlKey = false
        if(viewMouseMoveEvtHandler){
          viewMouseMoveEvtHandler.remove()
          viewMouseMoveEvtHandler = null
        }
        if(viewClickEvtHandler){
          viewClickEvtHandler.remove()
          viewClickEvtHandler = null
        }
        let mp = new Multipoint({
          spatialReference: view.spatialReference
        });
        let pntArray = pntGraphics.graphics.map(function(gra){
          mp.addPoint(gra.geometry);
        });
        
        const query = {
          geometry: mp,
          outFields: ["*"],
          outSpatialReference: view.spatialReference,
          returnGeometry: true
        };
        
        layer.queryFeatures(query,{returnGeometry:true}).then(function(results){

          //zoom to selected (queried) features
          layer.queryExtent(query).then((response) => {
            view.goTo(response.extent.expand(1.25)).catch((error) => {
              console.error(error);
            })});

          storeResults=results
          console.log("results "+storeResults)
          const graphics = results.features; 
          //view.goTo(graphics)

          console.log("setting chart from click")
          empty_chart = CreateChart({});
          ['Change','Land_Cover','Land_Use'].map((w) => empty_chart.setContentInfo(results,w,"side-chart"));
          
          // remove existing highlighted features
          if (highlight) {
            highlight.remove();
          }

          // highlight query results
          highlight = statesLyrView.highlight(graphics);
          pntGraphics.removeAll();
          ////
          var totalArea=0;
          console.log("len "+results.features.length)
          graphics.forEach(function (g) { 
            
          //get geometry of each selected features and turn it into a graphic for area calculation
          var geom = g.geometry;
          
          if (geom.type === "polygon") {     
            var graphicTemp = new Graphic(geom); 
            
            totalArea += getArea(graphicTemp.geometry);
            console.log("total area:"+totalArea)              
          }
        });
        results.features[0].attributes["planarArea"] = totalArea
                          
          
        }).catch(function(err){
          console.error(err);
        })
      }
       
  


    //       /////////////////////////////////////////////////////////////////////////////////////////////////
    // //////// CODE TO DRAW RECTANGLE TO SELECT MULTIPLE POLYGON FEATURES 
    // ////////////////////////////////////////////////////////////////////////////////////////////////
    // let myLayerView;
    // layer
    //   .when(() => {
    //     view.whenLayerView(layer).then(function (layerView) {
    //       myLayerView = layerView;
    //     });
    //   });
    //   // .catch(errorCallback);

    // // create a new instance of a FeatureTable
    // const featureTable = new FeatureTable({
    //   view: view,
    //   layer: layer,
    //   highlightOnRowSelectEnabled: true,
    //   fieldConfigs: [
    //     {
    //       name: "outID",
    //       label: "outID"
    //     },       
      
    //   ],
    //   container: document.getElementById("tableDiv")
    // });

    // // this array will keep track of selected feature objectIds to
    // // sync the layerview feature effects and feature table selection
    // let features = [];

    // // Listen for the table's selection-change event
    // featureTable.on("selection-change", (changes) => {
    //   // if the feature is unselected then remove the objectId
    //   // of the removed feature from the features array
    //   changes.removed.forEach((item) => {
    //     const data = features.find((data) => {
    //       return data === item.outID;
    //     });
    //     if (data) {
    //       features.splice(features.indexOf(data), 1);
    //     }
    //   });

    //   // If the selection is added, push all added selections to array
    //   changes.added.forEach((item) => {
    //     features.push(item.outID);
    //   });

    //   // set excluded effect on the features that are not selected in the table
    //   myLayerView.featureEffect = {
    //     filter: {
    //       objectIds: features
    //     },
    //     excludedEffect: "grayscale(50%)"//"blur(5px) grayscale(90%) opacity(40%)"
    //   };
    // });

    // // polygonGraphicsLayer will be used by the sketchviewmodel
    // // show the polygon being drawn on the view
    const polygonGraphicsLayer = new GraphicsLayer();
    map.add(polygonGraphicsLayer);

    // // add the select by rectangle button the view
     const selectButton = document.getElementById("select-by-rectangle");

    // click event for the select by rectangle button
    selectButton.addEventListener("click", () => {
      view.graphics.removeAll();
      draw.reset();
      action=null
      if (highlight){
        highlight.remove()
      }
      view.popup.close();
      sketchViewModel.create("rectangle");
    });

    // add the clear selection button the view
    // document
    //   .getElementById("clear-selection")
    //   .addEventListener("click", () => {
    //     //featureTable.clearSelection();
    //     //featureTable.filterGeometry = null;
    //     polygonGraphicsLayer.removeAll();
    //     pntGraphics.removeAll();
    //     highlight.remove();

    //   });

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
      if (highlight){
        highlight.remove();
      }
      if (statesLyrView) {
        // create a query and set its geometry parameter to the
        // rectangle that was drawn on the view
        const query = {
          geometry: geometry,
          outFields: ["*"]
        };
        // query graphics from the csv layer view. Geometry set for the query
        // can be polygon for point features and only intersecting geometries are returned
        layer//statesLyrView
          .queryFeatures(query)
          .then((results) => {
            console.log("len "+results.features.length)
            if (results.features.length === 0) {
              clearSelection();
            } else {
              //zoom to selected (queried) features
              layer.queryExtent(query).then((response) => {
                view.goTo(response.extent.expand(1.25)).catch((error) => {
                  console.error(error);
            })});
              
              highlight = statesLyrView.highlight(results.features);

              // here we get to use queried features. chart here
              empty_chart = CreateChart({});
              ['Change','Land_Cover','Land_Use'].map((w) => empty_chart.setContentInfo(results,w,"side-chart"));

              // pass in the query results to the table by calling its selectRows method.
              // This will trigger FeatureTable's selection-change event
              // where we will be setting the feature effect on the csv layer view
              //featureTable.filterGeometry = geometry;
              //featureTable.selectRows(results.features);
            }
          });
          polygonGraphicsLayer.removeAll();//view.graphics.removeAll()
          // .catch(errorCallback);
      }
    }

    function errorCallback(error) {
      console.log("error happened:", error.message);
    }


    // ////////////////////////////////////////////////////////////////////////////////////////////////
      
      
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

      toggleSidebar.hamburgerToggle("map-layer-selection", "map-layer-selection-items");

      // Create an empty chart as CreateChart object
      // const empty_chart = CreateChart({});
      // empty_chart.chartVisibleFeatures(view, layer, ["Change---Fast Loss", "Change---Slow Loss"]);




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
    })
    
    // .then(function (layer) {


    //     // * RESPOND TO USER MOUSE CLICK ON A FEATURE *
    //     // This function will listen for user click, and then apply above query to features, activating our plotting class.
        
    //     // Take a screenshot at the same resolution of the current view  
    //     view.on("click", eventAction);
    //     //view.on("mouse-drag",eventAction);
    //     function eventAction(e){
    //       //click -> query -> zoom to selection -> highlight feature
    //       view.graphics.removeAll(); // make sure to remmove previous highlighted feature
    //       var query = new Query();
    //       query.returnGeometry = true;
    //       query.maxAllowableOffset = 0;
    //       query.outFields = null;
    //       query.where = "1=1";
    //       query.num = 50;
    //       query.geometry = e.mapPoint;          
    //       layer.queryFeatures(query).then((results) => {
    //         view.goTo({ target: results.features[0].geometry })
    //         return results;
    //       }).then((results)=>{             
    //            //.then(function() {//, zoom:12});
    //           if (view.extent) {  
    //             // console.log("results len: " + results.features.length);  
    //             if (results.features.length > 0) { 
    //               //highlight selected feature
    //               //view.whenLayerView(results).then(function(layerView){
    //                 view.hitTest(e.mapPoint).then(function (response) {
    //                 var graphics = response.results;
    //                 // graphics.forEach(function (g) {
    //                 //   // console.log('graphic:' + g);
  
    //                 //   var geom = g.graphic.geometry;
    //                 //   if (geom.type === "polygon") {
    //                 //     // var symbol = new SimpleFillSymbol({
    //                 //     //   color: [205, 66, 47, .0001],
    //                 //     //   style: "solid",
    //                 //     //   outline: {
    //                 //     //     color: [249, 226, 76],
    //                 //     //     width: 1
    //                 //     //   }
    //                 //     // });
    //                 //     var graphic = new Graphic(geom);//, symbol);
                        
    //                 //     results.features[0].attributes["planarArea"] = getArea(graphic.geometry);
  
    //                 //     //view.graphics.add(graphic);
    //                 //   }
    //                 // });
    //               });
    //             //});
    //             // Chart class
    //               // const c = CreateChart({});
    //               // c.createOutputObj(results, ["Change---Fast Loss"], "side-chart"); // OOF, CHANGE THIS, THIS IS JUST HARDCODED 
    //               // c.setContentInfo(results, "Land_Cover", "side-chart")  
    //               // c.createOutputObj(results, [button_relationships[document.getElementById("tree-shrub-question").value]])
    //               // storeResults = results;
    //             }
    //           } //)
    //         });

    //       }

          
    //     });
        // PDF Download Class
        const d_pdf = DownloadPDF({});


        document.getElementById("pdf-button").addEventListener("click", () => {
          view.takeScreenshot({ format: 'png', width: 2048, height: 2048 }).then(function (screenshot) {

            const imageElement = document.getElementsByClassName(
              "js-screenshot-image"
            )[0];

            imageElement.src = screenshot.dataUrl;
            imageElement.height = screenshot.data.height;
            imageElement.width = screenshot.data.width;
            setTimeout(d_pdf.downloadPDF(storeResults), 7000); //wait 7 ms before running function to let charts load (does this work?)

          });


        });
      //})
  }
);