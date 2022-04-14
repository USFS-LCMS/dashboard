define([
    "dojo/_base/declare",
    "modules/ChartsForVisibleLayers"

], function(declare, ChartsForVisibleLayers){

    return declare(null,{

        output_features: null,

        constructor: function(options){

        },

        createSlider: function(analysis_years) {

            visible_layer_chart = ChartsForVisibleLayers({});

            $( function() {
                $( "#year-slider-items" ).slider({
                  range: true,
                  min: 1985,
                  max: 2020,
                  step: 5,
                  values: [ 1985, 2020 ],
                  slide: function( event, ui ) {
                    // chart
                    console.log("UI VALS: ", ui.values);
                    analysis_years['start_year'] = ui.values[0];
                    analysis_years['end_year'] = ui.values[1];

                    
                  }
                });
              });
            
            // // Text align sub headings
            $("#year-slider").css("text-align", "left");
            $("#year-slider").css("cursor", "pointer");
            
            
            // Hide sub-type names and options buttons.
            $("#year-slider-items").css("display", "none");
        }
        

    })
});