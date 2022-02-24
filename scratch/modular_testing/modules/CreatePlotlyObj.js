define([
    "dojo/_base/declare",
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js",
], function(declare, Chart){

    return declare(null,{

        outputObj: null,

        constructor: function(options){
            // specify class defaults

        },

        // Use the class properties to display a chart object in hardcoded div.
        // Pascal CASE.
        createOutputObj: function(results, fieldNames){
            
            if ( results != null ){
                years = results.features[0].attributes["years"].split(",");

                // Employ Ian's function. 
                //Iterate across each field name and add up totals 
                //First get 2-d array of all areas for each then sum the columns and divide by total area
                const colors = ["#e34a33", "#3182bd", "#31a354", "#dd1c77"];
                let col_i = 0;
                var t = fieldNames.map(function(k){
                    var total_area = 0;
                    var total = [];
                    // document.write(total);
                    results.features.map(function(f){
                        var total_areaF = parseFloat(f.attributes['total_area']);
                        total_area = total_area + total_areaF;
                        // document.write(total_area);
                        total.push(f.attributes[k].split(',').map(n => parseFloat(n)*total_areaF));
                    })
                    
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
                console.log(t);
                // document.write(t[0].y);
                // Plotly.newPlot(div, t);


                if (document.getElementById("chart-canvas") != null){
                    document.getElementById("chart-canvas").remove();
                };
                
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