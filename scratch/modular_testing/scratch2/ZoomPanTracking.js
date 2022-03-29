define([
    "dojo/_base/declare"
], function(declare){

    return declare(null,{

        outputResults: null,

        constructor: function(options){

        },

        // Insert a function that will log all of the features currently visible after panning and zooming
        getVisibleFeatures: function(in_view, in_layer) {

            let pastExtent = in_view.extent;

            let stillComputing = false;

            // Watch extent to see if user is panning or zooming
            in_view.watch('extent', function(evt){
                // If something is still happening, hold off, watch, wait
                if(!stillComputing){
                    viewWatched = true;
                    setTimeout( () => {
                        // If we've stopped navigating, run a query of features
                        if(!in_view.navigating  && viewWatched  && pastExtent !== in_view.extent) {
                            pastExtent = in_view.extent;
                            in_layer.queryFeatures({
                                geometry: in_view.extent,
                                returnGeometry: true
                            }).then( (results) => {
                                // console.log(results.features.length);
                                stillComputing = true;
                                if(results.features.length>0){
                                    // return results;
                                    // Create top output - changes
                                    console.log(results);

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

        }

    
    })
});