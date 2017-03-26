var diameter = 1000,
    radius = diameter / 2,
    innerRadius = radius - 120;
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Add color legend
function drawColorLegend() {
      var xx = 6;
      var y1 = 20;
      var y2 = 34;
      var y3 = 48;
      var y4 = 62;
      var rr = 6;

      
      svg.append("circle")
        .attr("class", "nodeLegend")
        .attr("cx", xx)
        .attr("cy", y1)
        .attr("r", rr)
        .style("fill", "#00aa00");
      
      svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx+10)
        .attr("y", y1+1)
        .text("Person")
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .style("text-anchor", "left")
        .style("fill", "#00aa00");
   
      svg.append("circle")
        .attr("class", "nodeLegend")
        .attr("cx", xx)
        .attr("cy", y2)
        .attr("r", rr)
        .style("fill", "#cc0000");  

      svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx+10)
        .attr("y", y2+1)
        .text("Location")
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .style("text-anchor", "left")
        .style("fill", "#cc0000");  

       svg.append("circle")
        .attr("class", "nodeLegend")
        .attr("cx", xx)
        .attr("cy", y3)
        .attr("r", rr)
        .style("fill", "#0000cc");  

      svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx+10)
        .attr("y", y3+1)
        .text("Organization")
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .style("text-anchor", "left")
        .style("fill", "#0000cc");  
        
       svg.append("circle")
        .attr("class", "nodeLegend")
        .attr("cx", xx)
        .attr("cy", y4)
        .attr("r", rr)
        .style("fill", "#aaaa00");  

      svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx+10)
        .attr("y", y4+1)
        .text("Miscellaneous")
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .style("text-anchor", "left")
        .style("fill", "#aaaa00");     

      // number of input terms  
      svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx-6)
        .attr("y", y4+20)
        .text(numberInputTerms+" terms of "+ data.length +" blogs" )
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .style("text-anchor", "left")
        .style("fill", "#000000");       
}

function removeColorLegend() {
 svg.selectAll(".nodeLegend").remove();
}

