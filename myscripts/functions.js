/**
 * Created by vinhtngu on 3/29/17.
 */

function get_bestCut(graph) {
 var temp = JSON.parse(JSON.stringify(graph));
 var cutArray =[];
    temp.forEach(function (d,i) {
        if(d!==null){
            if(d.length==0){
                cutArray[i]='NaN';
            }else{
                cutArray[i]=d.sort(function (a,b) {
                    return b.Qmodularity - a.Qmodularity
                })[0].cutoff;
            }
        }


 })
return cutArray;
}
function calculate_betweenness_centrality(graph) {
    var adjlist = create_adjacencylist(graph);
    var betweenness = betweenness_centrality(adjlist);
    return betweenness;

}