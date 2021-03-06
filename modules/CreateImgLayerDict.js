
define([
    "dojo/_base/declare",
    "esri/layers/ImageryLayer",
    "modules/ToggleSidebar",

    "esri/layers/support/DimensionalDefinition",
    "esri/layers/support/MosaicRule"
], function(
    declare,
    ImageryLayer,
    ToggleSidebar,
    DimensionalDefinition,
    MosaicRule
    ){
 
    return declare(null,{

        constructor: function(options){
            
        },
       

        createImgLayerDict: function() {

           
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
        function maskPixels(pixelData) {
          if (pixelData == null || pixelData.pixelBlock == null) {
            return;
          }

          // The pixelBlock stores the values of all pixels visible in the view
          const pixelBlock = pixelData.pixelBlock;
          // The pixels visible in the view
          const pixels = pixelBlock.pixels;
          let mask = pixelBlock.mask;

          // The number of pixels in the pixelBlock
          const numPixels = pixelBlock.width * pixelBlock.height;

          // Get the pixels containing temperature values in the only band of the data
          const tempBand = pixels[0];
          const p1 = pixels[0];

          if (mask == null) {
            mask = new Uint8Array(p1.length); //mask = new Uint8Array(p1.length);
            mask.fill(1);
            pixelBlock.mask = mask;
          }

          // Loop through all the pixels in the view
          for (let i = 0; i < numPixels; i++) {
            // skip noData pixels
            if (mask[i] ===0) {
              continue;
            }
            const tempValue = tempBand[i];
            const red = (tempValue - minVal) * factor;
            mask[i] =
              p1[i] >= Math.floor(currentMin) && p1[i] <= Math.floor(currentMax)
                ? 1
                : 0;

            //apply color based on temperature value of each pixel
            if (mask[i]) {
              // p[i] = Math.floor((p1[i] - minVal) * factor);
              rBand[i] = red;
              gBand[i] = 0;
              bBand[i] = 255 - red;
            }
          }

          // Set the new pixel values on the pixelBlock
          pixelData.pixelBlock.pixels = [rBand, gBand, bBand]; //assign rgb values to each pixel
          pixelData.pixelBlock.statistics = null;
          pixelData.pixelBlock.pixelType = "u8";
        }

          let mosaicRule = new MosaicRule({
            operation: 'last', // pulling last image from feature collection
            
          });
          // let multidimensionalDefinition = [];
          // multidimensionalDefinition.push(
          //   new DimensionalDefinition({
          //     dimensionName: "StdTime",
          //     // values: [starttime_unixmillis, endtime_unixmillis]
          //     values: [new Date('2018-12-31').getTime(), new Date('2021-12-31').getTime()]
          //   })
          // )

          

          // Get an assortment of raster layers from image server
          const annual_landcover = new ImageryLayer({
              url: "https://apps.fs.usda.gov/fsgisx01/rest/services/RDW_LandscapeAndWildlife/LCMS_Southeast_Alaska_Annual_Landcover/ImageServer",
              format: "jpgpng", // server exports in either jpg or png format
              mosaicRule: mosaicRule
          });

          const annual_landuse = new ImageryLayer({
              url: "https://apps.fs.usda.gov/fsgisx01/rest/services/RDW_LandscapeAndWildlife/LCMS_Southeast_Alaska_Annual_Landuse/ImageServer",
              format: "jpgpng", // server exports in either jpg or png format
              mosaicRule: mosaicRule
          });

          const most_rec_year_fast_loss = new ImageryLayer({
              url: "https://apps.fs.usda.gov/fsgisx01/rest/services/RDW_LandscapeAndWildlife/LCMS_Southeast_Alaska_Most_Recent_Year_Of_Fast_Loss/ImageServer",
              format: "jpgpng", // server exports in either jpg or png format
              mosaicRule: mosaicRule
          });

          const most_rec_year_gain = new ImageryLayer({
              url: "https://apps.fs.usda.gov/fsgisx01/rest/services/RDW_LandscapeAndWildlife/LCMS_Southeast_Alaska_Most_Recent_Year_Of_Gain/ImageServer",
              format: "jpgpng", // server exports in either jpg or png format
              mosaicRule: mosaicRule
          });

          const most_rec_year_slow_loss = new ImageryLayer({
              url: "https://apps.fs.usda.gov/fsgisx01/rest/services/RDW_LandscapeAndWildlife/LCMS_Southeast_Alaska_Most_Recent_Year_Of_Slow_Loss/ImageServer",
              format: "jpgpng", // server exports in either jpg or png format
              mosaicRule: mosaicRule
          });

          const highest_prob_fast_loss = new ImageryLayer({
              url: "https://apps.fs.usda.gov/fsgisx01/rest/services/RDW_LandscapeAndWildlife/LCMS_Southeast_Alaska_Year_Of_Highest_Prob_Fast_Loss/ImageServer",
              format: "jpgpng", // server exports in either jpg or png format
              mosaicRule: mosaicRule
          });

          const highest_prob_gain = new ImageryLayer({
              url: "https://apps.fs.usda.gov/fsgisx01/rest/services/RDW_LandscapeAndWildlife/LCMS_Southeast_Alaska_Year_Of_Highest_Prob_Gain/ImageServer",
              format: "jpgpng", // server exports in either jpg or png format
              mosaicRule: mosaicRule
          });

          const highest_prob_slow_loss = new ImageryLayer({
              url: "https://apps.fs.usda.gov/fsgisx01/rest/services/RDW_LandscapeAndWildlife/LCMS_Southeast_Alaska_Year_Of_Highest_Prob_Slow_Loss/ImageServer",
              format: "jpgpng", // server exports in either jpg or png format
              mosaicRule: mosaicRule
          });


          // Create a dictionary of imagery layers
          const img_layer_dict = {
              'nolayer-button-wrapper': null,
              'landcover-button-wrapper': annual_landcover,
              'landuse-button-wrapper': annual_landuse, 
              'fastloss-button-wrapper': most_rec_year_fast_loss,
              'gain-button-wrapper': most_rec_year_gain,
              'slowloss-button-wrapper': most_rec_year_slow_loss,
              'hi-prob-fastloss-button-wrapper': highest_prob_fast_loss,
              'hi-prob-gain-button-wrapper': highest_prob_gain,
              'hi-prob-slowloss-button-wrapper': highest_prob_slow_loss
          };

          return img_layer_dict;

        }, 

        createImgLayerButtons: function() {            
            const button_template = `
            <h1 class=collapsible title="Click to open/close dropdown containing image options to add to map" id="map-img-layer-selection">LCMS Reference Layer Selection</h1>
            <ul id="map-img-layer-selection-items">

              <div align="left" class="radio-button-wrapper" id="nolayer-button-wrapper">
                <input type="radio" title="Remove all raster layers from the view" class="layer-radio-button" id="nolayer-radio-select" name="layer-button" value="nolayer-radio-select" checked>
                <label for="nolayer-radio-select" class="radio-button-label">None</label>
              </div>

              <div align="left" class="radio-button-wrapper" id="landcover-button-wrapper">
                <input type="radio" title="Add Annual Land Cover layer to the map" class="layer-radio-button" id="landcover-radio-select" name="layer-button" value="landcover-radio-select" checked>
                <label for="landcover-radio-select" class="radio-button-label">Annual Land Cover</label>
                <button id=span_popup1 title="Click for more information" class="infobutton">i</button>  
              </div>

              <div align="left" class="radio-button-wrapper" id="landuse-button-wrapper">
                <input type="radio" title="Add Annual Land Use layer to the map" class="layer-radio-button" id="landuse-radio-select" name="layer-button" value="landuse-radio-select">
                <label for="landuse-radio-select" class="radio-button-label">Annual Land Use</label>
                <button id=span_popup2 title="Click for more information" class="infobutton">i</button>  
              </div>

              <div align="left" class="radio-button-wrapper" id="fastloss-button-wrapper">
                <input type="radio" title="Add Most Recent Fast Loss Year layer to the map" class="layer-radio-button" id="fastloss-radio-select" name="layer-button" value="fastloss-radio-select">
                <label for="fastloss-radio-select" class="radio-button-label">Most Recent Fast Loss Year</label>
                <button id=span_popup3 title="Click for more information" class="infobutton">i</button>  
              </div>

              <div align="left" class="radio-button-wrapper" id="gain-button-wrapper">
                <input type="radio" title="Add Most Recent Gain Year layer to the map" class="layer-radio-button" id="gain-radio-select" name="layer-button" value="gain-radio-select">
                <label for="gain-radio-select" class="radio-button-label">Most Recent Gain Year</label>
                <button id=span_popup4 title="Click for more information" class="infobutton">i</button>  
              </div>

              <div align="left" class="radio-button-wrapper" id="slowloss-button-wrapper">
                <input type="radio" title="Add Most Recent Slow Loss Year layer to the map" class="layer-radio-button" id="slowloss-radio-select" name="layer-button" value="slowloss-radio-select">
                <label for="slowloss-radio-select" class="radio-button-label">Most Recent Slow Loss Year</label>
                <button id=span_popup5 title="Click for more information" class="infobutton">i</button>  
              </div>

              <div align="left" class="radio-button-wrapper" id="hi-prob-fastloss-button-wrapper">
                <input type="radio" title="Add Highest Probability Fast Loss Year layer to the map" class="layer-radio-button" id="hi-prob-fastloss-radio-select" name="layer-button" value="hi-prob-fastloss-radio-select">
                <label for="hi-prob-fastloss-radio-select" class="radio-button-label">Highest Prob. Fast Loss Year</label>
                <button id=span_popup6 title="Click for more information" class="infobutton">i
                  </button>               
                </div>

              <div align="left" class="radio-button-wrapper" id="hi-prob-gain-button-wrapper">
                <input type="radio" title="Add Highest Probability Gain Year layer to the map" class="layer-radio-button" title="testing title for button.." id="hi-prob-gain-radio-select" name="layer-button" value="hi-prob-gain-radio-select">
                <label for="hi-prob-gain-radio-select" class="radio-button-label">Highest Prob. Gain Year</label>
                <button id=span_popup7 title="Click for more information" class="infobutton">i</button>                  

              </div>

              <div align="left" class="radio-button-wrapper" id="hi-prob-slowloss-button-wrapper">              
                <input type="radio" title="Add Highest Probability Slow Loss Year layer to the map" class="layer-radio-button" id="hi-prob-slowloss-radio-select" name="layer-button" value="hi-prob-slowloss-radio-select">
                <label for="hi-prob-slowloss-radio-select" class="radio-button-label">Highest Prob. Slow Loss Year</label>
                <button id=span_popup8 title="Click for more information" class="infobutton">i</button>               
                </div>  
              

            </ul>`

            // Set style for button list and button header
            

            $('#multilevel-accordion-menu-elems').append(button_template);

            // Align new list element
            $('#map-img-layer-selection').css("text-align", "left");
            $('#map-img-layer-selection').css("cursor", "pointer");

            // Make sure layers list is hidden
            $("#map-img-layer-selection-items").css("display", "none");

            // Make layer selection toggleble
            ts = ToggleSidebar({});
            ts.hamburgerToggle("map-img-layer-selection", "map-img-layer-selection-items");

        }

    })
});

