define([
    "dojo/_base/declare",
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js", // import chart js
    "modules/UpdateChartsOnSelection"
], function(declare, Chart, UpdateChartsOnSelection){

    return declare(null,{

        output_features: null,

        constructor: function(options){

        },

        // Create a single chart object based on an input list of features 
        // and field names
        createOutputObj: function(results, which_one, on_off_dict){

          var colors = {'Change':["f39268","d54309","00a398","1B1716"].map(c =>'#'+c),
                        'Land_Cover':["005e00","008000","00cc00","b3ff1a","99ff99","b30088","e68a00","ffad33","ffe0b3","ffff00","AA7700","d3bf9b","808080","4780f3","1B1716"].map(c =>'#'+c),
                        'Land_Use': ["efff6b","ff2ff8","1b9d0c","97ffff","a1a1a1","c2b34a","1B1716"].map(c =>'#'+c)};

          // Print out the members of the dictionary that are true
          const class_dict = on_off_dict[which_one];
          const toggled_elems = Object.keys(class_dict).reduce(function (filtered, key) {
            if (class_dict[key] === true) filtered[key] = class_dict[key];
            return filtered;
          }, {});

          // Create a list of toggled elements and allow that to be what feeds the chart function
          const fieldNames = Object.keys(toggled_elems);

          const stacked = false;
          let colorsI = 0;
          const total_area_fieldname = 'total_area';
          if ( fieldNames.length > 0 ) {
            ///////////////////////////////////////////////////////////////////////
            //Iterate across each field name and add up totals 
            //First get 2-d array of all areas for each then sum the columns and divide by total area
            var t = fieldNames.map(function(k){
              var total_area = 0;
              var total = [];
              results.features.map(function(f){
                var total_areaF = parseFloat(f.attributes[total_area_fieldname]);
                total_area = total_area + total_areaF;
                total.push(f.attributes[k].split(',').map(n => parseFloat(n)*total_areaF));
              });

              const colSums = [];
              for(let col = 0;col < total[0].length;col++){
                let colSum = 0;
                for(let row = 0;row < total.length;row++){
                  colSum = colSum + total[row][col];
                }
                colSums.push(colSum);
              };

              //Convert back to pct
              colSums = colSums.map((n)=>n/total_area*100)
              ///////////////////////////////////////////////////////////////////////
              //Set up chart object
                var out = {'borderColor':colors[which_one][colorsI],
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
                'backgroundColor':colors[which_one][colorsI]}
                colorsI ++;
                return out;
            })

            return t;

          }
        },

        // Fetch the features that are visible to the user,
        // and chart them.
        chartVisibleFeatures: function(in_view, in_layer) {

            // Create a series of divs up top
            // First create a div - container for the three canvasses, and then attach it to the correct div
            const right_side_div = document.getElementById("side-chart");
            let canvas_container = document.createElement("div");
            canvas_container.setAttribute("id", "canvas-container")
            right_side_div.appendChild(canvas_container);

            // Then create the three divs for canvasses 
            let chart_change_div = document.createElement("div");
            chart_change_div.setAttribute("id", "chart-change-div");
            let chart_landcover_div = document.createElement("chart-landcover-div");
            let chart_landuse_div = document.createElement("chart-landuse-div");

            // Append these divs to the container div - "right side div"
            canvas_container.appendChild()

            my_canvas.setAttribute("id", "chart-canvas");
            chart_loc.appendChild(my_canvas);


            // Get extent of view
            pastExtent = in_view.extent;


            // Create still computing var
            let stillComputing = false;

            // Watch extent to see if user is panning or zooming
            in_view.watch('extent', function(evt){
                // If something is still happening, hold off, watch, wait
                if(!stillComputing){
                    viewWatched = true;
                    setTimeout( () => {
                        // If we've stopped navigating, run a query of features
                        if(!in_view.navigating  && viewWatched  && pastExtent !== in_view.extent) {
                            pastExtent = in_view.extent;
                            in_layer.queryFeatures({
                                geometry: in_view.extent,
                                returnGeometry: true
                            }).then( (results) => {
                                // console.log(results.features.length);
                                stillComputing = true;
                               if(results.features.length>0){
                                    // return results;
                                    // Create top output - changes


                                    stillComputing = false;
                                    viewWatched = false;
                                 }else{
                                   viewWatched = false; 
                                 };
                            } )
                        }
                    }, 1000)
                }
            })

        },

        // Create a chart in the side panel based on which of the metric groupings is selected.
        setContentInfo: function(results, which_one, chart_div, on_off_dict) {
          delete on_off_dict["Change"]["Change---Select All"]
          delete on_off_dict["Land_Cover"]["Land_Cover---Select All"]
          delete on_off_dict["Land_Use"]["Land_Use---Select All"];


            function range(start, end) {
                if(start === end) return [start];
                return [start, ...range(start + 1, end)];
            }

            const years = range(1985,2020).map(i => i.toString());
            const colors = {'Change':["f39268","d54309","00a398","1B1716"].map(c =>'#'+c),
                          'Land_Cover':["005e00","008000","00cc00","b3ff1a","99ff99","b30088","e68a00","ffad33","ffe0b3","ffff00","AA7700","d3bf9b","808080","4780f3","1B1716"].map(c =>'#'+c),
                          'Land_Use': ["efff6b","ff2ff8","1b9d0c","97ffff","a1a1a1","c2b34a","1B1716"].map(c =>'#'+c)};
            const names = {'Change':["Slow Loss","Fast Loss","Gain","Non-Processing Area Mask"],
                        'Land_Cover':["Trees",
            "Tall Shrubs & Trees Mix","Shrubs & Trees Mix","Grass/Forb/Herb & Trees Mix","Barren & Trees Mix","Tall Shrubs","Shrubs","Grass/Forb/Herb & Shrubs Mix","Barren & Shrubs Mix","Grass/Forb/Herb", "Barren & Grass/Forb/Herb Mix","Barren or Impervious","Snow or Ice","Water","Non-Processing Area Mask"],
                        'Land_Use':["Agriculture","Developed","Forest","Non-Forest Wetland","Other","Rangeland or Pasture","Non-Processing Area Mask"]
            }

            const color_name_dict = {
              'Change': {'Slow Loss': '#f39268', 'Fast Loss': '#d54309', 'Gain': '#00a398', 'Non-Processing Area Mask': '#1B1716'},
              'Land_Cover': {'Trees': '#005e00', 'Tall Shrubs & Trees Mix': '#008000', 'Shrubs & Trees Mix': '#00cc00', 'Grass/Forb/Herb & Trees Mix': '#b3ff1a', 'Barren & Trees Mix': '#99ff99', 'Tall Shrubs': '#b30088',  'Shrubs': '#e68a00', 'Grass/Forb/Herb & Shrubs Mix': '#ffad33',
              'Barren & Shrubs Mix': '#ffe0b3', 'Grass/Forb/Herb': '#ffff00', 'Barren & Grass/Forb/Herb Mix': '#AA7700', 'Barren or Impervious': '#d3bf9b', 'Snow or Ice': '#808080', 'Water': '#4780f3', 'Non-Processing Area Mask': '#1B1716'},
              'Land_Use': {'Agriculture': '#efff6b', 'Developed': '#ff2ff8', 'Forest': '#1b9d0c', 'Non-Forest Wetland': '#97ffff', 'Other': '#a1a1a1', 'Rangeland or Pasture': '#c2b34a', 'Non-Processing Area Mask': '#1B1716'}
            }

            // Print out the members of the dictionary that are true
            const class_dict = on_off_dict[which_one];
            const toggled_elems = Object.keys(class_dict).reduce(function (filtered, key) {
              if (class_dict[key] === true) filtered[key] = class_dict[key];
              return filtered;
            }, {});

            // Create a list of toggled elements and allow that to be what feeds the chart function
            const fieldNames = Object.keys(toggled_elems);

            console.log("Field Names: ", fieldNames);

            const stacked = false;
            const chartID = 'chart-canvas-'+which_one
            let colorsI = 0;
            const total_area_fieldname = 'total_area';


            if ( fieldNames.length > 0 ) {
              ///////////////////////////////////////////////////////////////////////
              //Iterate across each field name and add up totals 
              //First get 2-d array of all areas for each then sum the columns and divide by total area
              var t = fieldNames.map(function(k){
                var total_area = 0;
                var total = [];
                results.features.map(function(f){
                  var total_areaF = parseFloat(f.attributes[total_area_fieldname]);
                  total_area = total_area + total_areaF;
                  total.push(f.attributes[k].split(',').map(n => parseFloat(n)*total_areaF));
                })
                
                var colSums = [];
                for(var col = 0;col < total[0].length;col++){
                  var colSum = 0;
                  for(var row = 0;row < total.length;row++){
                    colSum = colSum + total[row][col];
                  }
                  colSums.push(colSum);
                };
                //Convert back to pct
                colSums = colSums.map((n)=>n/total_area*100)
                ///////////////////////////////////////////////////////////////////////
                //Set up chart object
                  var out = {'borderColor':colors[which_one][colorsI],
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
                  'backgroundColor':colors[which_one][colorsI]}
                  colorsI ++;
                  return out;
                })
      
            //Clean out existing chart  
            try{
              chartJSChart.destroy(); 
            }
            catch(err){};
            $(`#${chartID}`).remove(); 
      
            //Add new chart
            $(`#${chart_div}`).append(`<canvas class = "chart" id="${chartID}"><canvas>`);
            // $('#chartDiv').append('<hr>');
            //Set up chart object
            var chartJSChart = new Chart($(`#${chartID}`),{
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
            else{
              try{
                chartJSChart.destroy(); 
              }
              catch(err){};
              $(`#${chartID}`).remove(); 
        
              //Add new chart
              $(`#${chart_div}`).append(`<canvas class = "chart" id="${chartID}"><canvas>`);
            }

            
            // var stacked = false;
            // var fieldNames = names[which_one].map(w => which_one + '---'+w);
            
            
        },

        updateChartContent: function(in_view, in_layer) {


            const setContentInfo = (results, which_one, chart_div) => {
                function range(start, end) {
                    if(start === end) return [start];
                    return [start, ...range(start + 1, end)];
                }
          
    
                var years = range(1985,2020).map(i => i.toString());
                var colors = {'Change':["f39268","d54309","00a398","1B1716"].map(c =>'#'+c),
                              'Land_Cover':["005e00","008000","00cc00","b3ff1a","99ff99","b30088","e68a00","ffad33","ffe0b3","ffff00","AA7700","d3bf9b","ffffff","4780f3","1B1716"].map(c =>'#'+c),
                              'Land_Use': ["efff6b","ff2ff8","1b9d0c","97ffff","a1a1a1","c2b34a","1B1716"].map(c =>'#'+c)};
                var names = {'Change':["Slow Loss","Fast Loss","Gain","Non-Processing Area Mask"],
                            'Land_Cover':["Trees",
                "Tall Shrubs & Trees Mix","Shrubs & Trees Mix","Grass/Forb/Herb & Trees Mix","Barren & Trees Mix","Tall Shrubs","Shrubs","Grass/Forb/Herb & Shrubs Mix","Barren & Shrubs Mix","Grass/Forb/Herb", "Barren & Grass/Forb/Herb Mix","Barren or Impervious","Snow or Ice","Water","Non-Processing Area Mask"],
                            'Land_Use':["Agriculture","Developed","Forest","Non-Forest Wetland","Other","Rangeland or Pasture","Non-Processing Area Mask"]
                            }
    
    
    
                var stacked = false;
                var fieldNames = names[which_one].map(w => which_one + '---'+w);
                var chartID = 'chart-canvas-'+which_one
                var colorsI = 0;
                const total_area_fieldname = 'total_area';
                // if(results.features.length>3){
                //   var area_names = 'LCMS Summary for '+results.features.length.toString()+ ' areas'
                // }else{
                //   var area_names = results.features.map((f)=>f.attributes[titleField]).join(', ');
                // }
                
                // console.log(area_names)
                // var name =area_names + ' - '+which_one.replace('_',' ');
                ///////////////////////////////////////////////////////////////////////
                //Iterate across each field name and add up totals 
                //First get 2-d array of all areas for each then sum the columns and divide by total area
                var t = fieldNames.map(function(k){
                  var total_area = 0;
                  var total = [];
                  results.features.map(function(f){
                    var total_areaF = parseFloat(f.attributes[total_area_fieldname]);
                    total_area = total_area + total_areaF;
                    total.push(f.attributes[k].split(',').map(n => parseFloat(n)*total_areaF));
                   })
                  
                  var colSums = [];
                  for(var col = 0;col < total[0].length;col++){
                    var colSum = 0;
                    for(var row = 0;row < total.length;row++){
                      colSum = colSum + total[row][col];
                    }
                    colSums.push(colSum);
                  };
                  //Convert back to pct
                  colSums = colSums.map((n)=>n/total_area*100)
                  ///////////////////////////////////////////////////////////////////////
                  //Set up chart object
                    var out = {'borderColor':colors[which_one][colorsI],
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
                    'backgroundColor':colors[which_one][colorsI]}
                    colorsI ++;
                    return out;
                  })
        
              //Clean out existing chart  
              try{
                chartJSChart.destroy(); 
              }
              catch(err){};
              $(`#${chartID}`).remove(); 
        
              //Add new chart
              $(`#${chart_div}`).append(`<canvas class = "chart" id="${chartID}"><canvas>`);
              // $('#chartDiv').append('<hr>');
              //Set up chart object
              var chartJSChart = new Chart($(`#${chartID}`),{
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


            let pastExtent = in_view.extent;

            let stillComputing = false;



            // Watch extent to see if user is panning or zooming
            in_view.watch('extent', function(evt){
                // If something is still happening, hold off, watch, wait
                if(!stillComputing){
                    viewWatched = true;
                    setTimeout( () => {
                        // If we've stopped navigating, run a query of features
                        if(!in_view.navigating  && viewWatched  && pastExtent !== in_view.extent) {
                            pastExtent = in_view.extent;
                            in_layer.queryFeatures({
                                geometry: in_view.extent,
                                returnGeometry: true
                            }).then( (results) => {
                                // console.log(results.features.length);
                                stillComputing = true;
                                if(results.features.length>0){
                                    // Call function below
                                    ['Change','Land_Cover','Land_Use'].map((w) => setContentInfo(results,w,"side-chart"));
                                    setContentInfo(results, "")
                                    console.log(results);

                                    stillComputing = false;
                                    viewWatched = false;
                                }else{
                                    viewWatched = false; 
                                };
                            } )
                        }
                    }, 1000)
                }
            })
        }
        

    })
});