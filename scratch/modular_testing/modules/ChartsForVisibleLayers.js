/*
Module purpose: the module has multiple purposes, but the big one is to deal with multiple outputs from a spatial query and convert those to charts.
1. keep track of button states for layer dropdown
2. keep track of all layer results in a dictionary or array
3. create chart objects for each layer result
*/

define([
    "dojo/_base/declare",
    "esri/rest/support/Query",
    "modules/CreateChart"
], function(declare, Query, CreateChart){

    return declare(null,{

        output_features: null,

        constructor: function(options){

        },

        // Create a listener for the on-off dictionary to update charts on click.
        toggleVisibleLayersDict: function(checkbox_class, layers_dict) {
            

            // Create function to update visible layers states dictionary
            const update_visible_layers_dict = (layers_dict, checkbox_class) =>{

                // Create a target object to watch changes.
                const targetProxy = new Proxy(layers_dict, {
                    set: function (target, key, value) {
                        target[key] = value;
                        return true;
                    }
                });

                // Create checked elements updater function
                const checked_elems_update = () => {
                    // Create an array filled with the checked elements of the metric list
                    const checked_elements = $( `.${checkbox_class}:checked` )
                    .map(function() {

                        return this.name;

                    }).get()


                    // Write values to the dictionary for each type

                    $.map($(`#map-layer-selection-items > div`), div => {

                        // Get the id of the outer div. 
                        const outer_div_id = div.closest('div').id;

                        // Get the subclass name 
                        const subtype_name = div.getAttribute('name');

                        // Assign subtype name to checked elements. 
                        if ( checked_elements.indexOf(subtype_name) === -1 ) {
                            targetProxy[outer_div_id]['is_visible'] = false
                        }
                        else {
                            targetProxy[outer_div_id]['is_visible'] = true
                        }
                    })
                }

                // Make sure that the "checked elements" dictionary is updated as soon as the outer function is called - or as soon as the user opens the web map.
                checked_elems_update();

            }

            update_visible_layers_dict(layers_dict, checkbox_class);


            // Create function that will create queries for each visible layer
            const list_visible_layers = (layers_dict) => {

                // Filter dictionary to visible layers
                const visible_layers_dict = Object.fromEntries(Object.entries(layers_dict).filter(([k, v]) => v['is_visible'] === true ));
                
                // Get a list of visible layers
                const visible_layers_arr = [];
                Object.keys(visible_layers_dict).forEach((k) => {
                    // Get the layer variable, and add it to the list
                    const visible_layer = visible_layers_dict[k]['layer_var']; // get
                    visible_layers_arr.push(visible_layer); // add
                });
                
                return visible_layers_arr;

            }

            // Make sure chart is updated when click event happens
            $(`.${checkbox_class}`).on('click', (()=>{

                update_visible_layers_dict(layers_dict, checkbox_class);
                 
                // Create array of visible layers
                visible_layers_arr = list_visible_layers(layers_dict);

            }));

        },

        // Create a way to take the dictionary and iterate over, making divs and charts
        makeVisibleLayerCharts: function(layers_dict, geometry, outer_chart_div_id, toggled_elems) {
            /*
            This function makes charts for each visible layer. 
            */

            // add these 
            delete toggled_elems["Change"]["Change---Select All"]
            delete toggled_elems["Land_Cover"]["Land_Cover---Select All"]
            delete toggled_elems["Land_Use"]["Land_Use---Select All"];

            function removeAllChildNodes(parent) {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
            }

            const chart_one_metric = (which_one, in_layer, fieldNames, layers_dict, outer_chart_div_id) => {
                /*
                This function takes three inputs: 
                - which_one -> which metric class we're charting: Change, Land_Cover, Land_Use
                - in_layer -> one of our visible layers
                - fieldNames -> A list of field names in the format ["Change---Fast Loss", "Land_Cover---Trees", "Land_Use---Agriculture", ... , etc]
                The function will create a new chart div, containing three charts, for each  layer visible (assuming that metrics are selected for each chart's metric class).
                */

                if (layers_dict[in_layer]['is_visible'] === false) {
                    return;
                }
                ///////////////////////////////////////////////////////////////////////////////

                    var colors = {'Change':["f39268","d54309","00a398","1B1716"].map(c =>'#'+c),
                    'Land_Cover':["005e00","008000","00cc00","b3ff1a","99ff99","b30088","e68a00","ffad33","ffe0b3","ffff00","AA7700","d3bf9b","808080","4780f3","1B1716"].map(c =>'#'+c),
                    'Land_Use': ["efff6b","ff2ff8","1b9d0c","97ffff","a1a1a1","c2b34a","1B1716"].map(c =>'#'+c)};

                    const class_fieldNames = [];
                    fieldNames.forEach((in_field) => {
                         const metric_type = in_field.split('---')[0]
                         if ( which_one === metric_type ) {
                             class_fieldNames.push(in_field);
                         } 
                    }); 

                    let colorsI = 0;
                    // const which_one = 'Change';
                    
                    const stacked = false;
                    const chartID = 'chart-canvas-'+which_one;
                    const total_area_fieldname = 'total_area';


                    // create chart wrapper - probably #1 thing to look at for pdf generation
                    let chart_div_html = `
                    <div id=${in_layer}-chart-div>
                        <h2>${layers_dict[in_layer]['display_name']}</h2>
                    </div>`


                    // put chart wrapper in outer wrapper 
                    $(`#${outer_chart_div_id}`).append(chart_div_html);

                    // create query for layer 
                    curr_layer = layers_dict[in_layer]['layer_var'];

                    // load layer and query. 
                    curr_layer.when((cl) => {
                        cl.queryFeatures({
                            geometry: geometry,
                            returnGeometry: true
                        }).then ( (results) => {
                            if(results.features.length > 0) {


                                // // append a chart - attempt new chart here.
                                $(`#${in_layer}-chart-div`).append(`<canvas class="chart" id="${chartID}-${in_layer}"></canvas>`); // add a new id element here. 
                                

                                //Iterate across each field name and add up totals 
                                //First get 2-d array of all areas for each then sum the columns and divide by total area
                                var startYear = 2005;
                                var endYear = 2015;

                                
                                var t = class_fieldNames.map(function(k){
                                    var total_area = 0;
                                    var total = [];
                                    results.features.map(function(f){
                                        years = f.attributes.years.split(',');
                                        var startI = years.indexOf(startYear.toString());
                                        var endI = years.indexOf((endYear+1).toString());
                                        years = years.slice(startI,endI);
                                        try{
                                            total.push(f.attributes[k].split(',').slice(startI,endI).map(n => parseFloat(n)));
                                            var total_areaF = parseFloat(f.attributes[total_area_fieldname]);
                                            total_area = total_area + total_areaF;
                                        }catch(err){
                                            console.log('No LCMS summary for: '+f.attributes['outID']);
                                        }
                                    });
                                    
                                    var colSums = [];
                                    for(var col = 0;col < total[0].length; col++){
                                        var colSum = 0;
                                        for(var row = 0;row < total.length; row++){
                                            colSum = colSum + total[row][col];
                                        }
                                        colSums.push(colSum);
                                    };
                                    //Convert back to pct
                                    colSums = colSums.map((n)=>n/total_area*100)
                                    ///////////////////////////////////////////////////////////////////////
                                    //Set up chart object
                                    var out = {
                                        'borderColor':colors[which_one][colorsI],
                                        'fill':false,
                                        'data':colSums,
                                        'label':k.split('---')[1],
                                        pointStyle: 'line',
                                        pointRadius:1,
                                        'lineTension':0,
                                        'borderWidth':2,
                                        'steppedLine':false,
                                        'showLine':true,
                                        'spanGaps':true,
                                        'fill' : stacked,
                                        'backgroundColor':colors[which_one][colorsI]
                                    }
                                    colorsI ++;
                                    return out;
                                });



                                var chartJSChart = new Chart($(`#${chartID}-${in_layer}`),{
                                type: 'line',
                                data: {"labels": years,
                                "datasets":t},
                                options:{
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    aspectRatio: 1/0.6,
                                    devicePixelRatio:2,
                                    title: {
                                        display: true,
                                        position:'top',
                                        // text: name,
                                        fontSize: 16
                                    },
                                    legend:{
                                        display:true,
                                        position:'bottom',
                                        fontSize:6,
                                        labels : {
                                        boxWidth:5,
                                        usePointStyle: true
                                        }
                                    },
                                    chartArea: {
                                        backgroundColor: '#D6D1CA'
                                    },
                                    scales: {
                                        yAxes: [{ stacked: stacked ,scaleLabel:{display:true,labelString:'% Area'}}],
                                        xAxes: [{ stacked: stacked ,scaleLabel:{display:true,labelString:'Year'},maxBarThickness: 100}]
                                    }
                                    }
                                });

                            }
                        });
                    });
                    
                ///////////////////////////////////////////////////////////////////////////////
            }


            const container = document.querySelector(`#${outer_chart_div_id}`);
            removeAllChildNodes(container);

            const fieldNames = [];
            // Get field names from toggled elems dict
            Object.keys(toggled_elems).forEach( (label_i) => { 
                
                // Get the dictionary for each class umbrella name
                const class_dict = toggled_elems[label_i]; 
                
                // Get keys for this class umbrella sub dictionary
                Object.keys(class_dict).forEach( (in_class) => { 
                    if (class_dict[in_class] === true) {
                        fieldNames.push(in_class);
                    }
                }); 
            });

            console.log(layers_dict);
            // Iterate over visible layers and make charts in the side div
            if ( Object.keys(layers_dict).length > 0 ) {

                // This is where we go through each visible layer.
                Object.keys(layers_dict).forEach((l) => {

                    ['Change', 'Land_Cover', 'Land_Use'].map((w) => {
                        chart_one_metric(w, l, fieldNames, layers_dict, outer_chart_div_id);
                    });

                });
            }

            // Should just be able to add onclick functionality and be done with it.
            // $('.layer-check-button').on('click', () => {
            //     ['Change', 'Land_Cover', 'Land_Use'].map((w) => {
            //         chart_one_metric(w, l, fieldNames, layers_dict, outer_chart_div_id);
            //     }); 
            // })


        },


        // Create a function that listens to user clicks on 
    ////
    })
});