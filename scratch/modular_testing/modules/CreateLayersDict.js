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
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassHuc10-outID.geojson",
                renderer: renderer,
                title: 'Tongass HUC 10'
            });
            const tongass_huc_8 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassHuc8-outID.geojson",
                renderer: renderer,
                title: 'Tongass HUC 8'
            });
            const tongass_huc_6 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassHuc6-outID.geojson",
                renderer: renderer,
                title: 'Tongass HUC 6'
            });
            const tongass_hex_m = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_M_Tongass-outID.geojson",
                renderer: renderer,
                title: 'Tongass Hexagon (Sm.)'
            });
            const tongass_hex_l = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_L_Tongass-outID.geojson",
                renderer: renderer,
                title: 'Tongass Hexagon (Med.)'
            });
            const tongass_hex_xl = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_XL_Tongass-outID.geojson",
                renderer: renderer,
                title: 'Tongass Hexagon (Lrg.)'
            });
            const tongass_ecosection = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassNationalForestEcologicalSubsections-outID.geojson",
                renderer: renderer,
                title: 'Tongass Eco. Subsections'
            });
            const tongass_lta = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassNationalForestLandTypeAssociations-outID.geojson",
                renderer: renderer,
                title: 'Tongass LTAs'
            });
        
            // Create all Chugach layers here
            const chugach_huc10 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-ChugachHuc10-outID.geojson",
                renderer: renderer,
                title: 'Chugach HUC 10'
            });
            const chugach_huc8 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-ChugachHuc8-outID.geojson",
                renderer: renderer,
                title: 'Chugach HUC 8'
            });
            const chugach_huc6 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-ChugachHuc6-outID.geojson",
                renderer: renderer,
                title: 'Chugach HUC 6'
            });
            const chugach_natl_forest_boundary = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Chugach_National_Forest_Boundary-outID.geojson",
                renderer: renderer,
                title: 'Chugach NF Boundary'
            });
            const chugach_natl_forest_ecosection = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Chugach_National_Forest_Ecosection-outID.geojson",
                renderer: renderer,
                title: 'Chugach Eco. Subsections'
            });
            const chugach_natl_forest_lta = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Chugach_National_Forest_Land_Type_Association-outID.geojson",
                renderer: renderer,
                title: 'Chugach LTAs'
            });
            const chugach_natl_forest_hex_m = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_M_Chugach-outID.geojson",
                renderer: renderer,
                title: 'Chugach Hexagaons (Sm.)'
            });
            const chugach_natl_forest_hex_l = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_L_Chugach-outID.geojson",
                renderer: renderer,
                title: 'Chugach Hexagons (Med.)'
            });
            const chugach_natl_forest_hex_xl = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_XL_Chugach-outID.geojson",
                renderer: renderer,
                title: 'Chugach Hexagons (Lrg.)'
            });

            // Create a layer dictionary to return 
            const radio_button_layer_dict = {
                "chugach-huc10-radio-wrapper": chugach_huc10,
                "chugach-huc8-radio-wrapper": chugach_huc8,
                "chugach-huc6-radio-wrapper": chugach_huc6,
                "chugach-small-hex-radio-wrapper": chugach_natl_forest_hex_m,
                "chugach-med-hex-radio-wrapper": chugach_natl_forest_hex_l,
                "chugach-lrg-hex-radio-wrapper": chugach_natl_forest_hex_xl,
                "chugach-ecosection-radio-wrapper": chugach_natl_forest_ecosection,
                "chugach-lta-radio-wrapper": chugach_natl_forest_lta,
                "chugach-boundary-radio-wrapper": chugach_natl_forest_boundary,
                "tongass-huc10-radio-wrapper": tongass_huc_10,
                "tongass-huc8-radio-wrapper": tongass_huc_8,
                "tongass-huc6-radio-wrapper": tongass_huc_6,
                "tongass-small-hex-radio-wrapper": tongass_hex_m,
                "tongass-med-hex-radio-wrapper": tongass_hex_l,
                "tongass-lrg-hex-radio-wrapper": tongass_hex_xl,
                "tongass-ecosection-radio-wrapper": tongass_ecosection,
                "tongass-lta-radio-wrapper": tongass_lta
              };

            return radio_button_layer_dict;
        }
    })
});