//Please go to the following jsbin for a working sample: https://jsbin.com/nejolahicu/1/edit?html,js,output
//Depending on server load, it may take awhile for the feature layer to load and be displayed on the map. 
function resizeWindow(){
    console.log('resized')
    var headerHeight = $('#headerDiv').innerHeight()

    $("#viewDiv").height(window.innerHeight-(headerHeight*1.2));
    $("#chartDiv").height(window.innerHeight-(headerHeight*1.2));
    $('#lcms-icon').height($('#dashboard-title').innerHeight()*0.6);
  }
$(document).ready(function() {
  
    window.addEventListener('resize',resizeWindow)
  resizeWindow();
});
 var authProxyAPIURL = "https://rcr-ee-proxy-2.herokuapp.com";
      var geeAPIURL = "https://earthengine.googleapis.com";
      var addLayer;var map;var view;
      var mapper = new Object();
      var layerNumber = 1;
      var layerList = [];
      var runGEE;
      var outstandingGEEServiceCount = 0;

 function initialize(){
        ee.initialize(authProxyAPIURL,geeAPIURL,function(){
        console.log('initialized');

         

        mapper.addLayer = addLayer;
        // $('#spinner').hide();
        runGEE();
        
        });
      }

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/PopupTemplate",
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer",
    "esri/widgets/Expand","esri/widgets/BasemapGallery", "esri/widgets/LayerList","esri/layers/WebTileLayer",
    "esri/widgets/Popup",
    "esri/core/watchUtils",
    "esri/tasks/support/Query",
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js",
    "dojo/domReady!",
  ],
  function (Map, MapView, PopupTemplate, FeatureLayer, GeoJSONLayer,Expand,
        BasemapGallery,
        LayerList,
        WebTileLayer,Popup,watchUtils, Query, Chart) {

    //Add in GEE support
          addLayer = function(eeImage,vizParams,name,visible){
          if(vizParams == undefined){vizParams = {}}
          if(vizParams.addRampToLegend === undefined || vizParams.addRampToLegend === null){vizParams.addRampToLegend = false};
          if(visible === undefined || visible === null){visible = true};
          if(name === undefined || name === null){name = 'Layer '+ layerNumber.toString()};
          if(!vizParams.opacity){vizParams.opacity = 1};
          if(vizParams.addRampToLegend){
            outstandingGEEServiceCount++;
            if(vizParams.labelEnding === undefined || vizParams.labelEnding === null){vizParams.labelEnding = ''}
            if(vizParams.title === undefined || vizParams.title === null){vizParams.title = ''}
            var palette = vizParams.palette;
            var ramp = palette.split(',').map(function(i){return '#'+i}).join(',');
            // console.log(ramp)
            $('#legend-list').append(`<ul class='legend-labels' title = '${vizParams.title}'>
                                      <li><span style = 'width:100%;'>${name}</span></li>
                                      <li><span style='background:linear-gradient(to right,${ramp});width:100%;'></span></li>
                                      <li style = 'float:left'>${vizParams.min} ${vizParams.labelEnding}</li>
                                      <li style = 'float:right'>${vizParams.max} ${vizParams.labelEnding}</li>
                                      </ul>
                                      <br>`)
                                    }
         
          var actualOpacity = vizParams.opacity;
          vizParams.opacity = 1;
          eeImage.getMap(vizParams,function(m){
                                    var url = m.urlFormat;
                                    url = url.replace('{z}','{level}');
                                    url = url.replace('{x}','{col}');
                                    url = url.replace('{y}','{row}');
                                    var eeBaseLayer = new WebTileLayer({
                                                    urlTemplate: url,
                                                    id: name,
                                                    title:name,
                                                    visible: visible,
                                                    opacity: actualOpacity ,
                                                    copyright:'Google Earth Engine|USDA Forest Service' 
                                                    });
                                   
                                    map.layers.add(eeBaseLayer);
                                    //Set image service to bottom
                                    map.layers.reorder(eeBaseLayer,0)
                                    outstandingGEEServiceCount--;
                                    console.log(outstandingGEEServiceCount)
                                    if(outstandingGEEServiceCount === 0){
                                      $('#params-spinner').slideUp()
                                    }
                                    
                                    // layerList.push(eeBaseLayer)
                                    }
          );
         
          
          layerNumber ++
        }
          

          runGEE = function(){
            function getMostRecentChange(c, code){
              return c.map(function(img) {
                var yr = ee.Date(img.get('system:time_start')).get('year');
                return ee.Image(yr).int16().rename(['year']).updateMask(img.eq(code))
                  .copyProperties(img,['system:time_start']);
              });
            }
            var lossYearPalette = ['ffffe5', 'fff7bc', 'fee391', 'fec44f', 'fe9929',
                       'ec7014', 'cc4c02'];
            var gainYearPalette = ['c5ee93', '00a398'];
            var startYear = 1985;
            var endYear = 2020;
            var lcms_output_collections = ['USFS/GTAC/LCMS/v2020-5','USFS/GTAC/LCMS/v2020-6'];
            var lcms_output = ee.ImageCollection(ee.FeatureCollection(lcms_output_collections.map((c)=>ee.ImageCollection(c))).flatten());
            var change = lcms_output.select(['Change']);
            // Convert to year collection for a given code.
            var slowLossYears = getMostRecentChange(change, 2);
            var fastLossYears = getMostRecentChange(change, 3);
            var gainYears = getMostRecentChange(change, 4);

            // Find the most recent year.
            var mostRecentSlowLossYear = slowLossYears.max();
            var mostRecentFastLossYear = fastLossYears.max();
            var mostRecentGainYear = gainYears.max();
            addLayer(mostRecentGainYear,{min:startYear,max:endYear,palette:gainYearPalette},'Gain Year',false);
            addLayer(mostRecentSlowLossYear,{min:startYear,max:endYear,palette:lossYearPalette},'Slow Loss Year');
            addLayer(mostRecentFastLossYear,{min:startYear,max:endYear,palette:lossYearPalette},'Fast Loss Year');
            
            

          }
          
         initialize();
    const template = {
          title: "{DISTRICTNA}"
        };
    var renderer = {
          type: "simple",  // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
            color: [ 75, 75, 75, 0.3 ],
            outline: {  // autocasts as new SimpleLineSymbol()
              width: 1.3,
              // color: '#1B1716',
              color:'#00897B'
            }
          }
        };

      const labelClass = {  // autocasts as new LabelClass()
                          symbol: {
                            type: "text",  // autocasts as new TextSymbol()
                            color: "#B2ECE4",
                            haloColor:  "#372E2C",
                            haloSize: 0.8,
                            font: {  // autocast as new Font()
                               family: "Ubuntu Mono",
                               size: 12,
                               // weight: "bold"
                             }
                          },
                          // labelPlacement: "above-right",
                          labelExpressionInfo: {
                            expression: "$feature.DISTRICTNA"
                          },
                          // maxScale: 0,
                          // minScale: 30000000,
                          
                        };
      const geojsonLayer = new GeoJSONLayer({
        url: './geojson/LCMS-Summaries-DISTRICTNA_compressed.geojson',
        title:"USFS Districts",
        copyright: "USDA USFS GTAC",
        popupTemplate: template,
        legendEnabled:true,
        renderer: renderer, //optional
        labelingInfo: [labelClass]
      });
    var map = new Map({
      basemap: "hybrid",
      layers: [geojsonLayer]
    });

    var view = new MapView({
      container: "viewDiv",
      map: map,
      popup: {
            highlightEnabled: false,
            dockEnabled: true,
            dockOptions: {
              breakpoint: false,
              position: "top-right"
            }
          }
     
    });

    geojsonLayer.when(()=>{
      view.extent = geojsonLayer.fullExtent;
    })
    view.when(()=>{
      // Range function taken from: https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
      function range(start, end) {
          if(start === end) return [start];
          return [start, ...range(start + 1, end)];
      }
      // Create a query to get data from the feature layer
     
      var years = range(1985,2020).map(i => i.toString());
      var colors = {'Change':["f39268","d54309","00a398","1B1716"].map(c =>'#'+c),
                    'Land_Cover':["005e00","008000","00cc00","b3ff1a","99ff99","b30088","e68a00","ffad33","ffe0b3","ffff00","AA7700","d3bf9b","ffffff","4780f3","1B1716"].map(c =>'#'+c),
                    'Land_Use': ["efff6b","ff2ff8","1b9d0c","97ffff","a1a1a1","c2b34a","1B1716"].map(c =>'#'+c)};
      var names = {'Change':["Slow Loss","Fast Loss","Gain","Non-Processing Area Mask"],
                  'Land_Cover':["Trees",
      "Tall Shrubs & Trees Mix","Shrubs & Trees Mix","Grass/Forb/Herb & Trees Mix","Barren & Trees Mix","Tall Shrubs","Shrubs","Grass/Forb/Herb & Shrubs Mix","Barren & Shrubs Mix","Grass/Forb/Herb", "Barren & Grass/Forb/Herb Mix","Barren or Impervious","Snow or Ice","Water","Non-Processing Area Mask"],
                  'Land_Use':["Agriculture","Developed","Forest","Non-Forest Wetland","Other","Rangeland or Pasture","Non-Processing Area Mask"]
                  }
      var titleField = 'DISTRICTNA';
      var chartWhich = ['Change','Land_Cover','Land_Use'];
      var query = new Query();
      query.returnGeometry = true;
      query.outFields = null;//['DISTRICTNA','Change---Slow Loss','Change---Fast Loss','Change---Gain'];
      query.where = "1=1";
      query.num = 50;
      var total_area_fieldname = 'total_area';
      // view.on('drag',(e)=>{
   
      //   if(e.action == 'end'){
      //     console.log(e)
      //     query.geomety = view.extent;
      //      geojsonLayer.queryFeatures(query).then((results) =>{
      //     console.log(results.features)
      //   //    // $('#chartDiv').empty();
      //   //   // chartWhich.map((w) => setContentInfo(results.features[0].attributes,w))
            
            
      //   });
      //   }
      // });
      // view.watch('updating',(e)=>{
      //   if(!e){
      //     console.log('done')
      //     geojsonLayer.queryFeatures({
      //             geometry: view.extent,
      //             returnGeometry: true
      //           })
      //           .then(function (results) {
      //              chartWhich.map((w) => setContentInfo(results,w))
      //           })

      //   }
      // })
      // //'mouse-wheel','drag','double-click'
      // ['mouse-wheel','drag','double-click'].map(function(eventType){
      //   view.on(eventType,(e)=>{
      //   console.log(view.stationary)

      //   if(e.action == 'end' || view.stationary){
          
          // geojsonLayer.queryFeatures({
          //         geometry: view.extent,
          //         returnGeometry: true
          //       }).then(function (results) {
          //         console.log(results.features.length);
                 
          //       if(results.features.length>0){
          //         $('#lcms-icon').addClass('fa-spin');
          //          chartWhich.map((w) => setContentInfo(results,w));
          //          $('#lcms-icon').removeClass('fa-spin');
          //         }
          //       });

          // }
        // })
      // })
    var viewWatched = false;
    var stillComputing = false;
    var pastExtent = view.extent;
     view.watch('extent',function(evt){
      if(!stillComputing){
        viewWatched = true;
        $('.lcms-icon').addClass('fa-spin');
        setTimeout(()=>{
        
          if(!view.navigating  && viewWatched  && pastExtent !== view.extent){
                          console.log('finished')

                          viewWatched = false;
                          pastExtent = view.extent;
                           geojsonLayer.queryFeatures({
                              geometry: view.extent,
                              returnGeometry: true
                            }).then(function (results) {
                              console.log(results.features.length);
                             stillComputing = true;
                            if(results.features.length>0){
                              
                               chartWhich.map((w) => setContentInfo(results,w));
                               $('.lcms-icon').removeClass('fa-spin');
                               stillComputing = false;
                              }else{
                                $('.lcms-icon').removeClass('fa-spin');
                              };

                            });
                        }
                      },1000);
      }
     })
      
      // On view click, query the feature layer and pass the results to setContentInfo function.
      view.on("click", (e) => {
        query.geometry = e.mapPoint;
        console.log(e.mapPoint)
        
        geojsonLayer.queryFeatures(query).then((results) =>{
     
          console.log(results.features.length);
          if(results.features.length>0){
            $('.lcms-icon').addClass('fa-spin');
            chartWhich.map((w) => setContentInfo(results,w));
            $('.lcms-icon').removeClass('fa-spin');
          }
            
            
        });
        
      });

    // Using the data from the feature layer, create a doughnut graph.
    function setContentInfo(results,whichOne){
      // map.layers.add(results.geometry);
      // Create a new canvas element, this is where the graph will be placed.
      // var canvas = document.createElement('canvas');
      // canvas.id = "myChart";
      // console.log(results)
      var stacked = false;
      var fieldNames = names[whichOne].map(w => whichOne + '---'+w);
      // console.log(fieldNames)
      var chartID = 'chart-canvas-'+whichOne
      var colorsI = 0;
      if(results.features.length>3){
        var area_names = 'LCMS Summary for '+results.features.length.toString()+ ' areas'
      }else{
        var area_names = results.features.map((f)=>f.attributes[titleField]).join(', ');
      }
      
      console.log(area_names)
      var name =area_names + ' - '+whichOne.replace('_',' ');
      
      
      var t = fieldNames.map(function(k){
        var total_area = 0;
        var total = [];
        results.features.map(function(f){
          // console.log(f)
          var total_areaF = parseFloat(f.attributes[total_area_fieldname]);
          total_area = total_area + total_areaF;
          // console.log(total_area)
          // console.log(f.attributes[k])
          total.push(f.attributes[k].split(',').map(n => parseFloat(n)*total_areaF));
          

        })
        // console.log(total)
        var colSums = [];
        for(var col = 0;col < total[0].length;col++){
          var colSum = 0;
          for(var row = 0;row < total.length;row++){
            colSum = colSum + total[row][col];
          }
          colSums.push(colSum);
        };
        colSums = colSums.map((n)=>n/total_area*100)
        // console.log(colSums)
        var out = {'borderColor':colors[whichOne][colorsI],
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
      'backgroundColor':colors[whichOne][colorsI]}
        colorsI ++;
        return out;
      })

      // console.log(t)
      // Create a data object, this will include the data from the feature layer and other information like color or labels.
  
    //   // Create a new Chart and hook it to the canvas and then return the canvas.
    try{
      chartJSChart.destroy(); 
    }
    catch(err){};
     $(`#${chartID}`).remove(); 

    $('#chartDiv').append(`<canvas id="${chartID}"><canvas>`);
    // $('#chartDiv').append('<hr>');
      var chartJSChart = new Chart($(`#${chartID}`),{
        type: 'line',
        data: {"labels": years,
        "datasets":t},
        options:{
          responsive: true,
           title: {
                display: true,
                position:'top',
                text: name,
                // fontColor: '#000',
                fontSize: 16
            },
            legend:{
              display:true,
              position:'bottom',
              fontSize:6,
              labels : {
                boxWidth:5,
                usePointStyle: true,
              
              }
            },
            scales: {
              yAxes: [{ stacked: stacked ,scaleLabel:{display:true,labelString:'% Area'}}],
              xAxes: [{ stacked: stacked ,scaleLabel:{display:true,labelString:'Year'},maxBarThickness: 100}]
        }
          }
    });
     
   

    };
    })
    
    var basemapGallery = new Expand({
            content:new BasemapGallery({
              view: view
            }),
            view:view,
            expanded :false
          })

          // Add the widget to the top-right corner of the view
          view.ui.add(basemapGallery, {
            position: "top-left"
          });
         var layerList = new LayerList({
              view: view,
              listItemCreatedFunction: function (event) {

                            // The event object contains an item property.
                            // is is a ListItem referencing the associated layer
                            // and other properties. You can control the visibility of the
                            // item, its title, and actions using this object.

                            var item = event.item;



                            // An array of objects defining actions to place in the LayerList.
                            // By making this array two-dimensional, you can separate similar
                            // actions into separate groups with a breaking line.

                            item.actionsSections = [

                                [{
                                    title: "Increase opacity ",
                                    className: "esri-icon-up",
                                    id: "increase-opacity"
                                }, {
                                    title: "Decrease opacity",
                                    className: "esri-icon-down",
                                    id: "decrease-opacity"
                                }]
                            ];


                        }
                    
            });
          // Event listener that fires each time an action is triggered

            layerList.on("trigger-action", function (event) {
                console.log(event)
                // The layer visible in the view at the time of the trigger.
                var visibleLayer = event.item.layer;

                //.visible ?
                //USALayer : censusLayer;

                // Capture the action id.
                var id = event.action.id;

                if (id === "increase-opacity") {

                    // if the increase-opacity action is triggered, then
                    // increase the opacity of the GroupLayer by 0.25

                    if (visibleLayer.opacity < 1) {
                        visibleLayer.opacity += 0.25;

                    }
                } else if (id === "decrease-opacity") {

                    // if the decrease-opacity action is triggered, then
                    // decrease the opacity of the GroupLayer by 0.25

                    if (visibleLayer.opacity > 0) {
                        visibleLayer.opacity -= 0.25;
                    }
                }
            });
        
          var bgExpand = new Expand({
            view: view,
            content: layerList,
            expanded :false
          });
        
          // Add the expand instance to the ui
          view.ui.add(bgExpand, "top-left");

});