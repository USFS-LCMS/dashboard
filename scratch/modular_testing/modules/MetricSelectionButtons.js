define([
    "dojo/_base/declare",
    "modules/ToggleSidebar",
    "modules/MetricToggleDict"
], function(
    declare,
    ToggleSidebar,
    MetricToggleDict
    ){
 
    return declare(null,{

        constructor: function(){


        },
        
        createMetricButtons: function(html_hook = "#multilevel-accordion-menu-elems", h1_id = "lcms-metric-selection", title = "LCMS Metric Selection") {

            mtd = MetricToggleDict({});

            ts = ToggleSidebar({});


            // create html block for header 
            const html_wrapper = `
            <h1 class=collapsible id="${h1_id}">${title}</h1>
            <ul id="${h1_id}-items"></ul>
            `

            // Write this to the document
            $(html_hook).append(html_wrapper);
            
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
                            console.log("id for butn is:"+ `span_popup_change${idx}`);
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