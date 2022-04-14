define([
    "dojo/_base/declare",
    "esri/layers/GeoJSONLayer"
], function(
    declare,
    GeoJSONLayer
    ){
 
    return declare(null,{

        constructor: function(options){
            
        },
           
        createLayersDict: function() {

            // Dictionary object that is supplied to the layer - visibility parameters.
            const renderer = {
                type: "simple",  
                symbol: {
                type: "simple-fill",  
                color: [ 75, 75, 75, 0.3 ],
                outline: {  
                    width: 1.3,
                    color:'#00897B'
                }
                }
            };

            // Create all Tongass Layers
            const tongass_huc_10 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-TongassNationalForestHuc10-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass HUC 10'
            });
            const tongass_huc_8 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-TongassNationalForestHuc8-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass HUC 8'
            });
            const tongass_huc_6 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-TongassNationalForestHuc6-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass HUC 6'
            });
            const tongass_hex_m = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-TongassNationalForest_HEX_M-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass Hexagon (Sm.)'
            });
            const tongass_hex_l = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-TongassNationalForest_HEX_L-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass Hexagon (Med.)'
            });
            const tongass_hex_xl = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-TongassNationalForest_HEX_XL-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass Hexagon (Lrg.)'
            });
            const tongass_ecosection = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-TongassNationalForestEcosections-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass Eco. Subsections'
            });
            const tongass_lta = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-TongassNationalForestLTA-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass LTAs'
            });
            const tongass_natl_forest_boundary = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-TongassNationalForestAdministrativeBoundary-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass NF Boundary'
            });
            const tongass_natl_forest_ranger_district = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-TongassNationalForestRangerDistricts-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass NF Ranger Districts'
            });
        
            // Create all Chugach layers here
            const chugach_huc10 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-ChugachNationalForestHUC10-outID_compressed.geojson",
                     
                renderer: renderer,
                title: 'Chugach HUC 10'
            });
            const chugach_huc8 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-ChugachNationalForestHUC8-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach HUC 8'
            });
            const chugach_huc6 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-ChugachNationalForestHUC6-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach HUC 6'
            });
            const chugach_natl_forest_boundary = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-ChugachNationalForestBoundary-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach NF Boundary'
            });
            const chugach_natl_forest_ecosection = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-Chugach_National_Forest_Ecosection-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach Eco. Subsections'
            });
            const chugach_natl_forest_ranger_district = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-ChugachNationalForestRangerDistricts-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach Ranger Districts'
            });
            const chugach_natl_forest_lta = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-ChugachNationalForestLTA-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach LTAs'
            });
            const chugach_natl_forest_hex_m = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-ChugachNationalForest_HEX_M-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach Hexagaons (Sm.)'
            });
            const chugach_natl_forest_hex_l = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-ChugachNationalForest_HEX_L-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach Hexagons (Med.)'
            });
            const chugach_natl_forest_hex_xl = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries_Terrestrial-ChugachNationalForest_HEX_L-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach Hexagons (Lrg.)'
            });



            // Create a layer dictionary to return 
            const radio_button_layer_dict = {
                "chugach-huc10-radio-wrapper": {
                    'layer_var': chugach_huc10,
                    'is_visible': false,
                    'display_name': 'Chugach N.F. HUC 10'
                } ,
                "chugach-ranger-district-radio-wrapper": {
                    'layer_var': chugach_natl_forest_ranger_district,
                    'is_visible': false,
                    'display_name': 'Chugach N.F. Ranger Districts'
                },
                "chugach-huc8-radio-wrapper": {
                    'layer_var': chugach_huc8,
                    'is_visible': false,
                    'display_name': 'Chugach N.F. HUC 8'
                } ,
                "chugach-huc6-radio-wrapper": {
                    'layer_var': chugach_huc6,
                    'is_visible': false,
                    'display_name': 'Chugach N.F. HUC 6'
                } ,
                "chugach-small-hex-radio-wrapper": {
                    'layer_var': chugach_natl_forest_hex_m,
                    'is_visible': false,
                    'display_name': 'Chugach N.F. Hexagons - small'
                } ,
                "chugach-med-hex-radio-wrapper": {
                    'layer_var': chugach_natl_forest_hex_l,
                    'is_visible': false,
                    'display_name': 'Chugach N.F. Hexagons - med.'
                },
                "chugach-lrg-hex-radio-wrapper": {
                    'layer_var': chugach_natl_forest_hex_xl,
                    'is_visible': false,
                    'display_name': 'Chugach N.F. Hexagons - large'
                },
                "chugach-ecosection-radio-wrapper": {
                    'layer_var': chugach_natl_forest_ecosection,
                    'is_visible': false,
                    'display_name': 'Chugach N.F. Ecological Subsections'
                },
                "chugach-lta-radio-wrapper": {
                    'layer_var': chugach_natl_forest_lta,
                    'is_visible': false,
                    'display_name': 'Chugach N.F. Land Type Associations'
                },
                "chugach-boundary-radio-wrapper": {
                    'layer_var': chugach_natl_forest_boundary,
                    'is_visible': false,
                    'display_name': 'Chugach N.F. Boundary'
                },
                "tongass-huc10-radio-wrapper": {
                    'layer_var': tongass_huc_10,
                    'is_visible': false,
                    'display_name': 'Tongass N.F. HUC 10'
                },
                // "tongass-boundary-radio-wrapper": {
                //     'layer_var': tongass_natl_forest_boundary,
                //     'is_visible': false,
                //     'display_name': 'Tongass N.F. Boundary'
                // },
                "tongass-huc8-radio-wrapper": {
                    'layer_var': tongass_huc_8,
                    'is_visible': false,
                    'display_name': 'Tongass N.F. HUC 8'
                },
                "tongass-huc6-radio-wrapper": {
                    'layer_var': tongass_huc_6,
                    'is_visible': false,
                    'display_name': 'Tongass N.F. HUC 6'
                },
                "tongass-small-hex-radio-wrapper": {
                    'layer_var': tongass_hex_m,
                    'is_visible': false,
                    'display_name': 'Tongass N.F. Hexagons - small'
                },
                "tongass-med-hex-radio-wrapper": {
                    'layer_var': tongass_hex_l,
                    'is_visible': false,
                    'display_name': 'Tongass N.F. Hexagons - med.'
                },
                "tongass-lrg-hex-radio-wrapper": {
                    'layer_var': tongass_hex_xl,
                    'is_visible': false,
                    'display_name': 'Tongass N.F. Hexagons - large'
                },
                "tongass-ecosection-radio-wrapper": {
                    'layer_var': tongass_ecosection,
                    'is_visible': false,
                    'display_name': 'Tongass N.F. Ecological Subsections'
                },
                "tongass-lta-radio-wrapper": {
                    'layer_var': tongass_lta,
                    'is_visible': false,
                    'display_name': 'Tongass N.F. Land Type Associations'
                },
                "tongass-ranger-district-radio-wrapper": {
                    'layer_var': tongass_natl_forest_ranger_district,
                    'is_visible': false,
                    'display_name': 'Tongass N.F. Ranger Districts'
                }
              };


            //   const json_layer_dict = {};

            //   const bucketName = 'lcms-dashboard'
            //   // ajax call here 
            //   $.ajax({
            //     type: 'GET',
            //     url: `https://storage.googleapis.com/storage/v1/b/${bucketName}/o`,
            // }).done(function(json){

            //     json = json.items.filter((f)=>f .name.indexOf('Terrestrial')>-1);

            //     "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-Hex_M_Tongass-outID_compressed.geojson"
                

            //     json.forEach((j) => {
            //         console.log(j);
            //         // console.log(j['selfLink'])
            //         // console.log("STUFF.. : ", j['id'].split('-')[3])
            //         // console.log("NAME: ", j['name'].split('.')[0])

            //         const lyr_name = j['name'].split('.')[0]
            //         // console.log("URL: URL:  https://storage.googleapis.com/lcms-dashboard/"+j['name']);

            //         const lyr_var = new GeoJSONLayer({
            //             url: "https://storage.googleapis.com/lcms-dashboard/"+j['name'],
            //             renderer: renderer,
            //             title: lyr_name
            //         });


            //         json_layer_dict[lyr_name+'-radio-wrapper'] = {
            //             'layer_var': lyr_var,
            //             'is_visible': false,
            //             'display_name': lyr_name
            //         };

            //         // console.log("LYR: ", lyr_var);

            //         // json_layer_dict[]
                    

            //     });

                // console.log("JSON.. : ", json);
                // console.log("JSON SELF LINK: ", json[0]['selfLink'])
                // console.log(json.items);
            // })

            // console.log("JSONLAYERDICT: ", json_layer_dict);


            return radio_button_layer_dict;
            // return json_layer_dict;
        }
    })
});