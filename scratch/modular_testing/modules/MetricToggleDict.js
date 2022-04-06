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
           
        toggleMetrics: function() {

            const names = {'Change':["Slow Loss","Fast Loss","Gain","Non-Processing Area Mask"],
                'Land_Cover':["Trees","Tall Shrubs & Trees Mix","Shrubs & Trees Mix",
                "Grass/Forb/Herb & Trees Mix","Barren & Trees Mix","Tall Shrubs","Shrubs",
                "Grass/Forb/Herb & Shrubs Mix","Barren & Shrubs Mix","Grass/Forb/Herb", 
                "Barren & Grass/Forb/Herb Mix","Barren or Impervious","Snow or Ice","Water","Non-Processing Area Mask"],
                'Land_Use':["Agriculture","Developed","Forest","Non-Forest Wetland",
                "Other","Rangeland or Pasture","Non-Processing Area Mask"]
            }

            // // Get list of metrics from html hook
            // const checkboxes = document.querySelectorAll('.layer-checkbox');

            // // Create a dictionary of toggle on/off
            // const on_off_dict = {}

            // checkboxes.forEach((checkbox) => {
            //     // Is it checked?
            //     on_off_dict[checkbox.id] = checkbox.ariaChecked
                
            // })

            $(".layer-checkbox:checked").val().forEach((i) => {
                console.log(i)
            })


            // console.log(on_off_dict);

        }
    })
});