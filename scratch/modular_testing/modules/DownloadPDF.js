
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "./CreateCustomFonts"
], function(
    declare,
    arrayUtils,
    CreateCustomFonts){

    return declare(null,{

        outputPDF: null,

        constructor: function(options){
            // specify class defaults

        },
        //Function to download a pdf report
        
        downloadPDF: function(results){  
            console.log('Downloading PDF');

            let outFilename = 'LCMS-Summaries'
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
            usdaLogo.src = "../../images/usda-logo-color.png";
            doc.addImage(usdaLogo, 'PNG', 5,4, 18,13)//, 15);
            var fsLogo = new Image();
            fsLogo.src = "../../images/usfslogo.png";
            doc.addImage(fsLogo, 'PNG', 27, 3, 14,15);//x,y,w,h            
            var lcmsLogo = new Image();
            lcmsLogo.src = "../../images/lcms-icon.png"

            //header text
            var currentY = 9;
            var widthPng = 36
            doc.setFontSize(18);
            doc.text(margin+widthPng,currentY, "Forest Service");//"Region 10");
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


            //add title/unit info
            var objectID =results.features[0].attributes["outID"];
            var forestDict = {'1':'Tongass National Forest', '2':'Chugach National Forest'}
            var forestName = forestDict[String(objectID)[0]] // ensure that fields are attributed with forest or just splice str(outID)[0]
            var unitName ='LTA' //update this when we get the real data to be dynamic with what type of data (only allow user to select multiply polygons within one laeyr?? e.g. only LTAs OR only watersheds.. not one LTA and one watershed)
            

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

            var lineHeight = doc.getLineHeight(question) / doc.internal.scaleFactor
            var lines = wrapQuestion.length  // splitted text is a string array
            var blockHeight = lines * lineHeight
            currentY+= blockHeight-18

            doc.setFontSize(16)
            doc.setTextColor(0,0,0);
            currentY+= blockHeight
            doc.text(margin, currentY, "The following areas are included in this summary:");
            doc.setFontSize(16)
            doc.setFont(undefined,'bold');
            var lineHeight = doc.getLineHeight("The following areas are included in this summary:") / doc.internal.scaleFactor
            var lines = 1//wrapQuestion.length  // splitted text is a string array
            var blockHeight = lines * lineHeight
            currentY+= blockHeight+1
            doc.setTextColor(3,74,48);//8,124,124)
            doc.text(margin*2, currentY, unitName + ' '+objectID+',') //
            currentY+=blockHeight
            doc.text(margin*2, currentY,forestName )     
            doc.setFont("Times",'Roman');       
            doc.setFontSize(12);
            doc.setTextColor(0,0,0);
            currentY+=blockHeight+3;
            var wrapParagraph = doc.splitTextToSize("This is a paragraph describing the question of interest. etc. etc. This is a paragraph describing the question of interest. etc. etc. This is a paragraph describing the question of interest. etc. etc. This is a paragraph describing the question of interest. etc. etc. This is a paragraph describing the question of interest. etc. etc. This is a paragraph describing the question of interest. etc. etc. This is a paragraph describing the question of interest. etc. etc.",180);
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
           

            doc.addImage(screenshotMap.src, 'png',  (w-chartW)/2, currentY, chartW, chartH );//,{compresion:'NONE'});
            
            //new page
            doc.addPage();

            //add graph
            currentY = margin;// currentY+ chartH + margin;
            chartW = w - margin*2;
            const canvas = document.getElementById("chart-canvas");
            chartHeight = canvas.height;
            chartWidth = canvas.width;
            aspectRatio = chartHeight/chartWidth;
            chartH = chartW*aspectRatio;

            doc.addImage(canvas.toDataURL("image/jpeg", 1.0), 'JPEG', margin, currentY, chartW, chartH ,{compresion:'NONE'});

            currentY = currentY+ chartH + 6;

            doc.text(margin, currentY, "Figure 1. LCMS Change by Year");

            currentY+=5
            //draw table
            // ultimately want a table with 
            var years = results.features[0].attributes["years"].split(",");
            var fastLoss = results.features[0].attributes["Change---Fast Loss"].split(",").map(f => parseFloat(f));
            var total = 0;
            for (var i=0; i<fastLoss.length; i++){
                total+=fastLoss[i]}
            var meanFastLoss = parseFloat(String(total/fastLoss.length).slice(0,8));
            var Region ="10"//results.features[0].attributes["REGION"];
            var Area = results.features[0].attributes["GIS_ACRES"]; //add AREA FIELD

            var head = [["ID","Forest", "Region", "Area (acres)", "Mean Fast Loss"]];
            var body = [[objectID, forestName, Region, Area, meanFastLoss]]; //will change this so that if user selects multiple polygons (???) theyll all populate in chart
            doc.autoTable({
                head:head,
                body:body,
                startY: currentY,
                margin:{horizontal:10},
                styles:{overflow:"linebreak"},
                theme:'striped',
                headStyles:{fillColor:[8,124,124]},
                alternateRowStyles:[181, 231, 221],
                tableLineColor:[8, 124, 124],//[0,0,0],//
                tableLineWidth:0.1,
                columnStyles:{1:{cellWidth:"wrap"}},             
            })
                // bodyStyles: { valign: "top" },
                // columnStyles: { email: { columnWidth: "wrap" } },
                // showHead: "everyPage",
                // didDrawPage: function (data) {
                //   // Header
                //   doc.setFontSize(16);
                //   doc.setTextColor("#161C22");
                //   doc.text("Table", data.settings.margin.left, 35);
                //   doc.text("Brand", 465, 34);
          
                //   // Footer
                //   let str = "" + doc.internal.getNumberOfPages();
                //   doc.setFontSize(10);
          
                //   // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                //   let pageSize = doc.internal.pageSize;
                //   let pageHeight = pageSize.height
                //     ? pageSize.height
                //     : pageSize.getHeight();
                //   doc.text("Footer text", data.settings.margin.left, pageHeight - 10);
                //   doc.text(575, 830, str);
                // }

            
            let finalY = doc.lastAutoTable.finalY; // The y position on the page
            doc.setFontSize(12)
            doc.text(margin, finalY+6, "Table 1. Summary of units analyzed")

            //add page numbers to bottom of each page
            var pageCount = doc.internal.getNumberOfPages();
            for (i=0; i< pageCount; i++){
                doc.setPage(i);
                let pageCurrent = String(doc.internal.getCurrentPageInfo().pageNumber);
                doc.setFontSize(12);
                doc.text(pageCurrent,w-margin-pageCurrent.length, h-margin);
            }


            doc.save(outFilename+'.pdf');
            //doc.printout();
            console.log('Finished Downloading PDF');
        }
    })
});