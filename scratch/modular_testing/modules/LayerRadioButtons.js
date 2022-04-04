define([
    "dojo/_base/declare",
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js", // import chart js
], function(declare, Chart){

    return declare(null,{

        output_features: null,

        constructor: function(options){

        },

        initializeLayers: () =>{
            
            // Create all Tongass Layers
            const tongass_huc_10 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassHuc10-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass HUC 10'
            });
            const tongass_huc_8 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassHuc8-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass HUC 8'
            });
            const tongass_huc_6 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassHuc6-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass HUC 6'
            });
            const tongass_hex_m = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_M_Tongass-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass Hexagon (Sm.)'
            });
            const tongass_hex_l = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_L_Tongass-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass Hexagon (Med.)'
            });
            const tongass_hex_xl = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_XL_Tongass-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass Hexagon (Lrg.)'
            });
            const tongass_ecosection = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassNationalForestEcologicalSubsections-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass Eco. Subsections'
            });
            const tongass_lta = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-TongassNationalForestLandTypeAssociations-outID_compressed.geojson",
                renderer: renderer,
                title: 'Tongass LTAs'
            });
        
            // Create all Chugach layers here
            const chugach_huc10 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-ChugachHuc10-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach HUC 10'
            });
            const chugach_huc8 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-ChugachHuc8-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach HUC 8'
            });
            const chugach_huc6 = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-ChugachHuc6-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach HUC 6'
            });
            const chugach_natl_forest_boundary = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Chugach_National_Forest_Boundary-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach NF Boundary'
            });
            const chugach_natl_forest_ecosection = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Chugach_National_Forest_Ecosection-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach Eco. Subsections'
            });
            const chugach_natl_forest_lta = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Chugach_National_Forest_Land_Type_Association-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach LTAs'
            });
            const chugach_natl_forest_hex_m = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_M_Chugach-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach Hexagaons (Sm.)'
            });
            const chugach_natl_forest_hex_l = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_L_Chugach-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach Hexagons (Med.)'
            });
            const chugach_natl_forest_hex_xl = new GeoJSONLayer({
                url: "https://storage.googleapis.com/lcms-dashboard/LCMS-Summaries-Hex_XL_Chugach-outID_compressed.geojson",
                renderer: renderer,
                title: 'Chugach Hexagons (Lrg.)'
            });

            const layers_dict = 

        }

    })
});