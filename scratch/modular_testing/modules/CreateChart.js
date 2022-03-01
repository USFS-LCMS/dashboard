define([
    "dojo/_base/declare",
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js", // import chart js
], function(declare, Chart){

    return declare(null,{

        outputObj: null,

        constructor: function(options){

        },

        // Pascal CASE.
        createOutputObj: function(results, fieldNames){
            /*
            Create a chart object and insert it into the chart div in main html
            */
            
            // Check whether the user has selected anything - more info in main js
            if ( results != null ){

                // Create a x value list for the chart based on the 0th feature found
                years = results.features[0].attributes["years"].split(",");

                // Employ Ian's function. 
                //Iterate across each field name and add up totals 
                //First get 2-d array of all areas for each then sum the columns and divide by total area
                const colors = ["#e34a33", "#3182bd", "#31a354", "#dd1c77"];
                let col_i = 0;

                // Map over input field names - put in from main function.
                var t = fieldNames.map(function(k){
                    var total_area = 0;
                    var total = [];

                    // Get total area for each feature selected.
                    results.features.map(function(f){
                        var total_areaF = parseFloat(f.attributes['total_area']);
                        total_area = total_area + total_areaF;
                        // document.write(total_area);
                        total.push(f.attributes[k].split(',').map(n => parseFloat(n)*total_areaF));
                    })
                    
                    // Create 
                    let colSums = [];
                    for(var col = 0;col < total[0].length;col++){
                        var colSum = 0;
                        for(var row = 0;row < total.length;row++){
                            colSum = colSum + total[row][col];
                        }
                        colSums.push(colSum);
                    };
                    //Convert back to pct
                    colSums = colSums.map((n)=>n/total_area*100)
                    const years = results.features[0].attributes['years'].split(",").map(i => parseInt(i));
                    ///////////////////////////////////////////////////////////////////////
                    //Set up chart object
                    const out = {
                        'borderColor': colors[col_i],
                        'data': colSums,
                        'label': k
                    }
                    col_i ++;
                        return out;
                });

                // Replace existing chart canvas if exists
                if (document.getElementById("chart-canvas") != null){
                    document.getElementById("chart-canvas").remove();
                };

                // Assign self output object to dictionary of chart values
                this.outputObj = t;


                chart_loc = document.getElementById("side-chart");
                let my_canvas = document.createElement("canvas");
                my_canvas.setAttribute("id", "chart-canvas")
                chart_loc.appendChild(my_canvas);
                

                const chartJSChart = new Chart(("chart-canvas"),{
                    type: 'line',
                    data: {"labels": years,
                    "datasets":t},
                    options:{
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1/0.6,
                    title: {
                            display: true,
                            position:'top',
                            text: name,
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
                        }
                    }
                });
            }
            else {
                return "Please select a polygon to output a chart."
            }
        }
    })
});