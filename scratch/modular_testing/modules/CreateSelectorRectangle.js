define([
    "dojo/_base/declare"
], function(declare){

    return declare(null,{

        constructor: function(options){

        },


        // Define functions to allow rectangle to be drawn on map
        createSelectorRectangle: function() {

            function getArea(polygon) {
                // const geodesicArea = geometryEngine.geodesicArea(polygon, "square-kilometers");
                const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");
                // console.log(geodesicArea+"geodes area");
                // console.log(planarArea+"planar area")
                return planarArea;

            }

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

        }


    })
});