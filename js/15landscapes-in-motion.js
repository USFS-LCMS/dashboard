require(["esri/Map", 
            "esri/layers/GeoJSONLayer", 
            "esri/views/MapView",
            "esri/popup/content/support/ChartMediaInfoValue"
            
            ], function (
      Map,
      GeoJSONLayer,
      MapView,
      BasemapGallery,
      ChartMediaInfoValue
    ) {
      // If GeoJSON files are not on the same domain as your website, a CORS enabled server
      // or a proxy is required.
      const url = '../geojson/LCMS-Summaries-DISTRICTNA.geojson';

      // Paste the url into a browser's address bar to download and view the attributes
      // in the GeoJSON file. These attributes include:
      // * mag - magnitude
      // * type - earthquake or other event such as nuclear test
      // * place - location of the event
      // * time - the time of the event
      // Use the Arcade Date() function to format time field into a human-readable format
      // const gif_dir ='http://lcms.forestry.oregonstate.edu/landscapes-in-motion/';
      const gif_dir = 'https://storage.googleapis.com/lcms-gifs/';
      var years =[1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
      var fast_change_fields = years.map(yr => 'Change--Fast Loss--'+yr.toString())
      console.log(fast_change_fields)
    
      const template = {
        title: null,
        content:  [{
          // The following creates a piechart in addition to an image. The chart is
          // also set  up to work with related tables.
          // Autocasts as new MediaContent()
          type: "media",
          // Autocasts as array of MediaInfo objects
          mediaInfos: [ 
          {
            title: null,
            type: "line-chart", // Autocasts as new ImageMediaInfo object
            // Autocasts as new ImageMediaInfoValue object
            value: {fields:fast_change_fields}
          },
          {
            title: null,
            type: "image", // Autocasts as new ImageMediaInfo object
            // Autocasts as new ImageMediaInfoValue object
            value: {
              "sourceURL":  gif_dir+'{GIFNAMELANDCOVER}',
              "linkURL":  gif_dir+'{GIFNAMELANDCOVER}',
            }
          },
          {
            title: null,
            type: "image", // Autocasts as new ImageMediaInfo object
            // Autocasts as new ImageMediaInfoValue object
            value: {
              "sourceURL": gif_dir+'{GIFNAMELANDUSE}',
              "linkURL":  gif_dir+'{GIFNAMELANDUSE}',
            }
          }
          ]
        }]
        
      };

      var renderer = {
          type: "simple",  // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
            color: [ 0, 122, 0, 0.5 ],
            outline: {  // autocasts as new SimpleLineSymbol()
              width: 0.8,
              color: '#1B1716'
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
        url: url,
        copyright: "USFS LCMS",
        popupTemplate: template,
        legendEnabled:true,
        renderer: renderer, //optional
        labelingInfo: [labelClass]
      });

      const map = new Map({
        basemap: "hybrid",
        layers: [geojsonLayer]
      });

      const view = new MapView({
        container: "viewDiv",
        center: [-103, 38],
        zoom: 5,
        map: map
      });
    });

//     var basemapGallery = new BasemapGallery({
//   view: view
// });
// // Add widget to the top right corner of the view
// view.ui.add(basemapGallery, {
//   position: "top-right"
// });
