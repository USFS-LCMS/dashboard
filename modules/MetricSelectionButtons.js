define([
    "dojo/_base/declare",
    "modules/ToggleSidebar",
    "modules/MetricToggleDict",
    "modules/ChartsForVisibleLayers"
], function(
    declare,
    ToggleSidebar,
    MetricToggleDict,
    ChartsForVisibleLayers
    ){
 
    return declare(null,{

        constructor: function(){


        },
        
        createMetricButtons: function(html_hook = "#multilevel-accordion-menu-elems", h1_id = "lcms-metric-selection", title = "LCMS Metric Selection") {

            mtd = MetricToggleDict({});

            ts = ToggleSidebar({});

            charts_for_visible_layers = ChartsForVisibleLayers({});


            // create html block for header 
            const html_wrapper = `
            <h1 class=collapsible id="${h1_id}">${title}</h1>
            <ul id="${h1_id}-items"></ul>
                     
            `

            // Write this to the document
            $(html_hook).append(html_wrapper);

            //////////// add radio buttons to toggle area //////////////////////////

            var graph_area_wrapper=` 
                <h2  title="Click to open/close dropdown to select area metric for graphs" class=collapsible id="graph-y-axis">Area Metric (Graph Y-Axis)</h2>
                <ul id="graph-y-axis-items"></ul>                 
                `
            $(`#${h1_id}-items`).append(graph_area_wrapper);

            var graph_area_options=` 
            <div align="left" class="radio-button-wrapper" id="acres_wrapper">
                <input type="radio" title="Set y-axis on graph to acres" class="layer-radio-button" id="acres-radio-select" name="area-button" value="acres-radio-select" checked>
                <label for="acres-radio-select" class="radio-button-label">Acres</label>
            </div>

            <div align="left" class="radio-button-wrapper" id="pct_area_wrapper">
                <input type="radio" title="Set y-axis on graph to % area" class="layer-radio-button" id="pct-area-radio-select" name="area-button" value="pct-area-radio-select">
                <label for="pct-area-radio-select" class="radio-button-label">Percent Area</label>
            </div>      
            
            <div align="left" class="radio-button-wrapper" id="hectares_wrapper">
                <input type="radio" title="Set y-axis on graph to hectares" class="layer-radio-button" id="hectares-radio-select" name="area-button" value="hectares-radio-select">
               <label for="hectares-radio-select" class="radio-button-label">Hectares</label>
            </div>
            `


            



            $("#graph-y-axis-items").append(graph_area_options);
            

            // // Text align sub headings
            $("#graph-y-axis").css("text-align", "left");
            $("#graph-y-axis").css("cursor", "pointer");
            
            
            // Hide sub-type names and options buttons.
            $("#graph-y-axis-items").css("display", "none");
            // Create event listener to toggle sub-menu visibility.
            ts.hamburgerToggle("graph-y-axis", "graph-y-axis-items");

            //////////////////////////////////////////////////////////////////////////////
            //time slide
            ///////////////////////////////////////////////////////////////////////////////
            var year_slider_wrapper=` 
                <h2 title="Click to open/close dropdown to select Years of Analysis for graphs"class=collapsible id="year-slider">Years of Analysis (Graph X-Axis)</h2>
                <ul id="year-slider-items"></ul>                 
                `
            $(`#${h1_id}-items`).append(year_slider_wrapper);

            //this is the actual slider html code: NEED TO EDIT/THIS CHUNK FAILS
            // var year_slider = `
            // <div id="analysis-year-slider-container" class="dual-range-slider-container px-1" title="Years of LCMS data to include for land cover, land use, loss, and gain">
            //     <div class="dual-range-slider-name pt-2 pb-3">Choose analysis year range:</div>
            //     <div id="analysis-year-slider" class="dual-range-slider-slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" href="#">
            //         <div class="ui-slider-range ui-widget-header ui-corner-all" style="left: 0%; width: 100%;"></div>
            //         <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 0%;"></span>
            //         <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 100%;"></span>
            //     </div>
            //     <div id="analysis-year-slider-update" class="dual-range-slider-value p-2">1985 - 2020</div>
            // </div>     
            // `
            // $(`#year-slider-items`).append(year_slider);


            // 2nd try at slider code
            // let jquery_testing_slider = `
            // <form>
            //     <div data-role="rangeslider" id="year-range-slider"></div>
            // </form>
            // `

            // $(`#year-slider-items`).append(jquery_testing_slider);


            // Create event listener to toggle sub-menu visibility.
            ts.hamburgerToggle("year-slider", "year-slider-items");
                                                
                // #analysis-year-slider-container
            /////////////////////////////////////////////////////////////////// end of slider code /////////////
            
            // Get a list of names of things
            const names = {'Change':["Select All","Slow Loss","Fast Loss","Gain","Non-Processing Area Mask"],
                        'Land_Cover':["Select All","Trees",
            "Tall Shrubs & Trees Mix","Shrubs & Trees Mix","Grass/Forb/Herb & Trees Mix","Barren & Trees Mix","Tall Shrubs","Shrubs","Grass/Forb/Herb & Shrubs Mix","Barren & Shrubs Mix","Grass/Forb/Herb", "Barren & Grass/Forb/Herb Mix","Barren or Impervious","Snow or Ice","Water","Non-Processing Area Mask"],
                        'Land_Use':["Select All","Agriculture","Developed","Forest","Non-Forest Wetland","Other","Rangeland or Pasture","Non-Processing Area Mask"]
            }

            // *** BUTTON CREATION AND DICTIONARY BUILDING *** //

            // Loop over keys to make them display one by one as buttons
            Object.keys(names).forEach((n) => {

                // Create a subtitle and sublist for each lcms metric type
                const metric_type_html = `
                <h2 class=collapsible id="${n}-${h1_id}">${n}</h2>
                <ul id="${n}-${h1_id}-items"></ul>
                `

                // Append this new sub-list into the outside 'wrapper' list
                $(`#${h1_id}-items`).append(metric_type_html);

               // track ids
               idxDict = {'Slow Loss':'1', 'Fast Loss':'2','Gain':'3',"Non-Processing Area Mask":'4'};

                names[n].forEach((t) => {

                    const t_nospace = t.replace(/[^A-Z0-9]+/ig, "_");

                    // Create a radio button for each metric subtype

                    // Checked layers to put up immediately.
                    const checked_layers = [
                        "Change---Fast Loss", "Change---Slow Loss", "Change---Gain",
                        "Land_Cover---Trees", "Land_Cover---Grass/Forb/Herb & Shrubs Mix", "Land_Cover---Snow or Ice",
                        "Land_Use---Forest", "Land_Use---Forest", "Land_Use---Developed"
                     ];

                    if (n ==="Change" && t!= "Select All"){ //add this in to add info button modal for the products under "Change" (no description needed for land cover and use)
                        if (checked_layers.indexOf(`${n}---${t}`) != -1) {
                            var idx=idxDict[t];
                            const metric_subtype_html = `
                            <div align="left" class="checkbox-wrapper" id="${n}---${t_nospace}-checkbox-wrapper" name="${n}---${t}">
                                <input type="checkbox" class="layer-checkbox" id="${n}-${t_nospace}-checkbox-select" name="${n}---${t}" value="${n}-${t_nospace}-checkbox-select" checked>
                                <label for="${n}-${t_nospace}-checkbox-select" class="checkbox-label">${t}</label>
                                <button id="span_popup_change${idx}" title="Click for more information" class="infobutton">i</button>
                            </div>  
                            `
                            // Append check button to class wrapper list
                            $(`#${n}-${h1_id}-items`).append(metric_subtype_html);
                            // console.log("id for butn is:"+ `span_popup_change${idx}`);
                        }
                        else {
                            var idx=idxDict[t];
                            const metric_subtype_html = `
                            <div align="left" class="checkbox-wrapper" id="${n}---${t_nospace}-checkbox-wrapper" name="${n}---${t}">
                                <input type="checkbox" class="layer-checkbox" id="${n}-${t_nospace}-checkbox-select" name="${n}---${t}" value="${n}-${t_nospace}-checkbox-select">
                                <label for="${n}-${t_nospace}-checkbox-select" class="checkbox-label">${t}</label>
                                <button id="span_popup_change${idx}" title="Click for more information" class="infobutton">i</button>
                            </div>  
                            `
    
                            $(`#${n}-${h1_id}-items`).append(metric_subtype_html);
                        }

                         
                    }else{

                        if (checked_layers.indexOf(`${n}---${t}`) != -1) {
                            const metric_subtype_html = `
                            <div align="left" class="checkbox-wrapper" id="${n}---${t_nospace}-checkbox-wrapper" name="${n}---${t}">
                                <input type="checkbox" class="layer-checkbox" id="${n}-${t_nospace}-checkbox-select" name="${n}---${t}" value="${n}-${t_nospace}-checkbox-select" checked>
                                <label for="${n}-${t_nospace}-checkbox-select" class="checkbox-label">${t}</label>
                            </div>  
                            `
                            // Append check button to class wrapper list
                            $(`#${n}-${h1_id}-items`).append(metric_subtype_html);
                        }
                        else {
                            const metric_subtype_html = `
                            <div align="left" class="checkbox-wrapper" id="${n}---${t_nospace}-checkbox-wrapper" name="${n}---${t}">
                                <input type="checkbox" class="layer-checkbox" id="${n}-${t_nospace}-checkbox-select" name="${n}---${t}" value="${n}-${t_nospace}-checkbox-select">
                                <label for="${n}-${t_nospace}-checkbox-select" class="checkbox-label">${t}</label>
                            </div>  
                            `

                            $(`#${n}-${h1_id}-items`).append(metric_subtype_html);
                        }
                    }

                    // Make a list to check which is really true??
                    let tfarray = [];


                });

                // Text align sub headings
                $(`#${n}-${h1_id}`).css("text-align", "left");
                $(`#${n}-${h1_id}`).css("cursor", "pointer");
                
                
                // Hide sub-type names and options buttons.
                // $(`#${n}-${h1_id}`).css("display", "none");
                $(`#${n}-${h1_id}-items`).css("display", "none");

                // Create event listener to toggle sub-menu visibility.
                ts.hamburgerToggle(`${n}-${h1_id}`, `${n}-${h1_id}-items`);


            });

            // *** BUTTON CREATION AND DICTIONARY BUILDING *** //

            // *** FORMATTING *** //

            // Text align the top header
            $(`#${h1_id}`).css("text-align", "left");
            $(`#${h1_id}`).css("cursor", "pointer");

            // Hide sublist
            $(`#${h1_id}-items`).css("display", "none");

            // Toggle categories
            ts.hamburgerToggle(`${h1_id}`, `${h1_id}-items`);
            

        }
    })
});