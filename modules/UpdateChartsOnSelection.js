define([
    "dojo/_base/declare"
], function(declare, Chart){

    return declare(null,{

        output_features: null,

        constructor: function(options){

        },

        // Create a listener for the on-off dictionary to update charts on click.
        updateChartOnMetricSelection: function(on_off_dict) {
            console.log("oN-OFF DICT: ")
            console.log(on_off_dict);
            // Create a proxy object and listen for any change
            const targetProxy = new Proxy(on_off_dict, {
                set: function (target, key, value) {
                    console.log(`${key} set to ${value}`);
                    target[key] = value;
                    
                    return true;
                }
            });
            console.log("target proxy");
            console.log(targetProxy);
            

            // Create checked elements updater function
            const checked_elems_update = () => {
                // Create an array filled with the checked elements of the metric list
                const checked_elements = $( ".layer-checkbox:checked" ).map(function() {    
                    // console.log(this.name+"is name");                                                                                                                                               
                    return this.name;
                }).get()


                
                // Write values to the dictionary for each type
                Object.keys(targetProxy).forEach((in_type) => { 
                    var selectAll=false;
                    // iterate through 3 chart types (change, land cover, land use)
                    if (checked_elements.indexOf(`${in_type}---Select All`) != -1){  
                        //if selectALl is checked, set it to true so that all other boxes will get checked                     
                        selectAll=true;
                        
                    }
                    
                    
                    $.map($(`#${in_type}-lcms-metric-selection-items > div`), div => {
                        // Get the subclass name 
                        const subtype_name = div.getAttribute('name');
                        if (subtype_name.includes("Select All")){
                            console.log("skip select all")

                        }else{
                            // iterate through different metrics

                            
                            // Assign subtype name to checked elements. 
                            if ( checked_elements.indexOf(subtype_name) === -1) {// && selectAll===false
                                //if the checkbox of iterested (e.g. subtype_name) isn't checked and select all button isnt checked, then the item is false/unchecked
                                targetProxy[in_type][div.getAttribute('name')] = false
                                // console.log("THIS IS WHAT?????????:"+div.getAttribute('name'))
                                
                                // targetProxy[in_type][`${in_type}---Select All`] = false
                                

                            }
                            // else if(checked_elements.indexOf(subtype_name) === -1 && selectAll===true){
                            //     //if checkbox is unchecked and select all is checked=> need to uncheck both boxes
                            //     selectAll=false
                            //     targetProxy[in_type][`${in_type}---Select All`] = false
                            //     targetProxy[in_type][div.getAttribute('name')] = false

                            // }
                            else {
                                //else if the box of interest or select all is checked, then the elem is true
                                //replace spaces in 
                                var t_nospace = subtype_name.replace(/[^A-Z0-9]+/ig, "_").replace("Change_","").replace("Land_Cover_","").replace("Land_Use_","");
                                document.getElementById(`${in_type}-${t_nospace}-checkbox-select`).checked=true;
                                targetProxy[in_type][div.getAttribute('name')] = true
                            }

                        }
                        
                        
                    })
                });
            }

            //id="Change-Select_All-checkbox-select"


            // <div align="left" class="checkbox-wrapper" id="Change---Select_All-checkbox-wrapper" name="Change---Select All">
            //                 <input type="checkbox" class="layer-checkbox" id="Change-Select_All-checkbox-select" name="Change---Select All" value="Change-Select_All-checkbox-select">
            //                 <label for="Change-Select_All-checkbox-select" class="checkbox-label">Select All</label>
            //             </div>

            checked_elems_update();

            // Make sure chart is updated when click event happens
            $('.checkbox-wrapper').on('click', (()=>{
                
                checked_elems_update()
                
                // console.log(on_off_dict);
            }));

            // Object.keys(targetProxy).forEach((in_type) => { 

            // $(`${in_type}---Select All`).on('click', (()=>{
            $(`Change---Select All-checkbox-wrapper`).on('click', (()=>{

            
            // click(function(event) {   
                console.log("select all CLICKED!!!!!!!!!!!")
                if (document.getElementById(`${in_type}---Select_All-checkbox-select`).checked){
                    $.map($(`#${in_type}-lcms-metric-selection-items > div`), div => {
                        document.getElementById(`${in_type}-${t_nospace}-checkbox-select`).checked=true;
                    })
                }else{
                    $.map($(`#${in_type}-lcms-metric-selection-items > div`), div => {
                        document.getElementById(`${in_type}-${t_nospace}-checkbox-select`).checked=false;    
                    })
                        
                }
                
                // if(this.checked) {
                //     // Iterate each checkbox
                //     $(':checkbox').each(function() {
                //         this.checked = true;                        
                //     });
                // } else {
                //     $(':checkbox').each(function() {
                //         this.checked = false;                       
                //     });
                // }
            })); 
        // });


        }
    })
});