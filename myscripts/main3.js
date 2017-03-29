/* March 2017
 * Tommy Dang, Assistant professor, iDVL@TTU
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

var selectedCut = 1;

function setCut(){
    var selectedvalue = $('#sdropdown').val();
    if(selectedvalue==="optimized"){

    }else{
         selectedCut = +selectedvalue-1;
    }
    selectHistogram();
}

function selectHistogram(){
    for (var c=0; c<numCut;c++) {
        if (c==selectedCut){
            svg.selectAll(".histogram"+c).style("fill-opacity", 1)
                .style("stroke-opacity", 1);
            for (var m = 1; m < numMonth; m++) {
                var nodes = [];
                if (graphByMonths[m][c]!=undefined){
                    nodes= graphByMonths[m][c].nodes;
                }
                var links = [];
                if (graphByMonths[m][c]!=undefined){
                    links= graphByMonths[m][c].links;
                }
                updateSubLayout(nodes, links, m);
            }
        }
        else{
            svg.selectAll(".histogram"+c).style("fill-opacity", 0.1)
                .style("stroke-opacity", 0.3);
        }
    }
}

