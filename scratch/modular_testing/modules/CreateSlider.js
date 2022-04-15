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

            // Set up labels on top of slider 
            slider_label_start = analysis_years['start_year'];
            slider_label_end = analysis_years['end_year'];



            // $('#year-slider-items').append(slider_label_end);


            $( function() {
                $( "#year-slider-container" ).slider({
                  range: true,
                  min: 1985,
                  max: 2020,
                  step: 1,
                  values: [ 1985, 2020 ],
                  slide: function( event, ui ) {
                    // chart
                    console.log("UI VALS: ", ui.values);
                    analysis_years['start_year'] = ui.values[0];
                    analysis_years['end_year'] = ui.values[1];

                    $('#changing-start-year').text(`${ui.values[0]}`);
                    $('#changing-end-year').text(`${ui.values[1]}`);
                    
                  }
                
                });
              
              });
            
            // Text align sub headings
            $("#year-slider").css("text-align", "left");
            $("#year-slider").css("cursor", "pointer");
            
            
            // Hide sub-type names and options buttons.
            $("#year-slider-items").css("display", "none");

        },
        
        
        createSliderLabels: function(analysis_years) {
          $('#year-slider-items').append(`
          <div id="slider-start-year-label">
            <h3 class="start-end-year-label">Start Year: </h3>
            <h3 class="start-end-year-label" id="changing-start-year">${analysis_years['start_year']}</h3>
          </div>
          <div id="slider-end-year-label">
            <h3 class="start-end-year-label">End Year: </h3>
            <h3 class="start-end-year-label" id="changing-end-year">${analysis_years['end_year']}</h3>
          </div>
          <div id='year-slider-container'></div>
          `);
        }

    })
});