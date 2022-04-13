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

            function downloadMethods(version){
                var link = document.createElement("a");
                var methods_name ='LCMS_'+version+'_Methods.pdf';
                link.href = './tutorials/'+methods_name;
                // link.href = 'https://data.fs.usda.gov/geodata/rastergateway/LCMS/'+methods_name;
                  link.target = '_blank';
                link.click();
                ga('send', 'event',mode+'-download', 'methods-download', methods_name);
                // link.setAttribute("download", filename);
              };


            const html_wrapper = `
            <h1 class=collapsible id="${h1_id}">${title}</h1>
            <ul id="${h1_id}-items">
            <section align="left" class="info-panel" id="infoPanel1">
                <a href="https://apps.fs.usda.gov/lcms-viewer/">View the Full LCMS Data Explorer</a>
            </section>
            <p></p>

            <section align="left" class="info-panel" id="infoPanel2">
                <a href="https://data.fs.usda.gov/geodata/LCMS/LCMS_R4_v2019-04_Descriptions.html">Description of LCMS Products</a>
            </section>
            <p></p>

            <section align="left" class="info-panel" id="infoPanel3">
                <a href="https://usfs-lcms.github.io/lcms-viewer/tutorials/LCMS_v2021-7_Methods.pdf">LCMS Methods Document</a>
            </section>
            <p></p>
            
            <section align="left" class="info-panel" id="infoPanel4">
            <address>
                <a href="mailto:sm.fs.lcms@usda.gov">Contact LCMS Support: sm.fs.lcms@usda.gov</a>
            </address>                
            </section>
            
            </ul>
            `


            // Write this to the document
            $(html_hook).append(html_wrapper);            

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