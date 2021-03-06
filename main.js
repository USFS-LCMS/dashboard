/*
Authors: 
- Wyatt McCurdy
- Claire Simpson
- Ian Houseman

Description: 
  This is the main script called by the LCMS data explainer.
  It provides the user with a selection of questions and provides charts using LCMS data.
*/

require([
    "dojo/_base/array",
    "modules/CreateChart",
    "modules/DownloadPDF",
    "modules/ToggleSidebar",
    "modules/CreateLayersDict",
    "modules/CreateImgLayerDict",
    "modules/MetricSelectionButtons",
    "modules/UpdateChartsOnSelection",
    "modules/CreateInfoModalDict",
    "modules/addInformationDropdown",
    "modules/ChartsForVisibleLayers",
    "modules/CreateSlider",
    "modules/test_LayerLoadMessage",
    "esri/Map",
    "esri/views/MapView",
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
    "esri/widgets/Legend",
    "esri/widgets/Expand",
    "esri/views/draw/Draw",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/geometry/Multipoint",
    "dojo/domReady!"

    ], (
      arrayUtils,
      CreateChart,
      DownloadPDF,
      ToggleSidebar,
      CreateLayersDict,
      CreateImgLayerDict,
      MetricSelectionButtons,
      UpdateChartsOnSelection,
      CreateInfoModalDict,
      addInformationDropdown,
      ChartsForVisibleLayers,
      CreateSlider,
      test_LayerLoadMessage,
      Map,
      MapView, 
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
      Legend,
      Expand,
      Draw,
      Point,
      Polygon,
      Multipoint
      ) => {
      
      //   $.ajax({
      //     type: 'GET',
      //     url: `https://storage.googleapis.com/lcms-dashboard/`,
      // }).done(function(json){
      //     console.log(json);
      // })
    // const user_poly_selection_listener = ListentoUserLayerSelection({});

    // *** CREATE DROPDOWN MENUS USING OUR MODULES *** // 

    // Make layers accessible to dropdown
    const ld = CreateLayersDict({});
    const radio_button_layer_dict = ld.createLayersDict();

    // Set the first (default) visible layer
    let layer = radio_button_layer_dict["chugach-lrg-hex-radio-wrapper"]['layer_var'];
    //store layers that are in map
    var featureDict = {"chugach-lrg-hex-radio-wrapper":radio_button_layer_dict["chugach-lrg-hex-radio-wrapper"]['layer_var']}
    console.log(Object.keys(featureDict)[0]+"is feature dict one")

    //layer view dictionary
    let layerDict = {"chugach-lrg-hex-radio-wrapper":null}



    const ild = CreateImgLayerDict({});
    ild.createImgLayerButtons();
    // Add functionality to image layer buttons - link to actual image layers
    const img_layer_dict = ild.createImgLayerDict();
    // Set first (default) image layer
    let img_layer = img_layer_dict['landcover-button-wrapper'];

    ///////// graphs info modal
    
    var modal = document.getElementById("myModal_graph");

    // Get the button that opens the modal for graphs
    var btn = document.getElementById('span_popup_graph');

    // Get the <span> element that closes the modal
    // var span = document.getElementsByClassName("close")[0];
    var span = document.getElementById('close_graph');

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
      modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }

    
    ///////// end of modal


    // Create metric selection buttons

    let on_off_dict = {
      "Change": {},
      "Land_Cover": {},
      "Land_Use": {}
    }


    const metric_button = MetricSelectionButtons({});
    metric_button.createMetricButtons();

    update_charts_watcher = UpdateChartsOnSelection({});
    update_charts_watcher.updateChartOnMetricSelection(on_off_dict);

    let area_type = 'Percentage'

    $('#pct_area_wrapper').on('click', () => {
        if ( $('#pct-area-radio-select').prop('checked') === true ) {
            console.log("ITS TRUE - PCT AREA")
            area_type = 'Percentage'
        }
    });

    $('#acres_wrapper').on('click', () => {
        if ( $('#acres-radio-select').prop('checked') === true ) {
            console.log("ITS TRUE - ACRES")
            area_type = 'Acres'
        }
    });

    $('#hectares_wrapper').on('click', () => {
        if ( $('#hectares-radio-select').prop('checked') === true ) {
            console.log("ITS TRUE - HECTARES")
            area_type = 'Hectares'
        }
    });

    const info_dropdown = addInformationDropdown({});
    info_dropdown.addInfo();

    //modal

    const modalinfos = CreateInfoModalDict({});
    modalinfos.createModals();
    modalinfos.createInfoModalDict();

        // Test Layer Loading message

        const llmm = test_LayerLoadMessage({});
        llmm.testMessage(layerDict);
    
        // test ends here

    // LOAD IN LAYERS - look in template for layer list widget. 

    // const layer = new GeoJSONLayer({
    //   url: "../../geojson/LCMS-Summaries-Chugach_National_Forest_Ecosection-outID.geojson",//"https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Chugach_National_Forest_Ecosection-outID.geojson",
    //   renderer: renderer
    // });


    // Set up chart for visible layer class object
    const charts_for_vis_layers = ChartsForVisibleLayers({});

    // analysis years for slider
    const analysis_years = {
      'start_year': 1985,
      'end_year' : 2020
    };

    slider_create = CreateSlider({});

    slider_create.createSliderLabels(analysis_years);
    // console.log($('#changing-start-year').innerHTML)
    // var targetObj = {};
    var analysis_yr_prox = new Proxy(analysis_years, {
      set: function (target, key, value) {
          console.log(`${key} set to ${value}`);
          target[key] = value;

          // Update analysis years
          // $('#changing-start-year').innerHTML = ``;
          // $('#changing-start-year').innerHTML = `${analysis_years['start_year']}`;
          // console.log($('changing-start-year').innerHTML);

          if (Object.keys(resultsDict).length==0){
            charts_for_vis_layers.toggleVisibleLayersDict('layer-check-button', radio_button_layer_dict);
            charts_for_vis_layers.makeVisibleLayerCharts(radio_button_layer_dict, thisDict, 'side-chart-canvas-container', on_off_dict, analysis_years['start_year'], analysis_years['end_year'], area_type);
          }else{
            charts_for_vis_layers.toggleVisibleLayersDict('layer-check-button', radio_button_layer_dict);
            charts_for_vis_layers.makeVisibleLayerCharts(radio_button_layer_dict, resultsDict, 'side-chart-canvas-container', on_off_dict, analysis_years['start_year'], analysis_years['end_year'], area_type);
          
          }
          // charts_for_vis_layers.toggleVisibleLayersDict('layer-check-button', radio_button_layer_dict);
          // charts_for_vis_layers.makeVisibleLayerCharts(radio_button_layer_dict, view.extent, 'side-chart-canvas-container', on_off_dict, analysis_years['start_year'], analysis_years['end_year']);

          return true;
      }
    });

    // slider

    slider_create.createSlider(analysis_yr_prox);

   
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
    });
    var storeResults = null;
    var resultsDict = {};
    var thisDict={};
    var extentDict={};

    function refreshFunc() {
      // $('#side-chart-canvas-container').innerHTML = '';    
      if (Object.keys(resultsDict).length==0){
        console.log('results_dict= length 0')
        console.log(Object.keys(thisDict))

        Object.keys(featureDict).forEach((ft) =>{  
          console.log("FEATDICT FT:"+ft)
          //for each feature that has been checked on(which happens when teh checkbox is clicked)
        //query the feature class by the view extent
        
          featureDict[ft].queryFeatures({
            geometry: view.extent,
            returnGeometry:true
          }).then((results =>{
            console.log("HAS BEEN queried")
            if(results.features.length>0){
              if (radio_button_layer_dict[ft]['is_visible']  ===true){
                console.log("(7) TRUEEE")                             
                thisDict[ft]=results
              }
            }
            // return 0
          }))
        })
          charts_for_vis_layers.toggleVisibleLayersDict('layer-check-button', radio_button_layer_dict);
          charts_for_vis_layers.makeVisibleLayerCharts(radio_button_layer_dict, thisDict, 'side-chart-canvas-container', on_off_dict, analysis_years['start_year'], analysis_years['end_year'], area_type);
      
      }else{
        console.log('resultsdict length >0!!!!!!')
        charts_for_vis_layers.toggleVisibleLayersDict('layer-check-button', radio_button_layer_dict);
        charts_for_vis_layers.makeVisibleLayerCharts(radio_button_layer_dict, resultsDict, 'side-chart-canvas-container', on_off_dict, analysis_years['start_year'], analysis_years['end_year'], area_type); 
      
      }
    }
    const refreshButton = document.getElementById('refresh_graphs');
    refreshButton.addEventListener('click', () => {
      refreshFunc();      
    })

   



    // Call the user selection listener for results dict
    // user_poly_selection_listener.listenToSelection(resultsDict);


    // *** BELOW SEE STEPS TAKEN AFTER MAP VIEW IS RENDERED ***

    view.when().then(()=>{
      
      map.add(img_layer);


      // Create legend and an expand/contract widget so that user can get rid of it.
      let legend = new Legend({
        view: view,
        container: document.createElement('div')
      });
      
      

      const legend_expand = new Expand({
        view: view, 
        content: legend
      });
      
      view.ui.add(legend_expand, "bottom-right");
      

      // map.add(radio_button_layer_dict['tongass-boundary-radio-wrapper']['layer_var'])

      // Add selection functionality to image layers
      Object.keys(img_layer_dict).map((r) => {
        const radio_button_div = document.getElementById(r);
        if (img_layer_dict[r] !=null){
          radio_button_div.addEventListener('change', (e) => {
            console.log(e);
            console.log("R is ", r);
            llmm.showLoader(r.replace('-wrapper', '-spinner'));
            //set highlight to null or hightlight will reference removed layer and cause error "[esri.views.2d.layers.FeatureLayerView2D] Error: Connection closed" 
            //highlight=null                    
              map.remove(img_layer);
              img_layer = img_layer_dict[r];            
              map.add(img_layer);        
              img_layer.when(function() {
                view.whenLayerView(img_layer).then(function(layerView){
                  llmm.hideLoader(r.replace('-wrapper', '-spinner'))
                })
              })
            
          })
      }else{ //button to clear all
        radio_button_div.addEventListener('click',()=>{
          map.remove(img_layer);
        })
      }
      });

      // Map over the html hooks for each available layer in vector layer selection list. 
      Object.keys(radio_button_layer_dict).map((r) => {
        // Add an event listener to each radio button
        const radio_button_div = document.getElementById(r);
        radio_button_div.addEventListener('change', e => {
          layer = radio_button_layer_dict[r]['layer_var'];
          if (e.target.checked){
            featureDict[r]= layer;
            highlight=null;
            console.log("checkbox is checked")
            console.log(Object.keys(featureDict));
            

            // Add in a spinner below
            llmm.showLoader(r.replace('-wrapper', '-spinner'));

            map.add(layer);
            layer.when(function(){
              view.whenLayerView(layer).then(function(layerView) {
                llmm.hideLoader(r.replace('-wrapper', '-spinner'))
                statesLyrView = layerView;
                layerDict[r] = layerView;
              });
            })
            
          }
          else{
            delete featureDict[r]
            delete layerDict[r];
            delete resultsDict[r];
            delete extentDict[r];
            console.log("checkbox is NOT checked..");
            //set highlight to null or hightlight will reference removed layer and cause error "[esri.views.2d.layers.FeatureLayerView2D] Error: Connection closed" 
            highlight=null;
            map.remove(layer);
          }        
          
        })
      });


      // Zoom 2 ext of layer!
      //Object.values(featureDict)[0]
      Object.values(featureDict)[0].when(()=>{
        // console.log('setting extent');
        view.goTo(layer.fullExtent)
      });

      // const selectorElement = document.getElementById("features-select"); MAYBE BRING BACK LATER
      //const screenshotDiv = document.getElementById("screenshotDiv");

      // Updated based on whether the user has clilcked or dragged
      let hasUserSelected = false;

      // Create a new query instance, and set some default settings. 
      let query = new Query();
      // query.returnGeometry = true;
      // query.outFields = null; 
      // query.where = "1=1";
      // query.num = 50;

      // Create an empty chart object/canvas to fill with LCMS metrics
      empty_chart = CreateChart({});

      // Make sure chart updates when click event happens on layer selection buttons

      $('.check-button-wrapper').on('click', () => {
        
        console.log("1.ANOTHER FEATURE SET HAS BEEN CLICKED")
        refreshFunc();  
        // thisDict={}
        // if ( Object.keys(resultsDict).length !=0){
        //   //if there are some selected objects, do nothing, but reset thisDict
        //   console.log("results dict NOT 0 ")          
        // }else{

        // }
      })
          // console.log("2.feature dict keus:")
          // console.log(Object.keys(featureDict))
          // Object.keys(featureDict).forEach((ft) =>{  
          //   //seems to first iterate through this, 
          //   console.log("4.And this ft:"+ft)
          //   console.log(featureDict[ft]);
          //   // console.log("another feature");
          //   featureDict[ft].queryFeatures({
          //       geometry: view.extent,
          //       returnGeometry: true
          //   }).then( (results) => {  
          //     //then iterate through this            
          //     console.log("5.How many feats in view:"+results.features.length);              
          //     if(results.features.length>0){
          //       if (Object.keys(resultsDict).length==0){
          //         //i.e. if user hasnt selected any features
          //         // Temporarily clear all side chart divs  
          //         $('#side-chart-canvas-container').innerHTML = '';                                                         
          //         charts_for_vis_layers.toggleVisibleLayersDict('layer-check-button', radio_button_layer_dict);                  
          //         // Object.keys(radio_button_layer_dict).forEach((k)=>{
          //         //   //all the results are being set teh saem!!!!
          //         //   if (radio_button_layer_dict[k]['is_visible']  ===true){
          //         //     thisDict[k]=results
          //         //   }
          //         // });
          //         console.log(ft+'is wrapper (6)')
          //         if (radio_button_layer_dict[ft]['is_visible']  ===true){
          //           console.log("(7) TRUEEE")
          //           thisDict[ft]=results
          //         }
          //         console.log("8.thisDICT RESULTS:")
          //         console.log(thisDict)
          //         console.log(Object.keys(thisDict).length)
          //         console.log("11.IS LENGTH")
          //         console.log(radio_button_layer_dict)
          //         charts_for_vis_layers.makeVisibleLayerCharts(radio_button_layer_dict, thisDict, 'side-chart-canvas-container', on_off_dict, analysis_years['start_year'], analysis_years['end_year'], area_type);

      //           }
      //             // Call function below
      //             // console.log(metric_button.on_off_dict)
      //             // ['Change','Land_Cover','Land_Use'].map((w) => empty_chart.setContentInfo(results,w,"side-chart", on_off_dict));
      //             // $('.checkbox-wrapper').on('click', (() => {
      //             //   ['Change','Land_Cover','Land_Use'].map((w) => empty_chart.setContentInfo(results,w,"side-chart", on_off_dict));
      //             // } ))
                  
      //         }
      //     });
      //   });

      //   }      
      //   // charts_for_vis_layers.toggleVisibleLayersDict('layer-check-button', radio_button_layer_dict);
      //   // charts_for_vis_layers.makeVisibleLayerCharts(radio_button_layer_dict, view.extent, 'side-chart-canvas-container', on_off_dict, analysis_years['start_year'], analysis_years['end_year']);
      // })


      // Below, watch for movement of map and update charts based on visible features.
      let pastExtent = view.extent;

      let stillComputing = false;

      $('#side-chart').append(`<div id="side-chart-canvas-container"></div>`);

      
      // Watch extent to see if user is panning or zooming
      view.watch('extent', function(evt){
          // If something is still happening, hold off, watch, wait
          if(!stillComputing){
              viewWatched = true;
              setTimeout( () => {
                  // If we've stopped navigating, run a query of features
                  if(!view.navigating  && viewWatched  && pastExtent !== view.extent) {
                      pastExtent = view.extent;
                      // console.log(on_off_dict)
                      thisDict={}
                                    
                      Object.keys(featureDict).forEach((ft) =>{  
                        // console.log("another feature");
                        featureDict[ft].queryFeatures({
                          geometry: view.extent,
                          returnGeometry: true
                      }).then( (results) => {
                          
                          // console.log(results.features.length);
                          stillComputing = true;
                          if(results.features.length>0){

                            console.log("NOTE: Charts will display for extent if no features are selected AND the view has changed after user unselected the feature")
                            if (Object.keys(resultsDict).length==0){
                              //i.e. if user hasnt selected any features

                              console.log("setting graph from view extent (NOT features)")
                              // Temporarily clear all side chart divs  
                              $('#side-chart-canvas-container').innerHTML = '';                                                                   

                              charts_for_vis_layers.toggleVisibleLayersDict('layer-check-button', radio_button_layer_dict);

                              
                              console.log("results.features.len"+results.features.length)
                              // Object.keys(radio_button_layer_dict).forEach((k)=>{
                                if (radio_button_layer_dict[ft]['is_visible']  ===true){
                                  thisDict[ft]=results
                                }
                              // });

                              charts_for_vis_layers.makeVisibleLayerCharts(radio_button_layer_dict, thisDict, 'side-chart-canvas-container', on_off_dict, analysis_years['start_year'], analysis_years['end_year'], area_type);
                            }
                              // Call function below
                              // console.log(metric_button.on_off_dict)
                              // ['Change','Land_Cover','Land_Use'].map((w) => empty_chart.setContentInfo(results,w,"side-chart", on_off_dict));
                              // $('.checkbox-wrapper').on('click', (() => {
                              //   ['Change','Land_Cover','Land_Use'].map((w) => empty_chart.setContentInfo(results,w,"side-chart", on_off_dict));
                              // } ))
                              stillComputing = false;
                              viewWatched = false;
                          }else{
                              viewWatched = false; 
                          };
                      });
                    });

                      // Get a dictionary and list of visible layers - update.
                      
                  }
              }, 1000)
          }
      })
      /////////////////////////////////////////////////////////////////////////////////////////////////
      ///// CODE TO CTRL+CLICK + selection by rectangle TO SELECT MULTIPLE POLYGONS
      ////////////////////////////////////////////////////////////////////////////////////////////////////


      /*
      1. when checkbox is checked, make sure layer displays
      2. when selecting, iterate through layers and select all underlying layers
      3. when creating table, iterate through each feat. in storeResults to add new row for each
      4. fix area calc (currently calcs total area for first feature)
      5. in report, iterate through each feature class and create new page for each with its own charts/tables
      */

      function getArea(polygon) {
          // const geodesicArea = geometryEngine.geodesicArea(polygon, "square-kilometers");
          const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");
         
          return planarArea;
    
        }
    

      //set up variables
      const pntGraphics = new GraphicsLayer();
      let viewClickEvtHandler = null, viewMouseMoveEvtHandler = null;
      let drawPnt, graphic, ctrlKey = false, moveCtrlKey = false, highlight, statesLyrView;

      //set up renderers (symbologies)
      // var renderer = {
      //     type: "simple", // autocasts as new SimpleRenderer()
      //     symbol: {
      //         type: "simple-fill", // autocasts as new SimpleFillSymbol()
      //         color: [255, 255, 255, 0.5],
      //         style: "none",
      //         outline: {  // autocasts as new SimpleLineSymbol()
      //         color: "white",
      //         width: 2
      //         }
      //     }
      //     };  
      var sym = {
          // cursor point symbol for when selecting by point or ctrl+clicking
              type: "simple-marker",
              style: "circle",
              color: [0, 255, 255, 0.6],
              size: "8px",
              outline: {
              color: [0, 255, 255, 1],
              width: 1
              }
          };         

      //initialize layer view to current layer view
      Object.values(featureDict)[0].when(function(){
          view.whenLayerView(Object.values(featureDict)[0]).then(function(layerView) {
          statesLyrView = layerView;
          layerDict[Object.keys(featureDict)[0]] = layerView;
          });
      })

      const draw = new Draw({
          view: view
      });     
      
      
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
      let highlights = []
      
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
          // Object.values(layerDict).forEach((l)=>{
          //   if (highlight) {
          //     highlight.remove();
          //     }

          // });  
        //remove highlight from multiple layers at once
        if (highlights.length > 0) {
          console.log(highlights.length+"len of highlight")
          highlights.forEach(function(highlight) {
            highlight.remove();
          });
          highlights = [];
          resultsDict={};
        }else if(highlight){
          highlight.remove()
          highlights = [];
          resultsDict={};
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
      //weird: user must move mouse from multiselected polygons in order for them to get highlighted
      //ie event to trigger highlight is move of mouse without ctrl clicked
      //need to highlight selected feature as soon as as mouse clicks 
      //i.e. NOT when draw event is over I guess
      

      function selectStates(){
          console.log("selectStates")
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
          // remove existing highlighted features
          if(highlight){
            console.log("highlight [used to be] removed within selectStates function")
            //highlight.remove();//possible issue with removing highglights bc we don't reset highlights the list to []
            resultsDict={};
            extentDict={};
          }
          

          Object.keys(featureDict).forEach((r) =>{ //iterate through each selected feature class
            
            var layer =featureDict[r]
            // console.log("now...")
            // console.log(layer);

            layer.queryFeatures(query,{returnGeometry:true}).then(function(results){

              storeResults=results
              resultsDict[r] = results
              console.log(Object.keys(resultsDict).length+"is RESULTS DICT LEN")
              
              console.log(resultsDict)
              const graphics = results.features; 
              //view.goTo(graphics)

              // highlight query results
              console.log(layerDict[r]+" is layer dict [r]")
              highlight = layerDict[r].highlight(graphics);
              highlights.push(highlight);

              //zoom to selected (queried) features
              layer.queryExtent(query).then((response) => {
                console.log("added to extent dict:" + r)
                extentDict[r]=response.extent;
                //zoom to query extent (or union of multiple query extents)
                if (Object.keys(resultsDict).length ===1){
                  view.goTo(response.extent.expand(1.25)).catch((error) => {
                    console.error(error);
                    })

                }else{
                  var outExt=0;//response.extent;
                  
                  Object.keys(resultsDict).forEach((res)=>{
                    
                    thisExt=extentDict[res];
                    console.log("zoomi g to mulitple fcs")
                    // console.log(thisExt.xmin+"is x min")
                    console.log(res)
                    try{
                      if (outExt !=0){
                        outExt = outExt.union(thisExt);
                      }else{
                        outExt=thisExt;
                      }
                      console.log("COMPLETED")
                    }
                    catch(err){
                      console.log("cannot zoom")
                      console.log("err"+err)
                    }
                    
                    // console.log(outExt)
                  })

                  view.goTo(outExt).catch((error) => {
                    console.error(error);
                  })

                }

                
                //var newext= zoomToAllResults(resultsDict)//, response.extent);
                //response.extent.union(resultsDict)
                //zoomToAllResults(re)
                // view.goTo(response.extent.expand(1.25)).catch((error) => {
                  
            });

               // view.ui.add("point-button", "top-left");
      

              
              // empty_chart = CreateChart({});
              // ['Change','Land_Cover','Land_Use'].map((w) => empty_chart.setContentInfo(results,w,"side-chart", on_off_dict));
              // $('.checkbox-wrapper').on('click', (() => {
              //   ['Change','Land_Cover','Land_Use'].map((w) => empty_chart.setContentInfo(results,w,"side-chart", on_off_dict));
              // } ))
              
              // // remove existing highlighted features
              // if (highlight) {
              //     highlight.remove();
              // }
              
              console.log("setting chart from click")

              $('#side-chart-canvas-container').innerHTML = ''; 
              
              //NOTE there is some error here
              charts_for_vis_layers.toggleVisibleLayersDict('layer-check-button', radio_button_layer_dict);

              charts_for_vis_layers.makeVisibleLayerCharts(radio_button_layer_dict, resultsDict, 'side-chart-canvas-container', on_off_dict, analysis_years['start_year'], analysis_years['end_year'], area_type);


          

              
              pntGraphics.removeAll();
              ////
              var totalArea=0;
              console.log("Number of features: "+results.features.length)
              var j=-1
              graphics.forEach(function (g) {         
                  j+=1                
                  //get geometry of each selected features and turn it into a graphic for area calculation
                  var geom = g.geometry;                  
                  if (geom.type === "polygon") {     
                      var graphicTemp = new Graphic(geom);                            
                      totalArea += getArea(graphicTemp.geometry);
                      console.log("total area:"+totalArea)  
                      results.features[j].attributes["planarArea"] = getArea(graphicTemp.geometry);             
                  }
              });
              //results.features[0].attributes["planarArea"] = totalArea //stores area for all selected polygons not just the first feature

          }).catch(function(err){
          console.error(err);
          })
          //tried here


          });
          //tried here
          
      }      
      /////////////////////// SELECT BY RECTANGLE ////////////////////////////////////////
  
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
          if (highlights.length > 0) {
            console.log(highlights.length+"len of highlight")
            highlights.forEach(function(highlight) {
              highlight.remove();
            });
            highlights = [];
            resultsDict={};
          }else if(highlight){
            highlight.remove()
            highlights = [];
            resultsDict={};
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
              highlight.remove(); //possible isse with removing from highlights[]
          }
          Object.keys(featureDict).forEach((r) =>{            
            var layer =featureDict[r];
            var layrView = layerDict[r];
            console.log("now..."+layer)
          if (layrView) {
              // create a query and set its geometry parameter to the
              // rectangle that was drawn on the view
            
              const query = {
              geometry: geometry,
              outFields: ["*"],
              outSpatialReference: view.spatialReference,
              returnGeometry:true
              };
              // query graphics from the csv layer view. Geometry set for the query
              // can be polygon for point features and only intersecting geometries are returned
              layer//statesLyrView
              .queryFeatures(query, {returnGeometry:true})
              .then((results) => {
                  storeResults=results
                  resultsDict[r] = results
                  console.log("len "+results.features.length)
                  if (results.features.length === 0) {
                    delete resultsDict[r]
                    delete extentDict[r]
                    
                    //clearSelection();

                  } else {
                  //zoom to selected (queried) features
                  layer.queryExtent(query).then((response) => {
                      view.goTo(response.extent.expand(1.25)).catch((error) => {
                      console.error(error);
                  })});

                  var totalArea=0;
                  const newGraphics = results.features;
                  var k=-1
                  newGraphics.forEach(function (g) {         
                      k+=1                
                      //get geometry of each selected features and turn it into a graphic for area calculation
                      var geom = g.geometry;                  
                      if (geom.type === "polygon") {     
                          var graphicTemp = new Graphic(geom);                            
                          // totalArea += getArea(graphicTemp.geometry);
                          // console.log("total area:"+totalArea)  
                          results.features[k].attributes["planarArea"] = getArea(graphicTemp.geometry);             
                      }
                  });
                  highlight = layrView.highlight(results.features);
                  highlights.push(highlight);

                  // here we get to use queried features. chart here
                  $('#side-chart-canvas-container').innerHTML = ''; 

                  
                  charts_for_vis_layers.toggleVisibleLayersDict('layer-check-button', radio_button_layer_dict);

                  charts_for_vis_layers.makeVisibleLayerCharts(radio_button_layer_dict, resultsDict, 'side-chart-canvas-container', on_off_dict,analysis_years['start_year'], analysis_years['end_year'], area_type);


                  // empty_chart = CreateChart({});
                  // ['Change','Land_Cover','Land_Use'].map((w) => empty_chart.setContentInfo(results,w,"side-chart",on_off_dict));

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
        });
      }

      function errorCallback(error) {
      console.log("error happened:", error.message);
      }
      console.log("final store results"+storeResults);

      
      // ////////////////////////////////////////////////////////////////////////////////////////////////
      
      
      // TOGGLE SIDEBAR VISIBILITY ***
      // Create a function that let you toggle visibility based on mouse click.
      const toggleSidebar = ToggleSidebar({});

      // TOGGLE HAMBURGER - QUESTION VISIBILITY
      toggleSidebar.hamburgerToggle("hamburger", "multilevel-accordion-menu"); //out div, inner div

      toggleSidebar.hamburgerToggle("accordion-item-2", "accordion-item-2-a");

      //toggleSidebar.hamburgerToggle("accordion-item-3", "accordion-item-3-a");
      //toggleSidebar.hamburgerToggle("accordion-item-4", "accordion-item-4-a");

      toggleSidebar.hamburgerToggle("accordion-item-1", "r10-questions");
      // toggleSidebar.hamburgerToggle("climate-qs", "accordion-item-1-a");
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

      // CHANGE NECESSARY HERE. NEED TO DO THIS FOR ALL QUESTIONS. !!??
      // document.getElementById("accordion-item-1-a").onclick = () => {
      //   if (document.getElementById("chart-canvas") != null){
      //     document.getElementById("chart-canvas").remove();
      // };

      //   p.textContent="Please Select a question.";
      //   // document.getElementById("side-chart").innerHTML = "";
      //   // p.innerHTML = "";

      //   // assumes that we have a blank dropdown menu 
      //   if ( document.getElementById("accordion-item-1-a").value == "" ){
          
      //     // Ask user to select question if they have not yet.
      //     p.textContent = "Please select a question.";
      //   }
      //   else {
      //     // if no blank value, clear out the chart 
      //     p.textContent = "";

      //     p.textContent = c.createOutputObj(null, ["null"]); //NOTE!!!?? ** c is not defined
      //   }
      // }

      return layer
    })

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
        // console.log("dictionary of results: "+resultsDict)
        //console.log(document.querySelectorAll('*[id]'))
        d_pdf.downloadPDF(resultsDict); //wait 7 ms before running function to let charts load (does this work?)

      });


    });
      //})
  }
);