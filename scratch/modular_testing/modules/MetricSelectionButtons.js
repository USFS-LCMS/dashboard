define([
    "dojo/_base/declare",
    "modules/ToggleSidebar"
], function(
    declare,
    ToggleSidebar
    ){
 
    return declare(null,{

        constructor: function(options){
            
        },
           
        createMetricButtons: function(html_hook = "#multilevel-accordion-menu-elems", h1_id = "lcms-metric-selection", title = "LCMS Metric Selection") {

            ts = ToggleSidebar({});


            // create html block for header 
            const html_wrapper = `
            <h1 id="${h1_id}">${title}</h1>
            <ul id="${h1_id}-items"></ul>
            `

            // // Write this to the document
            $(html_hook).append(html_wrapper);
            
            // Get a list of names of things
            const names = {'Change':["Slow Loss","Fast Loss","Gain","Non-Processing Area Mask"],
                        'Land_Cover':["Trees",
            "Tall Shrubs & Trees Mix","Shrubs & Trees Mix","Grass/Forb/Herb & Trees Mix","Barren & Trees Mix","Tall Shrubs","Shrubs","Grass/Forb/Herb & Shrubs Mix","Barren & Shrubs Mix","Grass/Forb/Herb", "Barren & Grass/Forb/Herb Mix","Barren or Impervious","Snow or Ice","Water","Non-Processing Area Mask"],
                        'Land_Use':["Agriculture","Developed","Forest","Non-Forest Wetland","Other","Rangeland or Pasture","Non-Processing Area Mask"]
            }

            // *** BUTTON CREATION AND DICTIONARY BUILDING *** //

            // Loop over keys to make them display one by one as buttons
            Object.keys(names).forEach((n) => {

                // Create a subtitle and sublist for each lcms metric type
                const metric_type_html = `
                <h2 id="${n}-${h1_id}">${n}</h2>
                <ul id="${n}-${h1_id}-items"></ul>
                `

                // Append this new sub-list into the outside 'wrapper' list
                $(`#${h1_id}-items`).append(metric_type_html);

                names[n].forEach((t) => {


                    const t_nospace = t.replace(/[^A-Z0-9]+/ig, "_");

                    // Create a radio button for each metric subtype
                    const metric_subtype_html = `
                    <div align="left" class="checkbox-wrapper" id="${t_nospace}-checkbox-wrapper">
                        <input type="checkbox" class="layer-checkbox" id="${t_nospace}-checkbox-select" name="layer-checkbox" value="${t_nospace}-checkbox-select">
                        <label for="${t_nospace}-checkbox-select" class="checkbox-label">${t}</label>
                    </div>  
                    `

                    // Append radio button to class wrapper list
                    $(`#${n}-${h1_id}-items`).append(metric_subtype_html);

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

        },

        toggleMetrics: function() {
            
        }

    })
});