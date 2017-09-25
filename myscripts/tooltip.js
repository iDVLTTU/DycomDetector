/* 2016 
 * Tuan Dang (on the BioLinker project, as Postdoc for EVL, UIC)
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

var tipWidth = 270;
var tipHeight = 470;
var tip_svg;
var y_svg;

var colorHighlight = "#fc8";
var buttonColor = "#ddd";
var timeDelay = 150;


var tip = d3.tip()
  .attr('class', 'd3-tip')
  .style('border', '1px solid #555');

function showTip(d) { 
  // Update network
  for (var i=0; i<allSVG.length;i++){
      var svg2 = allSVG[i];
      svg2.selectAll(".node5")
          //.transition().duration(timeDelay)
          .style("fill-opacity", function(d2){ return (d.name == d2.name) ? 1 : 0.2; })
          .style("stroke-opacity", function(d2){ return (d.name == d2.name) ? 1 : 0; }); 
      svg2.selectAll(".link5")
          //.transition().duration(timeDelay)
          .style("stroke-opacity", function(d2){
              return (d.name == d2.source.name || d.name == d2.target.name) ? 1 : 0.1;
             });   
      svg.selectAll(".textCloud3") 
        //.transition().duration(timeDelay)      
        .style("fill-opacity", function(d2){ return (d.name == d2.name) ? 1 : 0.1; });  
      svg.selectAll(".layer3")
        //.transition().duration(timeDelay)  
        .style("fill-opacity", function(d2){ return (d.name == d2.name) ? 0.8 : 0.08; })
        .style("stroke-opacity", function(d2){ return (d.name == d2.name) ? 1 : 0; });  
       
       var nameList = "";
       svg.selectAll(".linkArc3") 
        //.transition().duration(timeDelay)
          .style("stroke-opacity", function(d2){
            // Create list of name
            if (d.name == d2.source.name || d.name == d2.target.name) {
              if (nameList.indexOf(d2.source.name)<0)
                nameList+= "__"+d2.source.name;
              if (nameList.indexOf(d2.target.name)<0)
                nameList+= "_"+d2.target.name+"_";
            }
            return (d.name == d2.source.name || d.name == d2.target.name) ? 1 : 0.1;
           });   
      svg.selectAll(".nodeText3")  
        //.transition().duration(timeDelay)      
        .style("fill-opacity", function(d2){ return (nameList.indexOf("_"+d2.name+"_")>=0) ? 1 : 0.1; });  
  }
  tip.html(function(d) {
    var str ="";
    if (d.ref==undefined) { //  In the main View
      str+="<b> Node info: </b>"
      str+="<table border='0.5px'  style='width:100%'>"
      for (key in d) {
        if (key== "m"){
           //%%%%%%%%%
           str+=  "<tr><td>Month</td> <td>  <span style='color:black'>" +months[d[key]%12]+" "+ Math.round(minYear+d[key]/12)+ "</span> </td></tr>";
        }
        else if (key== "name"){
            str+=  "<tr><td>"+key+"</td> <td>  <span style='color:"+ getColor3(d.category)+"'>" + d[key] + "</span> </td></tr>"; 
        }
        else if (key== "x" || key== "y" || key== "px" || key== "py" || key== "category"|| key== "index" || 
          key== "isConnected" || key=="indexForTextClouds" || key=="monthly")
            ;// Do nothing
        else{
          var value = d[key];
          if (value==undefined)
            value = "?";
          str+=  "<tr><td>"+key+"</td> <td>  <span style='color:black'>" + value + "</span> </td></tr>";
        }     
      } 
      str+="</table>"
      return str;
    }
    debugger;
      
   });   
  tip.offset([100,200])
  tip.show(d);   
}    

function hideTip(d) { 
  // Update network
  for (var i=0; i<allSVG.length;i++){
      var svg2 = allSVG[i];
      svg2.selectAll(".node5")
          //.transition().duration(100)
          .style("fill-opacity", 1)
          .style("stroke-opacity", 1); 
      svg2.selectAll(".link5")
          //.transition().duration(100)
          .style("stroke-opacity", 0.6);   
  }
  svg.selectAll(".textCloud3")  
        //.transition().duration(100)       
        .style("fill-opacity", 1);    
  svg.selectAll(".layer3")  
        //.transition().duration(100)
        .style("fill-opacity", 0.3)
        .style("stroke-opacity", 1);  
  svg.selectAll(".linkArc3") 
        //.transition().duration(100)
        .style("stroke-opacity", 0.6);     
  svg.selectAll(".nodeText3")  
        //.transition().duration(timeDelay)      
        .style("fill-opacity", 1);       
  tip.hide();
}  



