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
           
        createMetricButtons: function(on_off_dict, html_hook = "#multilevel-accordion-menu-elems", h1_id = "lcms-metric-selection", title = "LCMS Metric Selection") {

            mtd = MetricToggleDict({});

            ts = ToggleSidebar({});


            // create html block for header 
            const html_wrapper = `
            <h1 id="${h1_id}">${title}</h1>
            <ul id="${h1_id}-items"></ul>
            `

            // Write this to the document
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
                    <div align="left" class="checkbox-wrapper" id="${n}---${t_nospace}-checkbox-wrapper" name="${n}---${t}">
                        <input type="checkbox" class="layer-checkbox" id="${n}-${t_nospace}-checkbox-select" name="layer-checkbox" value="${n}-${t_nospace}-checkbox-select">
                        <label for="${n}-${t_nospace}-checkbox-select" class="checkbox-label">${t}</label>
                    </div>  
                    `

                    // Append radio button to class wrapper list
                    $(`#${n}-${h1_id}-items`).append(metric_subtype_html);


                    // Make a list to check which is really true??
                    let tfarray = [];

                    // const tfarray2 = [];

                    $(`#${n}---${t_nospace}-checkbox-wrapper`).on('click', () => {
                        // console.log("somethin")
                        tfarray.push($(`#${n}-${t_nospace}-checkbox-select:checked`).attr("id")===undefined);
                        console.log(tfarray[0]);
                        if (tfarray.length > 1){
                            // tfarray2.push(tfarray[0])
                            on_off_dict[n][`${n}---${t}`] = tfarray[0]
                            // console.log($(`#${n}-${t_nospace}-checkbox-select`).attr("id"))
                            // console.log(tfarray[0])
                            // console.log(on_off_dict);

                            tfarray = [];
                            console.log(on_off_dict)
                        } 
                    })
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

            // Write false values to the dictionary for each type
            Object.keys(on_off_dict).forEach((in_type) => { 
                $.map($(`#${in_type}-lcms-metric-selection-items > div`), div => {
                    on_off_dict[in_type][div.getAttribute('name')] = false
                })
            });

            // console.log(on_off_dict)

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