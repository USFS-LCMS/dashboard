//Function to handle resizing the windows properly
function resizeWindow(){
    console.log('resized')
    var h = window.innerHeight;
    var w = window.innerWidth;
    var headerHeight = $('#headerDiv').height();
    var bottomHeight = $('#bottomDiv').height();
    if(w>h){
      
      $('.left').css({'float':'left','width':'50%'});
      $('.right').css({'float':'right','width':'50%'});
      $('.bottom').css({'position': 'absolute','bottom': '0'});
      $("#viewDiv").height(window.innerHeight-(headerHeight*1.2)-(bottomHeight*1.2));
      $("#chartDiv").height(window.innerHeight-(headerHeight*1.2)-(bottomHeight*1.2));

    }else{
      $("#viewDiv").height((window.innerHeight-(headerHeight*1.2))/2);
      $("#chartDiv").height((window.innerHeight-(headerHeight*1.2))/2);
      $('.left').css({'float':'top','width':'100%'});
      $('.right').css({'float':'bottom','width':'100%'});
    }
    $('#lcms-icon').height($('#dashboard-title').innerHeight()*0.6);

    // $('#chartDiv').css('overflow-y','visible');
  }
///////////////////////////////////////////////////////////////////////
$(document).ready(function() {
    window.addEventListener('resize',resizeWindow)
  resizeWindow();

});

///////////////////////////////////////////////////////////////////////
//Set up GEE objects and variables
var authProxyAPIURL = "https://rcr-ee-proxy-2.herokuapp.com";
var geeAPIURL = "https://earthengine.googleapis.com";
var addLayer;var map;var view;
var mapper = new Object();
var layerNumber = 1;
var layerList = [];
var selectedAreaNameList = [];
var runGEE;
var outstandingGEEServiceCount = 0;
var downloadPDF;
var viewWatched = false;
var stillComputing = false;
var pastExtent;
///////////////////////////////////////////////////////////////////////
// Function to authenticate to GEE and run it when ready
 function initialize(){
  ee.initialize(authProxyAPIURL,geeAPIURL,function(){
  console.log('initialized');
  mapper.addLayer = addLayer;
  runGEE();
    });
  }
