
define([
    "modules/CreateChart",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/views/draw/Draw",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/geometry/Multipoint",
    "esri/geometry/geometryEngine",
    "esri/geometry/geometryEngineAsync",
    "dojo/_base/declare"
], function(CreateChart,Graphic,GraphicsLayer,Draw,SketchViewModel, Point, Polygon, Multipoint,geometryEngine,geometryEngineAsync, declare){
    

    return declare(null,{

        constructor: function(options){

        },
        allSelectionFunctions: function(layer,view, map){

            var storeResults = null;

            function getArea(polygon) {
                // const geodesicArea = geometryEngine.geodesicArea(polygon, "square-kilometers");
                const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");
                // console.log(geodesicArea+"geodes area");
                // console.log(planarArea+"planar area")
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
            layer.when(function(){
                view.whenLayerView(layer).then(function(layerView) {
                statesLyrView = layerView;
                });
            })

            const draw = new Draw({
                view: view
            });           

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
            //weird: user must move mouse from multiselected polygons in order for them to get highlighted
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
                    console.log("results "+storeResults.features[0])
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
                    results.features[0].attributes["planarArea"] = totalArea //stores area for all selected polygons not just the first feature
                                                    
                }).catch(function(err){
                console.error(err);
                })
            }
            
        
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
                        storeResults=results
                        console.log("len "+results.features.length)
                        console.log(storeResults+"initial store results");
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
            console.log("final store results"+storeResults);

            return storeResults;

        }//end of allselectionfunction

    })// end of declare
});
