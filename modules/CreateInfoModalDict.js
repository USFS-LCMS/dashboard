define([
    "dojo/_base/declare",
    "esri/layers/ImageryLayer",
    "modules/ToggleSidebar"
], function(
    declare,
    ImageryLayer,
    ToggleSidebar
    ){
 
    return declare(null,{

        constructor: function(options){
            
        },
        createModals: function(){
            //const text1 = '<h2> Land Cover (Annual Product)</h2><br><br><t>Product Description<br><br>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It shows LCMS modeled land cover classes for each year.<br><br>';
            const text1="<dt><h2>Land Cover (Annual Product)<h2></dt><dd><dl><dt><h3>Product Description</h3></dt><dd>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It shows LCMS modeled land cover classes for each year. </dd><br><dd>A total of 11 land cover classes are mapped on an annual basis using TimeSync reference data and spectral information derived from Landsat imagery. Each class is predicted using a separate Random Forest model, which outputs a probability (proportion of the trees within the Random Forest model) that the pixel belongs to that class. Because of this, individual pixels have 11 different model outputs for each year, and final classes are assigned to the land cover with the highest probability. Five of the eleven land cover classes indicate a single land cover, where that land cover type covers most of the pixel's area and no other class covers more than 10% of the pixel. There are also seven mixed classes. These represent pixels in which two land cover classes cover at least 10% of the pixel.</dd><dd><dl><dt>Class Description:</dt><dd>Land cover class code for each year.</dd></dl></dd></dl><dl><dt><h3>Product Class Definitions</h3></dt><dd>1 : TREES : The majority of the pixel is comprised of live or standing dead trees.<br>2 : TREES/SHRUBS MIX : The pixel is comprised of at least 10% 1) live or standing dead trees and 2) shrubs.<br>3 : TREES/GRASS MIX : The pixel is comprised of at least 10% 1) live or standing dead trees and 2) perennial grasses, forbs, or other forms of herbaceous vegetation.<br>4 : TREES/BARREN MIX : The pixel is comprised of at least 10% 1) live or standing dead trees and 2) bare soil exposed by disturbance (e.g., soil uncovered by mechanical clearing or forest harvest), as well as perennially barren areas such as deserts, playas, rock outcroppings (including minerals and other geologic materials exposed by surface mining activities), sand dunes, salt flats, and beaches. Roads made of dirt and gravel are also considered barren.<br>5 : SHRUBS : The majority of the pixel is comprised of shrubs.<br>6 : SHRUBS/GRASS MIX : The pixel is comprised of at least 10% 1) shrubs and 2) bare soil exposed by disturbance (e.g., soil uncovered by mechanical clearing or forest harvest), as well as perennially barren areas such as deserts, playas, rock outcroppings (including minerals and other geologic materials exposed by surface mining activities), sand dunes, salt flats, and beaches. Roads made of dirt and gravel are also considered barren.<br>7 : SHRUBS/BARREN MIX : The pixel is comprised of at least 10% 1) shrubs and 2) bare soil exposed by disturbance (e.g., soil uncovered by mechanical clearing or forest harvest), as well as perennially barren areas such as deserts, playas, rock outcroppings (including minerals and other geologic materials exposed by surface mining activities), sand dunes, salt flats, and beaches. Roads made of dirt and gravel are also considered barren.<br>8 : GRASS : The majority of the pixel is comprised of perennial grasses, forbs, or other forms of herbaceous vegetation.<br>9 : GRASS/BARREN MIX : The pixel is comprised of at least 10% 1) perennial grasses, forbs, or other forms of herbaceous vegetation and 2) bare soil exposed by disturbance (e.g., soil uncovered by mechanical clearing or forest harvest), as well as perennially barren areas such as deserts, playas, rock outcroppings (including minerals and other geologic materials exposed by surface mining activities), sand dunes, salt flats, and beaches. Roads made of dirt and gravel are also considered barren.<br>10 : BARREN OR IMPERVIOUS : The majority of the pixel is comprised of 1) bare soil exposed by disturbance (e.g., soil uncovered by mechanical clearing or forest harvest), as well as perennially barren areas such as deserts, playas, rock outcroppings (including minerals and other geologic materials exposed by surface mining activities), sand dunes, salt flats, and beaches. Roads made of dirt and gravel are also considered barren or 2) man-made materials that water cannot penetrate, such as paved roads, rooftops, and parking lots.<br>11 : WATER : The majority of the pixel is comprised of water.</dd></dl></dd></dl></dd><br><br>For more information: <a href='https://data.fs.usda.gov/geodata/LCMS/LCMS_R4_v2019-04_Descriptions.html'>LCMS Data Description</a>"
            const text2 ="<dt><h2>Land Use (Annual Product)</h2></dt><dd><dl><dt><h3>Product Description</h3></dt><dd>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It shows LCMS modeled land use classes for each year. </dd><br><dd>A total of 6 land use classes are mapped on an annual basis using TimeSync reference data and spectral information derived from Landsat imagery. All classes are predicted with a single Random Forest model.</dd><dd><dl><dt>Class Description:</dt><dd>Land use class code for each year.</dd></dl></dd></dl><dl><dt><h3>Product Class Definitions</h3></dt><dd>1 : AGRICULTURE : Land used for the production of food, fiber and fuels which is in either a vegetated or non-vegetated state. This includes but is not limited to cultivated and uncultivated croplands, hay lands, orchards, vineyards, confined livestock operations, and areas planted for production of fruits, nuts or berries. Roads used primarily for agricultural use (i.e. not used for public transport from town to town) are considered agriculture land use.<br>2 : DEVELOPED : Land covered by man-made structures (e.g. high density residential, commercial, industrial, mining or transportation), or a mixture of both vegetation (including trees) and structures (e.g., low density residential, lawns, recreational facilities, cemeteries, transportation and utility corridors, etc.), including any land functionally altered by human activity.<br>3 : FOREST : Land that is planted or naturally vegetated and which contains (or is likely to contain) 10% or greater tree cover at some time during a near-term successional sequence. This may include deciduous, evergreen and/or mixed categories of natural forest, forest plantations, and woody wetlands.<br>4 : NON-FOREST WETLAND : Lands adjacent to or within a visible water table (either permanently or seasonally saturated) dominated by shrubs or persistent emergents. These wetlands may be situated shoreward of lakes, river channels, or estuaries; on river floodplains; in isolated catchments; or on slopes. They may also occur as prairie potholes, drainage ditches and stock ponds in agricultural landscapes and may also appear as islands in the middle of lakes or rivers. Other examples also include marshes, bogs, swamps, quagmires, muskegs, sloughs, fens, and bayous.<br>5 : OTHER : Land (regardless of use) where the spectral trend or other supporting evidence suggests a disturbance or change event has occurred but the definitive cause cannot be determined or the type of change fails to meet any of the change process categories defined above.<br>6 : RANGELAND/PASTURE : This class includes any area that is either a.) Rangeland, where vegetation is a mix of native grasses, shrubs, forbs and grass-like plants largely arising from natural factors and processes such as rainfall, temperature, elevation and fire, although limited management may include prescribed burning as well as grazing by domestic and wild herbivores; or b.) Pasture, where vegetation may range from mixed, largely natural grasses, forbs and herbs to more managed vegetation dominated by grass species that have been seeded and managed to maintain near monoculture.</dd></dl></dd></dl></dd><br><br>For more information: <a href='https://data.fs.usda.gov/geodata/LCMS/LCMS_R4_v2019-04_Descriptions.html'>LCMS Data Description</a>"
            const text3 = "<dt><h2>Most Recent Year of Fast Loss (Summary Product)</h2></dt><dd><dl><dt><h3>Product Description</h3></dt><dd>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It is a summary of all annual fast loss into a single layer showing the most recent year LCMS detected fast loss. </dd><br><dd>Vegetative indices indicate a negative trend over time. Loss is not categorized explicitly in the training data, however, specific change process classifications are collected. The following describes these change processes, any of which could be present and are collectively considered fast loss.</dd><dd><dl><dt>Class Description:</dt><dd>Year of most recent fast loss minus 1970. This layer only shows the most recent year of fast loss across all years of fast loss modeled by LCMS. The class value of the original individual fast years of loss is 1, while the class values in this layer are the most recent year of fast loss minus 1970.</dd></dl></dd></dl><dl><dt><h3>Product Class Definitions</h3></dt><dd>1 : FIRE :  Land altered by fire, regardless of the cause of the ignition (natural or anthropogenic), severity, or land use.<br>1 : HARVEST : Forest land where trees, shrubs or other vegetation have been severed or removed by anthropogenic means. Examples include clearcutting, salvage logging after fire or insect outbreaks, thinning and other forest management prescriptions (e.g. shelterwood/seedtree harvest).<br>1 : MECHANICAL : Non-forest land where trees, shrubs or other vegetation has been mechanically severed or removed by chaining, scraping, brush sawing, bulldozing, or any other methods of non-forest vegetation removal.<br>1 : WIND/ICE : Land (regardless of use) where vegetation is altered by wind from hurricanes, tornados, storms and other severe weather events including freezing rain from ice storms.<br>1 : HYDROLOGY : Land where flooding has significantly altered woody cover or other Land cover elements regardless of land use (e.g. new mixtures of gravel and vegetation in and around streambeds after a flood).<br>1 : DEBRIS : Land (regardless of use) altered by natural material movement associated with landslides, avalanches, volcanos, debris flows, etc.<br>1 : OTHER : Land (regardless of use) where the spectral trend or other supporting evidence suggests a disturbance or change event has occurred but the definitive cause cannot be determined or the type of change fails to meet any of the change process categories defined above.</dd></dl></dd><br><br>For more information: <a href='https://data.fs.usda.gov/geodata/LCMS/LCMS_R4_v2019-04_Descriptions.html'>LCMS Data Description</a>"
            const text4 = "<dt><h2>Most Recent Year of Gain (Summary Product)</h2></dt><dd><dl><dt><h3>Product Description</h3></dt><dd>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It is a summary of all annual gain into a single layer showing the most recent year LCMS detected gain. </dd><br><dd>Vegetative indices indicate a positive trend over time. Gain is categorized using one specific change process classification within the training data, described below.</dd><dd><dl><dt>Class Description:</dt><dd>Year of most recent gain minus 1970. This layer only shows the most recent year of gain across all years of gain modeled by LCMS. The class value of the original individual years of gain is 1, while the class values in this layer are the most recent year of gain minus 1970.</dd></dl></dd></dl><dl><dt><h3>Product Class Definitions</h3></dt><dd>1 : GROWTH/RECOVERY : Land exhibiting an increase in vegetation cover due to growth and succession over one or more years. Applicable to any areas that may express spectral change associated with vegetation regrowth. In developed areas, growth can result from maturing vegetation and/or newly installed lawns and landscaping. In forests, growth includes vegetation growth from bare ground, as well as the over topping of intermediate and co-dominate trees and/or lower-lying grasses and shrubs. Growth/Recovery segments recorded following forest harvest will likely transition through different land cover classes as the forest regenerates. For these changes to be considered growth/recovery, spectral values should closely adhere to an increasing trend line (e.g. a positive slope that would, if extended to ~20 years, be on the order of .10 units of NDVI) which persists for several years.</dd></dl></dd><br><br>For more information: <a href='https://data.fs.usda.gov/geodata/LCMS/LCMS_R4_v2019-04_Descriptions.html'>LCMS Data Description</a>"
            const text5 = "<dt><h2>Most Recent Year of Slow Loss (Summary Product)</h2></dt><dd><dl><dt><h3>Product Description</h3></dt><dd>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It is a summary of all annual slow loss into a single layer showing the most recent year LCMS detected slow loss. </dd><br><dd>Vegetative indices indicate a negative trend over time. Loss is not categorized explicitly in the training data, however, specific change process classifications are collected. The following describes the change processes, any of which could be present and are collectively considered slow loss.</dd><dd><dl><dt>Class Description:</dt><dd>Year of most recent slow loss minus 1970. This layer only shows the most recent year of slow loss across all years of slow loss modeled by LCMS. The class value of the original individual years of slow loss is 1, while the class values in this layer are the most recent year of slow loss minus 1970.</dd></dl></dd></dl><dl><dt><h3>Product Class Definitions</h3></dt><dd>1 : STRUCTURAL DECLINE : Land where trees or other woody vegetation is physically altered by unfavorable growing conditions brought on by non-anthropogenic or non-mechanical factors. This type of loss should generally create a trend in the spectral signal(s) (e.g. NDVI decreasing, Wetness decreasing; SWIR increasing; etc.) however the trend can be subtle. Structural decline occurs in woody vegetation environments, most likely from insects, disease, drought, acid rain, etc. Structural decline can include defoliation events that do not result in mortality such as in Gypsy moth and spruce budworm infestations which may recover within 1 or 2 years.<br>1 : SPECTRAL DECLINE : A plot where the spectral signal shows a trend in one or more of the spectral bands or indices (e.g. NDVI decreasing, Wetness decreasing; SWIR increasing; etc.). Examples include cases where: a) non-forest/non-woody vegetation shows a trend suggestive of decline (e.g. NDVI decreasing, Wetness decreasing; SWIR increasing; etc.), or b) where woody vegetation shows a decline trend which is not related to the loss of woody vegetation, such as when mature tree canopies close resulting in increased shadowing, when species composition changes from conifer to hardwood, or when a dry period (as opposed to stronger, more acute drought) causes an apparent decline in vigor, but no loss of woody material or leaf area.</dd></dl></dd><br><br>For more information: <a href='https://data.fs.usda.gov/geodata/LCMS/LCMS_R4_v2019-04_Descriptions.html'>LCMS Data Description</a>"
            const text6 = "<dt><h2>Year of Highest Probability of Fast Loss (Summary Product)</h2></dt><dd><dl><dt><h3>Product Description</h3></dt><dd>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It is a summary of all annual fast loss into a single layer showing the year LCMS detected fast loss with the highest model confidence. </dd><br><dd>Vegetative indices indicate a negative trend over time. Loss is not categorized explicitly in the training data, however, specific change process classifications are collected. The following describes these change processes, any of which could be present and are collectively considered fast loss.</dd><dd><dl><dt>Class Description:</dt><dd>Year of highest probability of fast loss minus 1970. This layer only shows the year corresponding to the highest modeled probability of fast loss across all years of fast loss modeled by LCMS. The class value of the original individual years of fast loss is 1, while the class values in this layer are the year of the highest probability of fast loss minus 1970.</dd></dl></dd></dl><dl><dt><h3>Product Class Definitions</h3></dt><dd>1 : FIRE :  Land altered by fire, regardless of the cause of the ignition (natural or anthropogenic), severity, or land use.<br>1 : HARVEST : Forest land where trees, shrubs or other vegetation have been severed or removed by anthropogenic means. Examples include clearcutting, salvage logging after fire or insect outbreaks, thinning and other forest management prescriptions (e.g. shelterwood/seedtree harvest).<br>1 : MECHANICAL : Non-forest land where trees, shrubs or other vegetation has been mechanically severed or removed by chaining, scraping, brush sawing, bulldozing, or any other methods of non-forest vegetation removal.<br>1 : WIND/ICE : Land (regardless of use) where vegetation is altered by wind from hurricanes, tornados, storms and other severe weather events including freezing rain from ice storms.<br>1 : HYDROLOGY : Land where flooding has significantly altered woody cover or other Land cover elements regardless of land use (e.g. new mixtures of gravel and vegetation in and around streambeds after a flood).<br>1 : DEBRIS : Land (regardless of use) altered by natural material movement associated with landslides, avalanches, volcanos, debris flows, etc.<br>1 : OTHER : Land (regardless of use) where the spectral trend or other supporting evidence suggests a disturbance or change event has occurred but the definitive cause cannot be determined or the type of change fails to meet any of the change process categories defined above.</dd></dl></dd><br><br>For more information: <a href='https://data.fs.usda.gov/geodata/LCMS/LCMS_R4_v2019-04_Descriptions.html'>LCMS Data Description</a>"
            const text7 = "<dt><h2>Year of Highest Probability of Gain (Summary Product)</h2></dt><dd><dl><dt><h3>Product Description</h3></dt><dd>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It is a summary of all annual gain into a single layer showing the year LCMS detected gain with the highest model confidence. </dd><br><dd>Vegetative indices indicate a positive trend over time. Gain is categorized using one specific change process classification within the training data, described below.</dd><dd><dl><dt>Class Description:</dt><dd>Year of highest probability of gain minus 1970. This layer only shows the year corresponding to the highest modeled probability of gain across all years of gain modeled by LCMS. The class value of the original individual years of gain is 1, while the class values in this layer are the year of the highest probability of gain minus 1970.</dd></dl></dd></dl><dl><dt><h3>Product Class Definitions</h3></dt><dd>1 : GROWTH/RECOVERY : Land exhibiting an increase in vegetation cover due to growth and succession over one or more years. Applicable to any areas that may express spectral change associated with vegetation regrowth. In developed areas, growth can result from maturing vegetation and/or newly installed lawns and landscaping. In forests, growth includes vegetation growth from bare ground, as well as the over topping of intermediate and co-dominate trees and/or lower-lying grasses and shrubs. Growth/Recovery segments recorded following forest harvest will likely transition through different land cover classes as the forest regenerates. For these changes to be considered growth/recovery, spectral values should closely adhere to an increasing trend line (e.g. a positive slope that would, if extended to ~20 years, be on the order of .10 units of NDVI) which persists for several years.</dd></dl></dd><br><br>For more information: <a href='https://data.fs.usda.gov/geodata/LCMS/LCMS_R4_v2019-04_Descriptions.html'>LCMS Data Description</a>"
            const text8 = "<dt><h2>Year of Highest Probability of Slow Loss (Summary Product)</h2></dt><dd><dl><dt><h3>Product Description</h3></dt><dd>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It is a summary of all annual slow loss into a single layer showing the year LCMS detected slow loss with the highest model confidence. </dd><br><dd>Vegetative indices indicate a negative trend over time. Loss is not categorized explicitly in the training data, however, specific change process classifications are collected. The following describes the change processes, any of which could be present and are collectively considered slow loss.</dd><dd><dl><dt>Class Description:</dt><dd>Year of highest probability of slow loss minus 1970. This layer only shows the year corresponding to the highest modeled probability of slow loss across all years of slow loss modeled by LCMS. The class value of the original individual years of slow loss is 1, while the class values in this layer are the year of the highest probability of slow loss minus 1970.</dd></dl></dd></dl><dl><dt><h3>Product Class Definitions</h3></dt><dd>1 : STRUCTURAL DECLINE : Land where trees or other woody vegetation is physically altered by unfavorable growing conditions brought on by non-anthropogenic or non-mechanical factors. This type of loss should generally create a trend in the spectral signal(s) (e.g. NDVI decreasing, Wetness decreasing; SWIR increasing; etc.) however the trend can be subtle. Structural decline occurs in woody vegetation environments, most likely from insects, disease, drought, acid rain, etc. Structural decline can include defoliation events that do not result in mortality such as in Gypsy moth and spruce budworm infestations which may recover within 1 or 2 years.<br>1 : SPECTRAL DECLINE : A plot where the spectral signal shows a trend in one or more of the spectral bands or indices (e.g. NDVI decreasing, Wetness decreasing; SWIR increasing; etc.). Examples include cases where: a) non-forest/non-woody vegetation shows a trend suggestive of decline (e.g. NDVI decreasing, Wetness decreasing; SWIR increasing; etc.), or b) where woody vegetation shows a decline trend which is not related to the loss of woody vegetation, such as when mature tree canopies close resulting in increased shadowing, when species composition changes from conifer to hardwood, or when a dry period (as opposed to stronger, more acute drought) causes an apparent decline in vigor, but no loss of woody material or leaf area.</dd></dl></dd><br><br>For more information: <a href='https://data.fs.usda.gov/geodata/LCMS/LCMS_R4_v2019-04_Descriptions.html'>LCMS Data Description</a>"
            //loss
            //const text9 = "<dt><h2>Loss (Annual Product)</h2></dt><dd><dl><dt><h3>Product Description</h3></dt><dd>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It shows areas LCMS detected loss for each year. </dd><br><dd>Vegetative indices indicate a negative trend over time. Loss is not categorized explicitly in the training data, however, specific change process classifications are collected. The following describes the change processes, any of which could be present and are collectively considered loss.</dd><dd><dl><dt>Class Description:</dt><dd>1 indicates loss for each year (The only unmasked value).</dd></dl></dd></dl><dl><dt><h3>Product Class Definitions</h3></dt><dd>1 : FIRE :  Land altered by fire, regardless of the cause of the ignition (natural or anthropogenic), severity, or land use.<br>1 : HARVEST : Forest land where trees, shrubs or other vegetation have been severed or removed by anthropogenic means. Examples include clearcutting, salvage logging after fire or insect outbreaks, thinning and other forest management prescriptions (e.g. shelterwood/seedtree harvest).<br>1 : MECHANICAL : Non-forest land where trees, shrubs or other vegetation has been mechanically severed or removed by chaining, scraping, brush sawing, bulldozing, or any other methods of non-forest vegetation removal.<br>1 : STRUCTURAL DECLINE : Land where trees or other woody vegetation is physically altered by unfavorable growing conditions brought on by non-anthropogenic or non-mechanical factors. This type of loss should generally create a trend in the spectral signal(s) (e.g. NDVI decreasing, Wetness decreasing; SWIR increasing; etc.) however the trend can be subtle. Structural decline occurs in woody vegetation environments, most likely from insects, disease, drought, acid rain, etc. Structural decline can include defoliation events that do not result in mortality such as in Gypsy moth and spruce budworm infestations which may recover within 1 or 2 years.<br>1 : SPECTRAL DECLINE : A plot where the spectral signal shows a trend in one or more of the spectral bands or indices (e.g. NDVI decreasing, Wetness decreasing; SWIR increasing; etc.). Examples include cases where: a) non-forest/non-woody vegetation shows a trend suggestive of decline (e.g. NDVI decreasing, Wetness decreasing; SWIR increasing; etc.), or b) where woody vegetation shows a decline trend which is not related to the loss of woody vegetation, such as when mature tree canopies close resulting in increased shadowing, when species composition changes from conifer to hardwood, or when a dry period (as opposed to stronger, more acute drought) causes an apparent decline in vigor, but no loss of woody material or leaf area.<br>1 : WIND/ICE : Land (regardless of use) where vegetation is altered by wind from hurricanes, tornados, storms and other severe weather events including freezing rain from ice storms.<br>1 : HYDROLOGY : Land where flooding has significantly altered woody cover or other Land cover elements regardless of land use (e.g. new mixtures of gravel and vegetation in and around streambeds after a flood).<br>1 : DEBRIS : Land (regardless of use) altered by natural material movement associated with landslides, avalanches, volcanos, debris flows, etc.<br>1 : OTHER : Land (regardless of use) where the spectral trend or other supporting evidence suggests a disturbance or change event has occurred but the definitive cause cannot be determined or the type of change fails to meet any of the change process categories defined above.</dd></dl></dd>"
            //slow loss
            const text9="<dt><h2>Slow Loss (Annual Product)</h2></dt><dd><dl><dt><h3>Product Description</h3></dt><dd>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It shows areas LCMS detected slow loss for each year. </dd><br><dd>Vegetative indices indicate a negative trend over time. Loss is not categorized explicitly in the training data, however, specific change process classifications are collected. The following describes the change processes, any of which could be present and are collectively considered slow loss.</dd><dd><dl><dt>Class Description:</dt><dd>1 indicates slow loss for each year (The only unmasked value).</dd></dl></dd></dl><dl><dt><h3>Product Class Definitions</h3></dt><dd>1 : STRUCTURAL DECLINE : Land where trees or other woody vegetation is physically altered by unfavorable growing conditions brought on by non-anthropogenic or non-mechanical factors. This type of loss should generally create a trend in the spectral signal(s) (e.g. NDVI decreasing, Wetness decreasing; SWIR increasing; etc.) however the trend can be subtle. Structural decline occurs in woody vegetation environments, most likely from insects, disease, drought, acid rain, etc. Structural decline can include defoliation events that do not result in mortality such as in Gypsy moth and spruce budworm infestations which may recover within 1 or 2 years.<br>1 : SPECTRAL DECLINE : A plot where the spectral signal shows a trend in one or more of the spectral bands or indices (e.g. NDVI decreasing, Wetness decreasing; SWIR increasing; etc.). Examples include cases where: a) non-forest/non-woody vegetation shows a trend suggestive of decline (e.g. NDVI decreasing, Wetness decreasing; SWIR increasing; etc.), or b) where woody vegetation shows a decline trend which is not related to the loss of woody vegetation, such as when mature tree canopies close resulting in increased shadowing, when species composition changes from conifer to hardwood, or when a dry period (as opposed to stronger, more acute drought) causes an apparent decline in vigor, but no loss of woody material or leaf area.</dd></dl></dd>"
            const text10 ="<dt><h2>Fast Loss (Annual Product)</h2></dt><dd><dl><dt><h3>Product Description</h3></dt><dd>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It shows areas LCMS detected fast loss for each year. </dd><br><dd>Vegetative indices indicate a negative trend over time. Loss is not categorized explicitly in the training data, however, specific change process classifications are collected. The following describes these change processes, any of which could be present and are collectively considered fast loss.</dd><dd><dl><dt>Class Description:</dt><dd>1 indicates fast loss for each year (The only unmasked value).</dd></dl></dd></dl><dl><dt><h3>Product Class Definitions</h3></dt><dd>1 : FIRE :  Land altered by fire, regardless of the cause of the ignition (natural or anthropogenic), severity, or land use.<br>1 : HARVEST : Forest land where trees, shrubs or other vegetation have been severed or removed by anthropogenic means. Examples include clearcutting, salvage logging after fire or insect outbreaks, thinning and other forest management prescriptions (e.g. shelterwood/seedtree harvest).<br>1 : MECHANICAL : Non-forest land where trees, shrubs or other vegetation has been mechanically severed or removed by chaining, scraping, brush sawing, bulldozing, or any other methods of non-forest vegetation removal.<br>1 : WIND/ICE : Land (regardless of use) where vegetation is altered by wind from hurricanes, tornados, storms and other severe weather events including freezing rain from ice storms.<br>1 : HYDROLOGY : Land where flooding has significantly altered woody cover or other Land cover elements regardless of land use (e.g. new mixtures of gravel and vegetation in and around streambeds after a flood).<br>1 : DEBRIS : Land (regardless of use) altered by natural material movement associated with landslides, avalanches, volcanos, debris flows, etc.<br>1 : OTHER : Land (regardless of use) where the spectral trend or other supporting evidence suggests a disturbance or change event has occurred but the definitive cause cannot be determined or the type of change fails to meet any of the change process categories defined above.</dd></dl></dd>"
            //gain
            const text11="<dt><h2>Gain (Annual Product)</h2></dt><dd><dl><dt><h3>Product Description</h3></dt><dd>This product is part of the Landscape Change Monitoring System (LCMS) data suite. It shows areas LCMS detected gain for each year. </dd><br><dd>Vegetative indices indicate a positive trend over time. Gain is categorized using one specific change process classification within the training data, described below.</dd><dd><dl><dt>Class Description:</dt><dd>1 indicates gain for each year (The only unmasked value).</dd></dl></dd></dl><dl><dt><h3>Product Class Definitions</h3></dt><dd>1 : GROWTH/RECOVERY : Land exhibiting an increase in vegetation cover due to growth and succession over one or more years. Applicable to any areas that may express spectral change associated with vegetation regrowth. In developed areas, growth can result from maturing vegetation and/or newly installed lawns and landscaping. In forests, growth includes vegetation growth from bare ground, as well as the over topping of intermediate and co-dominate trees and/or lower-lying grasses and shrubs. Growth/Recovery segments recorded following forest harvest will likely transition through different land cover classes as the forest regenerates. For these changes to be considered growth/recovery, spectral values should closely adhere to an increasing trend line (e.g. a positive slope that would, if extended to ~20 years, be on the order of .10 units of NDVI) which persists for several years.</dd></dl></dd>"
            const text12="NON-PROCESSING AREA MASK: Where no cloud or cloud shadow-free data are available to produce an output. <br><br>This is different from 'No Data:' No data is generally any area outside the study area and has a value that is ignored for all statistics. Non processing area mask pixels are inside the study area, but had no valid observations for that year."
            //const text13="<p><h2>Welcome to the LCMS Data Explorer for Region 10!</h2></p>            <p>LCMS is a landscape change detection program developed by the USDA Forest Service. This application is designed to provide a visualization of the Landscape Change products, related geospatial data, and provide a portal to download customized PDF reports.</p>      <p>To use this website, click on the menu button to the left of the LCMS Data Explorer title and follow the items in the dropdown menu. 1) Select your question of interest 2) Select your feature classes of interest (i.e., polygons used to summarize underlying LCMS data products) 3) Select the LCMS product you&rsquo;re interested in (information buttons next to each product will provide clarification) 4) Select the metrics to display on the graphs in the right panel 5) Using one of the selection tools under the Tools tab, pan around to select polygons. Two selection options are provided: select by rectangle and select by point. If using select by point, optionally hold down the CTRL key to select multiple polygons. *Note that you will need to move the cursor after unclicking the CTRL button in order to highlight the results.</p>   <p>NOTE: the graphs on the right will show statistics from the polygons visible in the view extent unless a selection is made. </p>"
            const text13=`<p style='margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:15px;'><strong><span style='font-family:"Roboto Condensed";'>Welcome to the LCMS Data Explorer for Region 10!</span></strong></p><p style='margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;'><span style='font-family:"Roboto Condensed";color:#343A40;'>LCMS is a landscape change detection program developed by the USDA Forest Service. This application is designed to provide a visualization of the Landscape Change products, related geospatial data, and provide a portal to download customized PDF reports.</span></p><p style='margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;'><span style='font-family:"Roboto Condensed";color:#343A40;'>To use this website, click on the menu button to the left of the LCMS Data Explorer title and follow the items in the dropdown menu.</span></p><ol style="list-style-type: undefined;"> <li><span style='font-family:"Roboto Condensed";color:#343A40;'>Select your question of interest</span></li><li><span style='font-family:"Roboto Condensed";color:#343A40;'>Select your feature classes of interest (i.e., polygons used to summarize underlying LCMS data products)</span></li> <li><span style='font-family:"Roboto Condensed";color:#343A40;'>Select the LCMS product you&rsquo;re interested in (information buttons next to each product will provide clarification)</span></li><li><span style='font-family:"Roboto Condensed";color:#343A40;'>Select the metrics to display on the graphs in the right panel</span></li> <li><span style='font-family:"Roboto Condensed";color:#343A40;'>Using one of the selection tools under the Tools tab, pan around to select polygons. Two selection options are provided: select by rectangle and select by point. If using select by point, optionally hold down the CTRL key to select multiple polygons. *Note that you will need to move the cursor after unclicking the CTRL button in order to highlight the results.&nbsp;</span></li></ol><p style='margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;'><span style='font-family:"Roboto Condensed";color:#343A40;'>NOTE: the graphs on the right will show statistics from the polygons visible in the view extent unless a selection is made. Refresh graphs to apply changes.&nbsp;</span></p><p style='margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;'><span style='font-family:"Roboto Condensed";'>&nbsp;</span></p>`
           


            const modal_html =`
            <div id="myModal1" class="modal">
            <div class="modal-content">
              <span id="close1" class="close" title="Close">&times;</span>
              <p>${text1}</p>
                </div>      
            </div>

            <div id="myModal2" class="modal">
            <div class="modal-content">
              <span id="close2" class="close" title="Close">&times;</span>
              <p>${text2}</p>
                </div>      
            </div>

            <div id="myModal3" class="modal">
            <div class="modal-content">
              <span id="close3" class="close" title="Close">&times;</span>
              <p>${text3}</p>
                </div>      
            </div>

            <div id="myModal4" class="modal">
            <div class="modal-content">
              <span id="close4" class="close" title="Close">&times;</span>
              <p>${text4}</p>
                </div>      
            </div>

            <div id="myModal5" class="modal">
            <div class="modal-content">
              <span id="close5" class="close" title="Close">&times;</span>
              <p>${text5}</p>
                </div>      
            </div>

            <div id="myModal6" class="modal">
            <div class="modal-content">
              <span id="close6" class="close" title="Close">&times;</span>
              <p>${text6}</p>
                </div>      
            </div>

            <div id="myModal7" class="modal">
            <div class="modal-content">
              <span id="close7" class="close" title="Close">&times;</span>
              <p>${text7}</p>
                </div>      
            </div>

            <div id="myModal8" class="modal">
            <div class="modal-content">
              <span id="close8" class="close" title="Close">&times;</span>
              <p>${text8}</p>
                </div>      
            </div>

            <div id="myModal9" class="modal">
            <div class="modal-content">
              <span id="close9" class="close" title="Close">&times;</span>
              <p>${text9}</p>
                </div>      
            </div>

            <div id="myModal10" class="modal">
            <div class="modal-content">
              <span id="close10" class="close" title="Close">&times;</span>
              <p>${text10}</p>
                </div>      
            </div>

            <div id="myModal11" class="modal">
            <div class="modal-content">
              <span id="close11" class="close" title="Close">&times;</span>
              <p>${text11}</p>
                </div>      
            </div>

            <div id="myModal12" class="modal">
            <div class="modal-content">
              <span id="close12" class="close" title="Close">&times;</span>
              <p>${text12}</p>
                </div>      
            </div>

            <div id="myModal_main" class="modal">
            <div class="modal-content">
              <span id="close_main" class="close" title="Close">&times;</span>
              <p>${text13}</p>
                </div>      
            </div>

            
          `

          $('#mainwrapperid').append(modal_html);
        },

        createInfoModalDict: function() {
            // Create a dictionary of imagery layers
            const infoModalDict = {
                'span_popup1': "myModal1",
                'span_popup2': "myModal2",
                'span_popup3': "myModal3",
                'span_popup4': "myModal4",
                'span_popup5': "myModal5",
                'span_popup6': "myModal6",
                'span_popup7': "myModal7",
                'span_popup8': "myModal8",
                'span_popup_change1': "myModal9",
                'span_popup_change2': "myModal10",
                'span_popup_change3': "myModal11",
                'span_popup_change4': "myModal12",
                'span_popup_main':"myModal_main"

            };
            const closeModalDict = {
                'span_popup1': "close1",
                'span_popup2': "close2",
                'span_popup3': "close3",
                'span_popup4': "close4",
                'span_popup5': "close5",
                'span_popup6': "close6",
                'span_popup7': "close7",
                'span_popup8': "close8",
                'span_popup_change1': "close9",
                'span_popup_change2': "close10",
                'span_popup_change3': "close11",
                'span_popup_change4': "close12",
                'span_popup_main': "close_main"

            };

            Object.keys(infoModalDict).forEach((k) => {
                
                var modal = document.getElementById(infoModalDict[k]);
               
                // Get the button that opens the modal
                var btn = document.getElementById(k);
                
                // Get the <span> element that closes the modal
                // var span = document.getElementsByClassName("close")[0];
                var span = document.getElementById(closeModalDict[k]);

                // When the user clicks the button, open the modal                 
                btn.onclick = function() {
                  modal.style.display = "block";
                }
                 
                // When the user clicks on <span> (x), close the modal
                span.onclick = function() {
                modal.style.display = "none";
                }

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
                }

            })


            // add main instructions modal that will popup on page load 

            var modal = document.getElementById('instructions_modal');  
            
            // Get the <span> element that closes the modal
            // var span = document.getElementsByClassName("close")[0];
            var span = document.getElementById("close_instructions");

            // When page loads, open the modal             
            modal.style.display="block";           
            

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
            modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
            }


            // return infoModalDict;
        }
    })
});