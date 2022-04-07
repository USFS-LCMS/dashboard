define([
    "dojo/_base/declare"
], function(declare, Chart){

    return declare(null,{

        output_features: null,

        constructor: function(options){

        },

        // Create a listener for the on-off dictionary to update charts on click.
        updateChartOnMetricSelection: function(on_off_dict) {
            // Create a proxy object and listen for any change
            var targetProxy = new Proxy(on_off_dict, {
                set: function (target, key, value) {
                    console.log(`${key} set to ${value}`);
                    target[key] = value;
                    console.log(on_off_dict);
                    return true;
                }
            });

            // Proxy must be updated on user click

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
                return this.name;
                }).get()



                // Write values to the dictionary for each type
                Object.keys(targetProxy).forEach((in_type) => { 
                    $.map($(`#${in_type}-lcms-metric-selection-items > div`), div => {

                        // Get the subclass name 
                        const subtype_name = div.getAttribute('name');

                        // Assign subtype name to checked elements. 
                        if ( checked_elements.indexOf(subtype_name) === -1 ) {
                            targetProxy[in_type][div.getAttribute('name')] = false
                        }
                        else {
                            targetProxy[in_type][div.getAttribute('name')] = true
                        }
                    })
                });
            }

            checked_elems_update();

            // Make sure chart is updated when click event happens
            $('.checkbox-wrapper').on('click', (()=>{checked_elems_update()}));


        }
    })
});