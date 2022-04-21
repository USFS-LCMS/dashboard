define([
    "dojo/_base/declare"
], function(
    declare,
    ToggleSidebar
    ){
 
    return declare(null,{

        constructor: function(options){
            
        },
           
        testMessage: function() {

            const divIds = $.map($('#map-layer-selection-items > div'), div => div.id);

            console.log(divIds);

            $.map($('#map-layer-selection-items > div'), div => {

                let dividname = div.id
                dividname = dividname.replace('-wrapper', '-spinner');

                $(`#${div.id}`).append(`<div class="loader" id="${dividname}"><div>`);


            })

        }
    })
});