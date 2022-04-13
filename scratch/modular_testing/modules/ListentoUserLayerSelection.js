/*
This module will check to see whether a user has completed a rectangle selection or point selection.
If the user has indeed completed a rectangle or point selection, the charts will not update 
based on whether the user is panning or zooming. 


inputs: 1) dictionary of selected features
outputs: 1) none - chart will only update if there are no manually selected features
*/

define([
    "dojo/_base/declare"
], function(
    declare,
    GeoJSONLayer
    ){
 
    return declare(null,{

        constructor: function(options){
            
        },

        listenToSelection: (results_dict) => {

            // Reminder: results dict gets populated by manual selection by the user. Format below.
            /*
            results_dict =  {
                'chugach-lrg-hex-radio-wrapper': n, 
                'example-name-radio-wrapper': n
            } 
            
            - n being a layer promise
            */

            // Set up a proxy to watch the dictionary.
            

        }

    })
});