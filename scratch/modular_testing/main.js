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
    "modules/ToggleSidebar",
    "modules/CreateStaticTemplates",
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
    "esri/widgets/LayerList",
    "esri/layers/GroupLayer",
    "dojo/domReady!"

    ], (
      arrayUtils,
      CreateChart,
      DownloadPDF,
      ToggleSidebar,
      CreateStaticTemplates,
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
      FeatureTable,
      LayerList,
      GroupLayer
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
      },
    };

    // Create all Tongass Layers
    const tongass_huc_10 = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassHuc10-outID.geojson",
      renderer: renderer,
      title: 'Tongass HUC 10'
    });
    const tongass_huc_8 = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassHuc8-outID.geojson",
      renderer: renderer,
      title: 'Tongass HUC 8'
    });
    const tongass_huc_6 = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassHuc6-outID.geojson",
      renderer: renderer,
      title: 'Tongass HUC 6'
    });
    const tongass_hex_m = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_M_Tongass-outID.geojson",
      renderer: renderer,
      title: 'Tongass Hexagon (Sm.)'
    });
    const tongass_hex_l = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_L_Tongass-outID.geojson",
      renderer: renderer,
      title: 'Tongass Hexagon (Med.)'
    });
    const tongass_hex_xl = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_XL_Tongass-outID.geojson",
      renderer: renderer,
      title: 'Tongass Hexagon (Lrg.)'
    });
    const tongass_ecosection = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassNationalForestEcologicalSubsections-outID.geojson",
      renderer: renderer,
      title: 'Tongass Eco. Subsections'
    });
    const tongass_lta = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassNationalForestLandTypeAssociations-outID.geojson",
      renderer: renderer,
      title: 'Tongass LTAs'
    });

    // Create all Chugach layers here
    const chugach_huc10 = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-ChugachHuc10-outID.geojson",
      renderer: renderer,
      title: 'Chugach HUC 10'
    });
    const chugach_huc8 = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-ChugachHuc8-outID.geojson",
      renderer: renderer,
      title: 'Chugach HUC 8'
    });
    const chugach_huc6 = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-ChugachHuc6-outID.geojson",
      renderer: renderer,
      title: 'Chugach HUC 6'
    });
    const chugach_natl_forest_boundary = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Chugach_National_Forest_Boundary-outID.geojson",
      renderer: renderer,
      title: 'Chugach NF Boundary'
    });
    const chugach_natl_forest_ecosection = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Chugach_National_Forest_Ecosection-outID.geojson",
      renderer: renderer,
      title: 'Chugach Eco. Subsections'
    });
    const chugach_natl_forest_lta = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Chugach_National_Forest_Land_Type_Association-outID.geojson",
      renderer: renderer,
      title: 'Chugach LTAs'
    });
    const chugach_natl_forest_hex_m = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_M_Chugach-outID.geojson",
      renderer: renderer,
      title: 'Chugach Hexagaons (Sm.)'
    });
    const chugach_natl_forest_hex_l = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_L_Chugach-outID.geojson",
      renderer: renderer,
      title: 'Chugach Hexagons (Med.)'
    });
    const chugach_natl_forest_hex_xl = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_XL_Chugach-outID.geojson",
      renderer: renderer,
      title: 'Chugach Hexagons (Lrg.)'
    });

    // First instance of layer
    let layer = new GeoJSONLayer({
      url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_XL_Chugach-outID.geojson",
      renderer: renderer,
      title: 'Chugach Hexagons (Lrg.)'
    });

    const map = new Map({
      basemap: "hybrid",
      // layers: [group_layer_Chugach, group_layer_Tongass]
      layers: [layer]
    });

    // Map view - visualize map and pass it to html div element.
    const view = new MapView({
      map: map,
      container: "main-map",
      highlightOptions: {
        color: "orange"
      },
      // extent: map.extent
      zoom: 6,
      center: [-141, 60]
      // extent: map.Extent
    });

    // *** BELOW SEE STEPS TAKEN AFTER MAP VIEW IS RENDERED ***

    // view.when().then(()=>{
    view.when().then(() => {

      const radio_button_layer_dict = {
        "chugach-huc10-radio-wrapper": chugach_huc10,
        "chugach-huc8-radio-wrapper": chugach_huc8,
        "chugach-huc6-radio-wrapper": chugach_huc6,
        "chugach-small-hex-radio-wrapper": chugach_natl_forest_hex_m,
        "chugach-med-hex-radio-wrapper": chugach_natl_forest_hex_l,
        "chugach-lrg-hex-radio-wrapper": chugach_natl_forest_hex_xl,
        "chugach-ecosection-radio-wrapper": chugach_natl_forest_ecosection,
        "chugach-lta-radio-wrapper": chugach_natl_forest_lta,
        "chugach-boundary-radio-wrapper": chugach_natl_forest_boundary,
        "tongass-huc10-radio-wrapper": tongass_huc_10,
        "tongass-huc8-radio-wrapper": tongass_huc_8,
        "tongass-huc6-radio-wrapper": tongass_huc_6,
        "tongass-small-hex-radio-wrapper": tongass_hex_m,
        "tongass-med-hex-radio-wrapper": tongass_hex_l,
        "tongass-lrg-hex-radio-wrapper": tongass_hex_xl,
        "tongass-ecosection-radio-wrapper": tongass_ecosection,
        "tongass-lta-radio-wrapper": tongass_lta
      };
  
      // console.log(Object.keys(radio_button_layer_dict)[0]);
  
  
      Object.keys(radio_button_layer_dict).map((r) => {
        const radio_button_div = document.getElementById(r);
        console.log(r);
        console.log(radio_button_div);
        radio_button_div.addEventListener('click', () => {
          layer = radio_button_layer_dict[r];
          view.map = null;

          const map = new Map({
            basemap: "hybrid",
            // layers: [group_layer_Chugach, group_layer_Tongass]
            layers: [layer]
          });

          view.map = map;
          
        })
      });

      // Updated based on whether the user has clilcked or dragged
      let hasUserSelected = false;

      // Create a new query instance, and set some default settings. 
      let query = new Query();
      query.returnGeometry = true;
      query.outFields = null; 
      query.where = "1=1";
      query.num = 50;

      // *INSTANTIATE CLASSES*


      // ONCLICK AND USER SCROLL FUNCTIONALITY FOR SIDE CHART UPDATES. BELOW
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


      view.on("click", (e) => {
        query.geometry = e.mapPoint;
        console.log(e.mapPoint)
        
        layer.queryFeatures(query).then((results) =>{
     
          console.log(results.features.length);
          if(results.features.length>0){
            // $('.lcms-icon').addClass('fa-spin');
            // updateSelectionList(results.features);
            ['Change','Land_Cover','Land_Use'].map((w) => empty_chart.setContentInfo(results,w, "side-chart"));
            // $('.lcms-icon').removeClass('fa-spin');
          }
         });
       });
      // ONCLICK AND USER SCROLL FUNCTIONALITY FOR SIDE CHART UPDATES. ABOVE ^

          /////////////////////////////////////////////////////////////////////////////////////////////////
    //////// CODE TO DRAW RECTANGLE TO SELECT MULTIPLE POLYGON FEATURES 
    ////////////////////////////////////////////////////////////////////////////////////////////////

    function getArea(polygon) {
      // const geodesicArea = geometryEngine.geodesicArea(polygon, "square-kilometers");
      const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");
      // console.log(geodesicArea+"geodes area");
      // console.log(planarArea+"planar area")
      return planarArea;

    }

    let myLayerView;
    layer
      .when(() => {
        view.whenLayerView(layer).then(function (layerView) {
          myLayerView = layerView;
        });
      });
      // .catch(errorCallback);

    // create a new instance of a FeatureTable
    const featureTable = new FeatureTable({
      view: view,
      layer: layer,
      highlightOnRowSelectEnabled: true,
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


              // here we get to use queried features. chart here
              // ['Change','Land_Cover','Land_Use'].map((w) => empty_chart.setContentInfo(results,w,"side-chart"));

              // pass in the query results to the table by calling its selectRows method.
              // This will trigger FeatureTable's selection-change event
              // where we will be setting the feature effect on the csv layer view
              featureTable.filterGeometry = geometry;
              featureTable.selectRows(results.features);
            }
          });
          // .catch(errorCallback);
      }
    }

    function errorCallback(error) {
      console.log("error happened:", error.message);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
      
      // PDF Download Class
      const d_pdf = DownloadPDF({});


      // TOGGLE SIDEBAR VISIBILITY ***
      // Create a function that let you toggle visibility based on mouse click.
      const toggleSidebar = ToggleSidebar({});

      // TOGGLE HAMBURGER - QUESTION VISIBILITY
      toggleSidebar.hamburgerToggle("hamburger", "multilevel-accordion-menu"); //out div, inner div

      toggleSidebar.hamburgerToggle("accordion-item-2", "accordion-item-2-a");

      // toggleSidebar.hamburgerToggle("accordion-item-3", "accordion-item-3-a");
      // toggleSidebar.hamburgerToggle("accordion-item-4", "accordion-item-4-a");

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


      // ************************************************************  // testing function below > 

      const get_clicked_radio = (radio_div_id) => { 
        // should return id of radio div on click, 
        // then do some other stuff
        const radio_button_div = document.getElementById(radio_div_id);
        
        radio_button_div.addEventListener('click', () => {
          console.log("aaaaa");
        })
      };

      // get_clicked_radio('chugach-huc10-radio-select');



      
      // const ids = $('#map-layer-selection-items > .radio-button-wrapper').map(function() {
      //   return this.id || null;
      // }).get();

      // console.log(ids);

      // ************************************************************ // testing function above ^


      // Create an empty chart as CreateChart object
      // const empty_chart = CreateChart({});
      // empty_chart.chartVisibleFeatures(view, layer, ["Change---Fast Loss", "Change---Slow Loss"]);


      // Function used to create a chart. WM moved to 
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

      // return layer
    })
    
    // .then(function (layer) {


    //     // * RESPOND TO USER MOUSE CLICK ON A FEATURE *
    //     // This function will listen for user click, and then apply above query to features, activating our plotting class.
    //     var storeResults = null;
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
    //                 graphics.forEach(function (g) {
    //                   // console.log('graphic:' + g);
  
    //                   var geom = g.graphic.geometry;
    //                   if (geom.type === "polygon") {
    //                     var symbol = new SimpleFillSymbol({
    //                       color: [205, 66, 47, .0001],
    //                       style: "solid",
    //                       outline: {
    //                         color: [249, 226, 76],
    //                         width: 1
    //                       }
    //                     });
    //                     var graphic = new Graphic(geom, symbol);
    //                     //console.log("graphic geom: "+graphic.geometry.Area())
    //                     //results.features[0].planarArea = getArea(graphic.geometry);
    //                     results.features[0].attributes["planarArea"] = getArea(graphic.geometry);
  
    //                     view.graphics.add(graphic);
    //                   }
    //                 });
    //               });
    //             //});
    //             // Chart class
    //               // const c = CreateChart({});
    //               // c.createOutputObj(results, ["Change---Fast Loss"], "side-chart"); // OOF, CHANGE THIS, THIS IS JUST HARDCODED 
    //               // c.setContentInfo(results, "Land_Cover", "side-chart")  
    //               // c.createOutputObj(results, [button_relationships[document.getElementById("tree-shrub-question").value]])
    //               storeResults = results;
    //             }
    //           } //)
    //         });

    //       }

          
    //     });


      // })
  }
);