/* March 2017
 * Tommy Dang, Assistant professor, iDVL@TTU
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

function selectHistogram(cut2){
    for (var c=0; c<numCut;c++) {
        if (c==cut2){
            svg.selectAll(".histogram"+c).style("fill-opacity", 1)
                .style("stroke-opacity", 1);
        }
        else{
            svg.selectAll(".histogram"+c).style("fill-opacity", 0.1)
                .style("stroke-opacity", 0.4);
        }
    }
}