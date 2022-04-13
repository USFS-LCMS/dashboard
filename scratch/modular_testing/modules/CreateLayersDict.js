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
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-TongassHuc10-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass HUC 10'
            });
            const tongass_huc_8 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-TongassHuc8-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass HUC 8'
            });
            const tongass_huc_6 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-TongassHuc6-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass HUC 6'
            });
            const tongass_hex_m = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-Hex_M_Tongass-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass Hexagon (Sm.)'
            });
            const tongass_hex_l = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-Hex_L_Tongass-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass Hexagon (Med.)'
            });
            const tongass_hex_xl = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-Hex_XL_Tongass-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass Hexagon (Lrg.)'
            });
            const tongass_ecosection = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-TongassNationalForestEcologicalSubsections-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass Eco. Subsections'
            });
            const tongass_lta = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-TongassNationalForestLandTypeAssociations-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass LTAs'
            });
        
            // Create all Chugach layers here
            const chugach_huc10 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-ChugachHuc10-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach HUC 10'
            });
            const chugach_huc8 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-ChugachHuc8-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach HUC 8'
            });
            const chugach_huc6 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-ChugachHuc6-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach HUC 6'
            });
            const chugach_natl_forest_boundary = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-Chugach_National_Forest_Boundary-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach NF Boundary'
            });
            const chugach_natl_forest_ecosection = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-Chugach_National_Forest_Ecosection-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach Eco. Subsections'
            });
            const chugach_natl_forest_lta = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-Chugach_National_Forest_Land_Type_Association-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach LTAs'
            });
            const chugach_natl_forest_hex_m = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-Hex_M_Chugach-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach Hexagaons (Sm.)'
            });
            const chugach_natl_forest_hex_l = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-Hex_L_Chugach-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach Hexagons (Med.)'
            });
            const chugach_natl_forest_hex_xl = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries3-Hex_XL_Chugach-outID_compressed.geojson",
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
                }
              };

            return radio_button_layer_dict;
        }
    })
});