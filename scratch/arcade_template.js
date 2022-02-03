require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GeoJSONLayer",
  "esri/widgets/Legend"
], (Map, MapView, GeoJSONLayer, Legend) => {

  // Renderer dict for the geojson display parms
  const renderer = {
      type: "simple",  // autocasts as new SimpleRenderer()
      symbol: {
          type: "simple-fill",  // autocasts as new SimpleFillSymbol()
          color: [ 75, 75, 75, 0.3 ],
          outline: {  // autocasts as new SimpleLineSymbol()
              width: 1.3,
              color:'#00897B'
          }
      }
  };

  // Displays district name above feature
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
  
  // Reads GeoJSON file and adds parms - is now a geojson layer.
  const lcms_districts = new GeoJSONLayer({
      title: "USFS Ranger Districts",
      url: 'geojson/LCMS-Summaries-DISTRICTNA_compressed.geojson',
      copyright: "USDA USFS GTAC",
      legendEnabled: true,
      renderer: renderer,
      labelingInfo: [labelClass],
      popupTemplate: {
          // Sets popup title, not chart title
          title: "LCMS Summaries",
          content: [{
              type: "expression",
              expressionInfo: {
                  // This expression allows popups to show. 
                  // In particular, this is an example expression taken from esri training.
                  expression: `
                  // Pull out strings of x and y values.
                  var change_gain = $feature["Change---Gain"];
                  var change_loss = $feature["Change---Fast Loss"];

                  // Create a list of years to be the x values for your chart
                  var years = $feature["years"];
                  var xlist = Split(years, ",");
                  
                  // Convert these strings to lists
                  var ylist = Split(change_gain, ",");

                  // This is a list of y values as FLOATs
                  var f_ylist = [];

                  // Fill FLOAT ylist 
                  for(var k in ylist){
                      Push(f_ylist, Number(ylist[k]));
                  }

                  // Create a feature dictionary of x and y 
                  var f_dict = {};

                  // Fill dictionary: keys=xvals, vals=yvals
                  for(var i in f_ylist){
                      f_dict[xlist[i]] = f_ylist[i];
                  };

                  return {
                      type: "media",
                      attributes: f_dict,
                      title: "Change over time",
                      mediaInfos: [{
              
                      }, {
                      type: "linechart",
                      title: "Gain",
                      value: {
                          fields: xlist
                      }
                      }]
                  };
                  `
              }
          }]
      }
  });

  // Adds new map 
  const map = new Map({
    basemap: "hybrid",
    layers: [lcms_districts]
  });

  // Adds new map view
  const view = new MapView({
      container: "viewDiv",
      map: map,
      popup: {
          highlightEnabled: true,
          dockEnabled: true,
          dockOptions: {
              breakpoint: false,
              position: "top-right"
          }
      },
      zoom: 4,
      center: [-100,40]
  });

  // Add legend
  view.ui.add(
      new Legend({
          view: view,
          layerInfos: [
          {
              layer: lcms_districts
          }
          ]
      }),
      "bottom-left"
  );

});
