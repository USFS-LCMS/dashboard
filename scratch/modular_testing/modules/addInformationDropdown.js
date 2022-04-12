define([
    "dojo/_base/declare",
    "modules/ToggleSidebar"
], function(
    declare,
    ToggleSidebar
    ){
 
    return declare(null,{

        constructor: function(){


        },
        
        addInfo: function(html_hook = "#multilevel-accordion-menu-elems", h1_id = "more-info-dropdown", title = "More Information"){
            ts = ToggleSidebar({});


            const html_wrapper = `
            <h1 class=collapsible id="${h1_id}">${title}</h1>
            <ul id="${h1_id}-items">
            <div align="left" class="info-panel" id="infoPanel1">
                <a href="https://apps.fs.usda.gov/lcms-viewer/">Click to view the full LCMS Data Explorer</a>
            </div>
            <p></p>
            <div align="left" class="info-panel" id="infoPanel2">
                <a href="https://data.fs.usda.gov/geodata/LCMS/LCMS_R4_v2019-04_Descriptions.html">Click for a full description of LCMS Products</a>
            </div>
            <p></p>

            <div align="left" class="info-panel" id="infoPanel3">
            <address>
                <a href="mailto:robert.vaughan@usda.gov">Contact: Robert.Vaughan@usda.gov</a>
            </address>                
            </div>
            
            </ul>
            `

            // Write this to the document
            $(html_hook).append(html_wrapper);

            // add info in dropdown
            const info_panel_html1 = `
                <div align="left" class="info-panel" id="infoPanel1">
                <h3>Click to view the full LCMS Viewer</h3>
            </div>`
            // Append check button to class wrapper list
            //$(`${h1_id}-items`).append(info_panel_html1);


            // Text align the top header
            $(`#${h1_id}`).css("text-align", "left");
            $(`#${h1_id}`).css("cursor", "pointer");            

            // Hide sublist
            $(`#${h1_id}-items`).css("display", "none");

            // Toggle categories
            ts.hamburgerToggle(`${h1_id}`, `${h1_id}-items`);
        }
    });
})