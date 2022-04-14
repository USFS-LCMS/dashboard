define([
    "dojo/_base/declare",
    "esri/layers/GeoJSONLayer"
], function(
    declare,
    GeoJSONLayer
    ){
 
    return declare(null,{

        constructor: function(options){
            
        },
           
        createLayersDict: function() {

            // Dictionary object that is supplied to the layer - visibility parameters.
            const renderer = {
                type: "simple",  
                symbol: {
                type: "simple-fill",  
                color: [ 75, 75, 75, 0.3 ],
                outline: {  
                    width: 1.3,
                    color:'#00897B'
                }
                }
            };

              const bucketName = 'lcms-dashboard'
              // ajax call here 
              $.ajax({
                type: 'GET',
                url: `https://storage.googleapis.com/storage/v1/b/${bucketName}/o`,
            }).done(function(json){

                json = json.items.filter((f)=>f .name.indexOf('Terrestrial')>-1);

                console.log(json);

            })


        }
    })
});