///////////////////////////////////////////////////////////////////////
// Start ESRI js api and set everything up
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/PopupTemplate",
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer",
    "esri/widgets/Expand",
    "esri/widgets/BasemapGallery", 
    "esri/widgets/LayerList",
    "esri/layers/WebTileLayer",
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
      var ramp = palette.map(function(i){return '#'+i}).join(',');
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
    ///////////////////////////////////////////////////////////////////////
    // Run GEE code that gets LCMS GEE tile map services
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
      addLayer(mostRecentGainYear,{min:startYear,max:endYear,palette:gainYearPalette,addRampToLegend :true},'Gain Year',false);
      addLayer(mostRecentSlowLossYear,{min:startYear,max:endYear,palette:lossYearPalette,addRampToLegend :true},'Slow Loss Year');
      addLayer(mostRecentFastLossYear,{min:startYear,max:endYear,palette:lossYearPalette,addRampToLegend :true},'Fast Loss Year');
     }

    initialize();
    ///////////////////////////////////////////////////////////////////////
    //Set up the template and renderer for the geojson areas
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
          }
        };
    ///////////////////////////////////////////////////////////////////////
    // Bring in the geojson areas
    const geojsonLayer = new GeoJSONLayer({
      url: './geojson/LCMS-Summaries-DISTRICTNA_compressed.geojson',
      title:"USFS Districts",
      copyright: "USDA USFS GTAC",
      // popupTemplate: template,
      legendEnabled:true,
      renderer: renderer, //optional
      labelingInfo: [labelClass]
    });
    // Set up the map object
    var map = new Map({
      basemap: "hybrid",
      layers: [geojsonLayer]
    });
    // Set up the view
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
    ///////////////////////////////////////////////////////////////////////
    // Once the view is loaded, do this
    view.when(()=>{

      // Range function taken from: https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
      function range(start, end) {
          if(start === end) return [start];
          return [start, ...range(start + 1, end)];
      }
      // Set up everything to handle the LCMS data
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
      ///////////////////////////////////////////////////////////////////////
      // Need to listen for panning and zooming on the map to update charts
      // Since ESRI js api doesn't have a good drag-end or zoom-end listener, need to create one in order to not 
      // crash the browser
      // This method tries to ensure the user is finished panning/zooming before tabulating the graphs
      function updateSelectionList(selectedFeatures){
        $('#selected-area-list').empty();
       
        var i = 1;
        selectedAreaNameList = [];
        selectedFeatures.map((f)=>{var nm = f.attributes[titleField];
          selectedAreaNameList.push(nm);
          $('#selected-area-list').append(`<li  class = "selected-area-name list-group-item list-group-item-action list-group-item-dark">${i}: ${nm}</li>`);
          i++});
        
      }
      pastExtent = view.extent;
       view.watch('extent',function(evt){
        if(!stillComputing){
          viewWatched = true;
          $('.lcms-icon').addClass('fa-spin');
          //Wait a reasonable amount of time to ensure the user is finished zooming/panning
          setTimeout(()=>{
            if(!view.navigating  && viewWatched  && pastExtent !== view.extent){
              console.log('finished')

              
              pastExtent = view.extent;
               geojsonLayer.queryFeatures({
                  geometry: view.extent,
                  returnGeometry: true
                }).then(function (results) {
                  console.log(results.features.length);
                 stillComputing = true;
                if(results.features.length>0){
                   updateSelectionList(results.features);
                   chartWhich.map((w) => setContentInfo(results,w));
                   $('.lcms-icon').removeClass('fa-spin');
                   stillComputing = false;
                   viewWatched = false;
                  }else{
                    $('.lcms-icon').removeClass('fa-spin');
                    viewWatched = false; 
                  };

                });
            }
          },1000);
        }
      })
      ///////////////////////////////////////////////////////////////////////
      // Listening for map clicks is easier
      view.on("click", (e) => {
        query.geometry = e.mapPoint;
        console.log(e.mapPoint)
        
        geojsonLayer.queryFeatures(query).then((results) =>{
     
          console.log(results.features.length);
          if(results.features.length>0){
            $('.lcms-icon').addClass('fa-spin');
            updateSelectionList(results.features);
            chartWhich.map((w) => setContentInfo(results,w));
            $('.lcms-icon').removeClass('fa-spin');
          }
         });
       });
      ///////////////////////////////////////////////////////////////////////
      //Function to download a pdf report
      downloadPDF = function(){
        console.log('Downloading PDF');
        var outFilename = 'LCMS-Summaries'
        if($('#pdfFilename').val() !== ''){
          outFilename = $('#pdfFilename').val()
        }  
       
        // Add area names
        var doc = new jspdf.jsPDF('portrait');
        var h = doc.internal.pageSize.height;
        var w = doc.internal.pageSize.width;
        var margin = 10;
        doc.setFontSize(20);
        doc.text(margin, margin, "The following areas are included in this summary:");
        doc.setFontSize(5);
        doc.text(margin, margin*2, selectedAreaNameList.join(', '),{ maxWidth: doc.internal.pageSize.width-margin*2});
        doc.addPage();

        //Add charts
        var currentY = margin;
        var chartW = w - margin*2;
        var chartH = chartW*0.5;
        ['Change','Land_Cover','Land_Use'].map((w)=>{
          
          if(currentY + chartH > h){
            doc.addPage();
            currentY = margin;
          }
          var canvas = document.querySelector('#chart-canvas-'+w);
          doc.addImage(canvas.toDataURL("image/jpeg", 1.0), 'JPEG', margin, currentY, chartW, chartH );
          currentY = currentY+ chartH + margin;
        })
        
        doc.save(outFilename+'.pdf');
        }
      ///////////////////////////////////////////////////////////////////////
      // Function to tabulate results and create graphs
      function setContentInfo(results,whichOne){
      
        var stacked = false;
        var fieldNames = names[whichOne].map(w => whichOne + '---'+w);
        var chartID = 'chart-canvas-'+whichOne
        var colorsI = 0;
        if(results.features.length>3){
          var area_names = 'LCMS Summary for '+results.features.length.toString()+ ' areas'
        }else{
          var area_names = results.features.map((f)=>f.attributes[titleField]).join(', ');
        }
      
        console.log(area_names)
        var name =area_names + ' - '+whichOne.replace('_',' ');
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

      //Clean out existing chart  
      try{
        chartJSChart.destroy(); 
      }
      catch(err){};
      $(`#${chartID}`).remove(); 

      //Add new chart
      $('#chartDiv').append(`<canvas id="${chartID}"><canvas>`);
      // $('#chartDiv').append('<hr>');
      //Set up chart object
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
            scales: {
              yAxes: [{ stacked: stacked ,scaleLabel:{display:true,labelString:'% Area'}}],
              xAxes: [{ stacked: stacked ,scaleLabel:{display:true,labelString:'Year'},maxBarThickness: 100}]
            }
          }
        });
      };
    })
    ///////////////////////////////////////////////////////////////////////
    //Set up map widgets
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


      //Expand widget
      const selectedBox = document.getElementById("selected-area-div");
      selectedBox.style.display = "block";
      // $('#legend-div').show();
      selectionExpand = new Expand({
          expandIconClass: "esri-icon-chart",
          expandTooltip: "Areas being charted",
          expanded: true,
          view: view,
          content: selectedBox
      });
       view.ui.add(selectionExpand, "top-right");

       //Expand widget
      const legend = document.getElementById("legend-div");
      legend.style.display = "block";
      // $('#legend-div').show();
      legendExpand = new Expand({
          expandIconClass: "esri-icon-key",
          expandTooltip: "Legend",
          expanded: true,
          view: view,
          content: legend
      });
       view.ui.add(legendExpand, "bottom-left");

      // Zoom map to the extent of the geojson layer
      geojsonLayer.when(()=>{
        console.log('setting extent');
        view.extent = geojsonLayer.fullExtent;
      });
});

