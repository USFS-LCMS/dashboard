define([
    "dojo/_base/declare"
], function(
    declare
    ){
 
    return declare(null,{

        constructor: function(options){
            
        },
           
        testMessage: function() {

            $.map($('#map-layer-selection-items > div'), div => {

                let dividname = div.id
                dividname = dividname.replace('-wrapper', '-spinner');

                $(`#${div.id}`).append(`<div class="loader" id="${dividname}"><div>`);


            });

            $.map($('#map-img-layer-selection-items > div'), div => {

                let dividname = div.id
                dividname = dividname.replace('-wrapper', '-spinner');

                $(`#${div.id}`).append(`<div class="loader" id="${dividname}"><div>`);

            });

        },

        showLoader: function(loader_div_id) {
            $(`#${loader_div_id}`).css('display', 'inline');
        },

        hideLoader: function(){
            $(".loader").css('display', 'none');
        }
    })
});