function drawTimeLegend() {
  var listX=[];
  for (var i=minYear; i<maxYear;i++){
    for (var j=0; j<12;j++){
      var xx = xStep+xScale((i-minYear)*12+j);
      var obj = {};
      obj.x = xx;
      obj.year = i;
      listX.push(obj);
    }  
  }

  svg.selectAll(".timeLegendLine").data(listX)
    .enter().append("line")
      .attr("class", "timeLegendLine")
      .style("stroke", "000") 
      //.style("stroke-dasharray", "3, 1")
      .style("stroke-opacity", 1)
      .style("stroke-width", 0.3)
      .attr("x1", function(d){ return d.x; })
      .attr("x2", function(d){ return d.x; })
      .attr("y1", 0)
      .attr("y2", 1500);
  svg.selectAll(".timeLegendText").data(listX)
    .enter().append("text")
      .attr("class", "timeLegendText")
      .style("fill", "#000000")   
      .style("text-anchor","start")
      .style("text-shadow", "1px 1px 0 rgba(255, 255, 255, 0.6")
      .attr("x", function(d){ return d.x; })
      .attr("y", function(d,i) { 
        if (i%12==0)
          return height-7;
        else
          return height-15;   
      })
      .attr("dy", ".21em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "13px")
      .text(function(d,i) { 
        if (i%12==0)
          return d.year;
        else
          return months[i%12];  
      });     
}

function updateTimeLegend() {
  var listX=[];
  for (var i=minYear; i<maxYear;i++){
    for (var j=0; j<12;j++){
      var xx = xStep+xScale((i-minYear)*12+j);
      var obj = {};
      obj.x = xx;
      obj.year = i;
      listX.push(obj);
    }  
  }

  svg.selectAll(".timeLegendLine").data(listX).transition().duration(500)
      .style("stroke-dasharray",  function(d,i){ 
        if (!isLensing)
          return "1, 2";
        else  
          return i%12==0 ? "3, 1" : "1, 2"})
      .style("stroke-opacity", function(d,i){
        if (i%12==0)
          return 1;
        else {
          if (isLensing && lMonth-numLens<=i && i<=lMonth+numLens)
              return 1;
          else 
            return 0; 
        }
      }) 
      .attr("x1", function(d){return d.x; })
      .attr("x2", function(d){ return d.x; });
  svg.selectAll(".timeLegendText").data(listX).transition().duration(500)
      .style("fill-opacity", function(d,i){
        if (i%12==0)
          return 1;
        else {
          if (isLensing && lMonth-numLens<=i && i<=lMonth+numLens)
              return 1;
          else 
            return 0; 
        }
      }) 
      .attr("x", function(d,i){ 
        return d.x; });

  // Update force layouts
    for (var i=minYear; i<maxYear;i++){
        for (var j=0; j<12;j++){
            var m = (i-minYear)*12+j;
            var view = "0 0 "+forceSize+" "+forceSize;
            if (lMonth-numLens<=m && m<=lMonth+numLens)
                view = (forceSize*0.4) + " " + (forceSize*0.4)+ " " + (forceSize*0.2) +" "+ (forceSize*0.2);
            svg.selectAll(".force"+m).transition().duration(500)
                .attr("x", xStep-forceSize/2+xScale(m))
                .attr("viewBox",view);
        }
    }

}

function drawTimeBox(){  
  svg.append("rect")
    .attr("class", "timeBox")
    .style("fill", "#aaa")
    .style("fill-opacity", 0.2)
    .attr("x", xStep)
    .attr("y", height-25)
    .attr("width", XGAP_*numMonth)
    .attr("height", 20)
    .on("mouseout", function(){
      isLensing = false;
      coordinate = d3.mouse(this);
      lMonth = Math.floor((coordinate[0]-xStep)/XGAP_);

 //     updateTransition(500);

    })

    .on("mousemove", function(){
      isLensing = true;
      coordinate = d3.mouse(this);
      lMonth = Math.floor((coordinate[0]-xStep)/XGAP_);
      updateTransition(500);

    });
}  

function updateTimeBox(durationTime){  
  var maxY=0; 
  for (var i=0; i< nodes.length; i++) {
    if (nodes[i].y>maxY)
      maxY = nodes[i].y;
  }
  svg.selectAll(".timeBox").transition().duration(durationTime)
      .attr("y", maxY+15);
  svg.selectAll(".timeLegendText").transition().duration(durationTime)
    .style("fill-opacity", function(d,i){
        if (i%12==0)
          return 1;
        else {
          if (isLensing && lMonth-numLens<=i && i<=lMonth+numLens)
              return 1;
          else 
            return 0; 
        }
      }) 
    .attr("y", function(d,i) {
        return maxY+28;
    })
    .attr("x", function(d,i){ 
      return d.x; });

    // Recompute the timeArcs
    if (oldLmonth!=lMonth) {
        console.log("in util.js lMonth=" + lMonth);

        //if (oldLmonth>=0)
            drawgraph2(lMonth);
        oldLmonth = lMonth;
        //recompute3();   // This function is in main3.js
    }
}

var buttonLensingWidth =80;
var buttonheight =15;
var roundConner = 4;
var colorHighlight = "#fc8";
var buttonColor = "#ddd";

function drawLensingButton(){  
  svg.append('rect')
    .attr("class", "lensingRect")
    .attr("x", 1)
    .attr("y", 170)
    .attr("rx", roundConner)
    .attr("ry", roundConner)
    .attr("width", buttonLensingWidth)
    .attr("height", buttonheight)
    .style("stroke", "#000")
    .style("stroke-width", 0.1)
    .style("fill", buttonColor)
    .on('mouseover', function(d2){
      svg.selectAll(".lensingRect")
          .style("fill", colorHighlight);
    })
    .on('mouseout', function(d2){
      svg.selectAll(".lensingRect")
          .style("fill", buttonColor);
    })
    .on('click', turnLensing);         
  svg.append('text')
    .attr("class", "lensingText")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("x", buttonLensingWidth/2)
    .attr("y", 181)
    .text("Lensing")
    .style("text-anchor", "middle")
    .style("fill", "#000")
    .on('mouseover', function(d2){
        svg.selectAll(".lensingRect")
          .style("fill", colorHighlight);
    })
    .on('mouseout', function(d2){
        svg.selectAll(".lensingRect")
          .style("fill", buttonColor);
    })
    .on('click', turnLensing);
}
function turnLensing() {
  isLensing = !isLensing;
  svg.selectAll('.lensingRect')
    .style("stroke-width", function(){
      return isLensing ? 1 : 0.1;
    });
  svg.selectAll('.lensingText')
    .style("font-weight", function() { 
      return isLensing ? "bold" : "";
    });
   svg.append('rect')
    .attr("class", "lensingRect")
    .style("fill-opacity", 0)
    .attr("x", xStep)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .on('mousemove', function(){
      coordinate = d3.mouse(this);
      lMonth = Math.floor((coordinate[0]-xStep)/XGAP_);
      console.log(lMonth);
      updateTransition(500);
      updateTimeLegend();
    });
    updateTransition(500);
    updateTimeLegend(); 
}  

function getColor(category, count) {
  var minSat = 80;
  var maxSat = 180;
  var percent = count/maxCount[category];
  var sat = minSat+Math.round(percent*(maxSat-minSat));
 
  if (category=="person")
    return "rgb("+sat+", "+255+", "+sat+")" ; // leaf node
  else if (category=="location")
    return "rgb("+255+", "+sat+", "+sat+")" ; // leaf node
  else if (category=="organization")
    return "rgb("+sat+", "+sat+", "+255+")" ; // leaf node
  else if (category=="miscellaneous")
    return "rgb("+(215)+", "+(215)+", "+(sat)+")" ; // leaf node
  else
    return "#000000";
   
}

function colorFaded(d) {
  var minSat = 80;
  var maxSat = 230;
  var step = (maxSat-minSat)/maxDepth;
  var sat = Math.round(maxSat-d.depth*step);
 
  //console.log("maxDepth = "+maxDepth+"  sat="+sat+" d.depth = "+d.depth+" step="+step);
  return d._children ? "rgb("+sat+", "+sat+", "+sat+")"  // collapsed package
    : d.children ? "rgb("+sat+", "+sat+", "+sat+")" // expanded package
    : "#aaaacc"; // leaf node
}


function getBranchingAngle1(radius3, numChild) {
  if (numChild<=2){
    return Math.pow(radius3,2);
  }  
  else
    return Math.pow(radius3,1);
 } 

function getRadius(d) {
 // console.log("scaleCircle = "+scaleCircle +" scaleRadius="+scaleRadius);
return d._children ? scaleCircle*Math.pow(d.childCount1, scaleRadius)// collapsed package
      : d.children ? scaleCircle*Math.pow(d.childCount1, scaleRadius) // expanded package
      : scaleCircle;
     // : 1; // leaf node
}


function childCount1(level, n) {
    count = 0;
    if(n.children && n.children.length > 0) {
      count += n.children.length;
      n.children.forEach(function(d) {
        count += childCount1(level + 1, d);
      });
      n.childCount1 = count;
    }
    else{
       n.childCount1 = 0;
    }
    return count;
};



d3.select(self.frameElement).style("height", diameter + "px");



