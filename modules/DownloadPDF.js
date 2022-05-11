var reportTemplate = {
    'null':{
        'executive_summary': ['Within the selected areas','a excecutive summary'],
        'lcms-intro':['LCMS is a remote sensing-based system for mapping and monitoring landscape change across the United States. LCMS provides a “best available” map of landscape change that leverages advances in time series-based change detection techniques, Landsat data availability, cloud-based computing power, and big data analysis methods.','LCMS produces annual maps depicting change (vegetation loss and vegetation gain), land cover, and land use from 1985 to present that can be used to assist with a wide range of land management applications. With the help of Regional and National Forest staffs we have identified many applications of LCMS data, including forest planning and revision, updating existing vegetation maps, assessing landscape conditions, supporting post-fire recovery, and meeting some broad-scale monitoring requirements.'],
        'lcms-data-product-descriptions':['Change is blah','Land Cover is blah','Land Use is blah'],
        'appendix':['See this for more info: some link']
    }


}

define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "esri/geometry/geometryEngine",
    "esri/geometry/Geometry",
    "esri/tasks/GeometryService",
    "./CreateCustomFonts",
    "./createTableForPDF"
], function(
    declare,
    arrayUtils,
    geometryEngine,
    Geometry,
    GeometryService,
    CreateCustomFonts,
    createTableForPDF){

    return declare(null,{

        outputPDF: null,

        constructor: function(options){
            // specify class defaults

        },
        //Function to download a pdf report

        getArea: function (polygon) {
            const geodesicArea = geometryEngine.geodesicArea(polygon, "square-kilometers");
            const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");
            return geodesicArea;  
            //measurements.innerHTML = "<b>Geodesic area</b>:  " + geodesicArea.toFixed(2) + " km\xB2" + " |   <b>Planar area</b>: " + planarArea.toFixed(2) + "  km\xB2";
          },
        
        downloadPDF: function(results){  
            console.log('Downloading PDF...');

            let outFilename = 'LCMS-Summaries'
            const radio_button_layer_name_dict = {
                "chugach-huc10-radio-wrapper": "Chugach National Forest HUC 10",
                "chugach-huc8-radio-wrapper": "Chugach National Forest HUC 8",
                "chugach-huc6-radio-wrapper": "Chugach National Forest HUC 6",
                "chugach-small-hex-radio-wrapper": "Chugach National Forest Small Hexagons",
                "chugach-med-hex-radio-wrapper": "Chugach National Forest Medium Hexagons",
                "chugach-lrg-hex-radio-wrapper": "Chugach National Forest Large Hexagons",
                "chugach-ecosection-radio-wrapper": "Chugach National Forest Ecosections",
                "chugach-lta-radio-wrapper": "Chugach National Forest Land Type Associations (LTAs)",
                "chugach-boundary-radio-wrapper": "Chugach National Forest Boundary",
                "tongass-huc10-radio-wrapper": "Tongass National Forest HUC 10",
                "tongass-huc8-radio-wrapper": "Tongass National Forest HUC 8",
                "tongass-huc6-radio-wrapper": "Tongass National Forest HUC 6",
                "tongass-small-hex-radio-wrapper": "Tongass National Forest Small Hexagons",
                "tongass-med-hex-radio-wrapper": "Tongass National Forest Medium Hexagons",
                "tongass-lrg-hex-radio-wrapper": "Tongass National Forest Large Hexagons",
                "tongass-ecosection-radio-wrapper": "Tongass National Forest Ecosections",
                "tongass-lta-radio-wrapper": "Tongass National Forest Land Type Associations (LTAs)",
              };

            // if($('#pdfFilename').val() !== ''){
            // outFilename = $('#pdfFilename').val() 
            // }          
            // Add area namess
            let doc = new jspdf.jsPDF('portrait');
            let h = doc.internal.pageSize.height;
            let w = doc.internal.pageSize.width;
            let margin = 10;
           
            // Robotofont class (contains text needed to read ttf files)
            const customFontClass = CreateCustomFonts({});            
            const robotoNormal = customFontClass.getRobotoNormal();
            const robotoBold = customFontClass.getRobotoBold();  
            const arialNormal = customFontClass.getArial();
            const arialBold = customFontClass.getArialBold();
            doc.addFileToVFS("RobotoCondensed-Regular-normal.ttf", robotoNormal);
            doc.addFont("RobotoCondensed-Regular-normal.ttf", "RobotoCondensed", "normal");
            doc.addFileToVFS("RobotoCondensed-Bold-normal.ttf", robotoBold);
            doc.addFont("RobotoCondensed-Bold-normal.ttf", "RobotoCondensed", "bold");
            doc.addFileToVFS("FontsFree-Net-arial-bold.ttf", arialBold);
            doc.addFont("FontsFree-Net-arial-bold.ttf", "Arial", "bold");
            doc.addFileToVFS("arial-normal.ttf", arialNormal);
            doc.addFont("arial-normal.ttf", "Arial", "normal");
                   
            doc.setFont('Arial','normal'); 

            //header 
            //header color block
            var fontSize = 12
            doc.setFontSize(fontSize);
            
            //header logo image
            var usdaLogo = new Image();
            usdaLogo.src = "./images/usda-logo-color.png";
            doc.addImage(usdaLogo, 'PNG', 5,4, 18,13)//, 15);
            var fsLogo = new Image();
            fsLogo.src = "./images/usfslogo.png";
            doc.addImage(fsLogo, 'PNG', 27, 3, 14,15);//x,y,w,h            
            var lcmsLogo = new Image();
            lcmsLogo.src = "./images/lcms-icon.png"

            //header text
            var currentY = 9;
            var widthPng = 36
            doc.setFontSize(18);
            doc.text(margin+widthPng,currentY, "Forest Service");
            doc.setFontSize(12);
            currentY+=7
            doc.text(margin+widthPng, currentY, "U.S. DEPARTMENT OF AGRICULTURE");
            currentY+=5

            
            doc.line(margin/2,currentY,w-margin/2,currentY)//x,y,w,h
            currentY+=5
            doc.text(margin/2,currentY,  "Geospatial Technology and Applications Center | April 2022");
            // doc.setFont(undefined,'bold');
            // doc.text(margin+widthPng+19, headerTextHeight, "LCMS");
            // doc.setFont(undefined,'normal');
            // doc.text(margin+ widthPng+ 32,headerTextHeight,'Report');
            
            currentY+=3

            doc.setFillColor(3,74,48);//169,209,142);
            //doc.setTextColor(8,124,124);
            doc.rect(0, currentY , 600, 20, 'F'); //x, y, w, h, style


           
            doc.setFontSize(22);
            doc.setTextColor(249,226,76);//0,0,0);
            doc.setFont(undefined,'bold');  
            currentY+=3;                    
            doc.addImage(lcmsLogo, 'PNG', margin/2, currentY, 13,13)//x,y,w,h
            currentY+=10;  
            doc.text(margin + 15, currentY, "LANDSCAPE CHANGE MONITORING SYSTEM");//x,y,text
            var lineHeight = doc.getLineHeight("LANDSCAPE CHANGE MONITORING SYSTEM") / doc.internal.scaleFactor
            var lines = 1//splittedText.length  // splitted text is a string array
            var blockHeight = lines * lineHeight            
            currentY+= blockHeight+10;
            doc.setFont(undefined,'normal');

            doc.setFontSize(26);
            doc.setFont(undefined,'normal')
            doc.setTextColor(0,0,0)//8,124,124)
            var question ="Is climate change affecting landscapes and ecosystems on National Forest system lands?"; //change to document.getElementById("options-dropdown").value;//
            var wrapQuestion= doc.splitTextToSize(question, 180);
            doc.text(margin, currentY, wrapQuestion);

            var lineHeight = 8//doc.getLineHeight(question) / doc.internal.scaleFactor
            var lines = wrapQuestion.length  // splitted text is a string array
            var blockHeight = lines * lineHeight
            currentY+= blockHeight-18

            //get attribute info
            // var objectID =results.features[0].attributes["outID"];
            // var forestDict = {'1':'Tongass National Forest', '2':'Chugach National Forest'}
            // var forestName = forestDict[String(objectID)[0]] // ensure that fields are attributed with forest or just splice str(outID)[0]
            // var unitName ='LTA' //update this when we get the real data to be dynamic with what type of data (only allow user to select multiply polygons within one laeyr?? e.g. only LTAs OR only watersheds.. not one LTA and one watershed)
            var objectID =11111//results.features[0].attributes["outID"];
            var forestDict = {'1':'Tongass National Forest', '2':'Chugach National Forest'}
            var forestName = forestDict[String(objectID)[0]] // ensure that fields are attributed with forest or just splice str(outID)[0]
            var unitName ='LTA' //update this when we get the real data to be dynamic with what type of data (only allow user to select multiply polygons within one laeyr?? e.g. only LTAs OR only watersheds.. not one LTA and one watershed)
            


            doc.setFontSize(16)
            doc.setTextColor(0,0,0);
            currentY+= blockHeight
            doc.text(margin, currentY, "The following areas are included in this summary:");
            
            //var lineHeight = doc.getLineHeight("The following areas are included in this summary:") / doc.internal.scaleFactor
            //console.log(lineHeight+" is line height");
            doc.setFontSize(16)
            doc.setFont(undefined,'bold');
            //var lines = 1//wrapQuestion.length  // splitted text is a string array
            //var blockHeight = lines * lineHeight
            currentY+= 7//blockHeight+1
            doc.setTextColor(3,74,48);//8,124,124)
            Object.keys(results).map((fc)=>{
                doc.text(margin*2, currentY, radio_button_layer_name_dict[fc]);//+ ' '+objectID+',') 
                currentY+=5
            });         
            
            doc.line(margin,currentY,w-margin,currentY)    
            currentY+=2;

            doc.setFontSize(16)
            doc.setTextColor(0,0,0);
            currentY+= blockHeight
            doc.text(margin, currentY, "Executive Summary:");

            // doc.text(margin*2, currentY,forestName )     
            doc.setFont("Times",'Roman');       
            doc.setFontSize(12);
            doc.setTextColor(0,0,0);
            currentY+=6//blockHeight+3;
            var wrapParagraph = doc.splitTextToSize(reportTemplate['null'].executive_summary.join('\n\n'),180);
            doc.text(margin, currentY, wrapParagraph);
            var lineHeight = doc.getLineHeight("The ") / doc.internal.scaleFactor
            var lines = wrapParagraph.length  // splitted text is a string array
            var blockHeight = lines * lineHeight
            currentY+= blockHeight
            //doc.setFontSize(5);
            // // doc.text(margin, margin*2, selectedAreaNameList.join(', '),{ maxWidth: doc.internal.pageSize.width-margin*2});
            // doc.addPage();

            // //Add charts
            currentY = currentY;
            let chartH = h - margin*2 - currentY;  //target height          

            
            const screenshotMap = document.getElementsByClassName(
                "js-screenshot-image"
              )[0];
            //console.log(screenshotMap.src+"is screenshot map")

            var chartHeight = screenshotMap.height;
            var chartWidth = screenshotMap.width;
            let aspectRatio = chartWidth/chartHeight;
            let chartW = chartH*aspectRatio;
            // if(currentY + chartH > h){
            //     doc.addPage();
            //     currentY = margin;
            // }
           

            doc.addImage(screenshotMap.src, 'png',  (w-chartW)/2, currentY, chartW, chartH);//,{compresion:'NONE'});


            var figNum = 1;
            var tableNum = 1

            //get list of checked questions
            checkedQs=[];
        
            
            //checkedQs.forEach((thisQ)=>{ // enter rest of code here})

            //dummy:
            thisQ="Default Question example";
            Object.keys(results).map((thisFC)=>{
                //iterate through different feature classes user has checked and add new pages for each

                //new page
                doc.addPage();

                //add question to top of page
                currentY=margin
                doc.setFontSize(16);
                doc.text(margin, currentY, thisQ);
                                  

                var objectID =results[thisFC].features[0].attributes["outID"];
                var forestDict = {'1':'Tongass National Forest', '2':'Chugach National Forest'}
                var forestName = forestDict[String(objectID)[0]] // ensure that fields are attributed with forest or just splice str(outID)[0]
                var unitName = radio_button_layer_name_dict[thisFC] //update this when we get the real data to be dynamic with what type of data (only allow user to select multiply polygons within one laeyr?? e.g. only LTAs OR only watersheds.. not one LTA and one watershed)
                doc.setFontSize(16)
                doc.setFont("Arial",'normal');       
                doc.setTextColor(0,0,0);
                currentY+=20//set to heigh of text!!!!!??**
                doc.text(margin, currentY, "The following feature class is included in this summary:");
                doc.setFontSize(16)
                doc.setFont(undefined,'bold');
                var lineHeight = doc.getLineHeight("The following feature class is included in this summary:") / doc.internal.scaleFactor
                var lines = 1//wrapQuestion.length  // splitted text is a string array
                var blockHeight = lines * lineHeight
                currentY+= blockHeight+1
                doc.setTextColor(3,74,48);//8,124,124)
                doc.text(margin*2, currentY, unitName )//+ ' '+objectID+',') //
                // currentY+=blockHeight
                // doc.text(margin*2, currentY,forestName )     
                doc.setFont("Times",'Roman');       
                doc.setFontSize(12);
                doc.setTextColor(0,0,0);

                currentY+=5
                
                var tableClass = createTableForPDF({});
                var thisTable = tableClass.createTable(results, thisFC, currentY)
                doc.autoTable(thisTable)
                currentY = doc.lastAutoTable.finalY +6// + 4*results[thisFC].features.length; // The y position on the page
                doc.setFontSize(12)
                doc.text(margin,currentY , "Table "+String(tableNum)+". Summary of units analyzed")
                tableNum+=1

                //add graph
                //current error: background on whichever chart is first is black
                currentY +=5;// currentY+ chartH + margin;
                chartW = w - margin*2;

                ////////////////////////////////////// Add 1st Figure /////////////////////////////////
                
                
                const canvas0 = document.getElementById("chart-canvas-Change-"+thisFC); //should work if thisFC= something like: chugach-lrg-hex-radio-wrapper
                const legend_div= document.getElementById("chart-canvas-Change-"+thisFC+"-js-legend");
                
                chartHeight = canvas0.height;
                chartWidth = canvas0.width;
                aspectRatio = chartHeight/chartWidth;
                chartH = chartW*aspectRatio;

                // doc.setFillColor(204,204,204,0);
                // doc.rect(margin,currentY,chartW, chartH)

                //for some reason changing this first chart to a png (not jpeg) fixes issue with black chart background
                doc.addImage(canvas0.toDataURL("image/png", 1.0), 'PNG', margin, currentY, chartW, chartH ,{compresion:'NONE'});
                
                // doc.addImage(legend_div.toDataURL("image1/png", 1.0), 'PNG', margin, currentY, chartW, legendH ,{compresion:'NONE'});
                // doc.addHTML($('#js-legend')[0], currentY,chartW,legendH)
                // html2canvas(document.querySelector(`#chart-canvas-Change-${thisFC}-js-legend`)).then(canvas => {
                //     // document.body.appendChild(canvas)
                //     // document.createElement("test_legend");
                //     legend_div.appendChild(canvas)
                //     canvas.id="change-legend-canvas";
                //     // legendHeight=canvas.height;
                //     // legendWidth = canvas.width;
                //     // console.log("LEGNED heihgt:"+legendHeight);
                // });
                currentY = currentY+ chartH ;//+ 6;
                

                var legendAspectRatio = legendHeight/legendWidth;
                var legendH = chartW*legendAspectRatio;

                // get legend CANVAS element
                const legend_canvas_1 = document.getElementById("chart-canvas-Change-"+thisFC+"-legend-canvas");
                // get legend height and width of legend div
                var legendHeight = legend_canvas_1.height;
                var legendWidth = legend_canvas_1.width;
                var legendAspectRatio = legendHeight/legendWidth;
                var legendH = chartW*legendAspectRatio;
                console.log(legend_canvas_1);
                //add legend canvas to document
                doc.addImage(legend_canvas_1.toDataURL("image1/jpeg", 1.0), 'JPEG', margin, currentY, chartW, legendH,{compresion:'NONE'});
                

                currentY+=legendH +6;
                console.log(currentY+" is currnt")
                doc.text(margin, currentY, "Figure "+String(figNum)+". LCMS Change By Year");//fig1

                ////////////////////////////////////// Add 2nd Figure /////////////////////////////////                

                var addPageAfterChart2=false
                if (currentY+margin >h){//threshold that should mean overflow of chart creates new page
                    doc.addPage();
                    currentY = 5
                    addPageAfterChart2=true //whether to add page break bw charts 1/2 or 2/3 (false = add break between chart 2 and 3)
                }

                figNum+=1 //add figure number
                if (addPageAfterChart2){
                    currentY+=6
                }else{
                    doc.addPage(); //if page isn't added after first chart, add it after next chart
                    currentY = margin;//currentY+ chartH + 6;
                }
                // get canvas element of 2nd chart
                const canvas2 = document.getElementById("chart-canvas-Land_Cover-"+thisFC);
                //add canvas of graph to pdf doc
                doc.addImage(canvas2.toDataURL("image2/jpeg", 1.0), 'JPEG', margin, currentY, chartW, chartH ,{compresion:'NONE'});
                
                // get legend div 
                const legend_div2= document.getElementById("chart-canvas-Land_Cover-"+thisFC+"-js-legend");
                
                // // convert legend_div2 to canvas element and set id (only canvas elements can be added as image to pdf)
                // html2canvas(document.querySelector(`#chart-canvas-Land_Cover-${thisFC}-js-legend`)).then(canvas => {                    
                //     legend_div2.appendChild(canvas);
                //     canvas.id="land_cover-legend-canvas";
                // });

                
                // track Y position on document (add height of chart and additional 6 to provide buffer)
                currentY = currentY+ chartH// + 6;
                // get legend CANVAS element
                const legend_canvas_2 = document.getElementById("chart-canvas-Land_Cover-"+thisFC+"-legend-canvas");
                // get legend height and width of legend div
                var legendHeight2 = legend_canvas_2.height;
                var legendAspectRatio2 = legendHeight2/legendWidth;
                var legendH2 = chartW*legendAspectRatio2;
                console.log(legend_canvas_2);
                //add legend canvas to document
                doc.addImage(legend_canvas_2.toDataURL("image3/jpeg", 1.0), 'JPEG', margin, currentY, chartW, legendH2 ,{compresion:'NONE'});
                // add height of legend to Y tracking of page
                currentY+=legendH2+6;
                
                doc.text(margin, currentY, "Figure "+String(figNum)+". Land Cover Distribution Change Over Time");//fig 2
                figNum+=1;
                ////////////////////////////////////// Add 3rd Figure /////////////////////////////////
                
                 if (addPageAfterChart2){
                    doc.addPage();
                    currentY = margin;//currentY+ chartH + 6;
                }else{
                    currentY +=6
                }
                const canvas3 = document.getElementById("chart-canvas-Land_Use-"+thisFC);//chart-change-div");//"chart-canvas");
                doc.addImage(canvas3.toDataURL("image4/jpeg", 1.0), 'JPEG', margin, currentY, chartW, chartH ,{compresion:'NONE'});
                const legend_div3 = document.getElementById("chart-canvas-Land_Use-"+thisFC+"-js-legend");
                const legend_canvas_3 = document.getElementById("chart-canvas-Land_Use-"+thisFC+"-legend-canvas");
               
                var legendHeight3 = legend_canvas_3.height;

                // html2canvas(document.querySelector(`#chart-canvas-Land_Use-${thisFC}-js-legend`)).then(canvas => {                    
                //     legend_div3.appendChild(canvas);
                //     canvas.id="land_use-legend-canvas";
                // });
                var legendAspectRatio3 = legendHeight3/legendWidth;
                var legendH3 = chartW*legendAspectRatio3;
                currentY = currentY+ chartH;// + 6;
                 doc.addImage(legend_canvas_3.toDataURL("image5/jpeg", 1.0), 'JPEG', margin, currentY, chartW, legendH3 ,{compresion:'NONE'});
                
                currentY+=legendH3+6;
               
                doc.text(margin, currentY, "Figure "+String(figNum)+". Change in Area of Different Land Use Types Over Time");
               

                figNum+=1;
                
                

                
            });

            //add page numbers to bottom of each page
            var pageCount = doc.internal.getNumberOfPages();
            for (i=0; i< pageCount; i++){
                doc.setPage(i);
                let pageCurrent = String(doc.internal.getCurrentPageInfo().pageNumber);
                doc.setFontSize(12);
                doc.text(pageCurrent,w-margin-pageCurrent.length, h-margin);
            }
            console.log(pageCount+" is pg cnt")
            console.log(`output pdf ${outFilename}`)


            doc.save(outFilename+'.pdf');//,{returnPromise:true}).then(alert('PDF render all done!'));
            //doc.printout();
            console.log('Finished Downloading PDF');
        }
    })
});