define([
    "dojo/_base/declare"
], function(declare, Chart){

    return declare(null,{

        output_features: null,

        constructor: function(options){

        },

        // Create a listener for the on-off dictionary to update charts on click.
        updateChartOnMetricSelection: function(on_off_dict) {
            console.log("onoff: ")
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


            // Proxy must be updated on user click - simpler solution now?

            // $(`#${n}---${t_nospace}-checkbox-wrapper`).on('click', () => {
            //     // console.log("somethin")
            //     tfarray.push($(`#${n}-${t_nospace}-checkbox-select:checked`).attr("id")===undefined);
            //     console.log(tfarray[0]);
            //     if (tfarray.length > 1){
            //         // tfarray2.push(tfarray[0])
            //         on_off_dict[n][`${n}---${t}`] = tfarray[0]
            //         // console.log($(`#${n}-${t_nospace}-checkbox-select`).attr("id"))
            //         // console.log(tfarray[0])
            //         // console.log(on_off_dict);

            //         tfarray = [];
            //         console.log(on_off_dict)
            //     } 
            // })

            // Create checked elements updater function
            const checked_elems_update = () => {
                // Create an array filled with the checked elements of the metric list
                const checked_elements = $( ".layer-checkbox:checked" )
                .map(function() {    
                    // console.log(this.name+"is name");                                                                                                                                               
                    return this.name;
                }).get()


                
                // Write values to the dictionary for each type
                Object.keys(targetProxy).forEach((in_type) => { 
                    var selectAll=false;
                    // iterate through 3 chart types (change, land cover, land use)
                    if (checked_elements.indexOf(`${in_type}---Select All`) != -1){                       
                        selectAll=true;
                        
                    }
                    $.map($(`#${in_type}-lcms-metric-selection-items > div`), div => {
                        // iterate through different metrics

                        // Get the subclass name 
                        const subtype_name = div.getAttribute('name');
                        // Assign subtype name to checked elements. 
                        if ( checked_elements.indexOf(subtype_name) === -1 && selectAll===false) {
                            targetProxy[in_type][div.getAttribute('name')] = false
                        }
                        else {
                            //replace spaces in 
                            var t_nospace = subtype_name.replace(/[^A-Z0-9]+/ig, "_").replace("Change_","").replace("Land_Cover_","").replace("Land_Use_","");
                            document.getElementById(`${in_type}-${t_nospace}-checkbox-select`).checked=true;
                            targetProxy[in_type][div.getAttribute('name')] = true
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
                
                console.log(on_off_dict);
            }));


        }
    })
});