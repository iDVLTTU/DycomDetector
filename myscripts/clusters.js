/**
 * Created by vinhtngu on 3/10/17.
 */
function updateSubLayout(nodes,links) {
    var fill = d3.scale.category20();
    linkScale = d3.scale.linear()
        .range([0.5, 2])
        .domain(d3.extent(links, function (d) {
            return d.count;
        }))
    var groups = d3.nest()
        .key(function (d) {
            return d.community;
        })
        .entries(nodes);
    groups = groups.filter(function (d) {
        return d.values.length > 1;
    })
    var groupPath = function (d) {
        var fakePoints = [];
        if (d.values.length == 2) {
            //[dx, dy] is the direction vector of the line
            var dx = d.values[1].x - d.values[0].x;
            var dy = d.values[1].y - d.values[0].y;

            //scale it to something very small
            dx *= 0.00001;
            dy *= 0.00001;

            //orthogonal directions to a 2D vector [dx, dy] are [dy, -dx] and [-dy, dx]
            //take the midpoint [mx, my] of the line and translate it in both directions
            var mx = (d.values[0].x + d.values[1].x) * 0.5;
            var my = (d.values[0].y + d.values[1].y) * 0.5;
            fakePoints = [[mx + dy, my - dx],
                [mx - dy, my + dx]];
            //the two additional points will be sufficient for the convex hull algorithm
        }
        //do not forget to append the fakePoints to the input data
        return "M" +
            d3.geom.hull(d.values.map(function (i) {
                return [i.x, i.y];
            })
                .concat(fakePoints))
                .join("L")
            + "Z";
    }
    var groupFill = function (d, i) {
        return fill(+d.key);
    };
    var width=250,height=250;
    var svg = d3.select("body").append("svg").attr("width",width).attr("height",height);
    var force = d3.layout.force()
        .gravity(0.2)
        .distance(10)
        .charge(-100)
        .size([width, height]);
    force.nodes(nodes)
        .links(links)
        .start();
    var link = svg.selectAll(".link5")
        .data(links)
        .enter().append("line")
        .attr("class", "link5")
        .style("stroke","#777")
        .style("stroke-width", function (d) {
            return linkScale(d.count);
        });

    var node = svg.selectAll(".node5")
        .data(nodes)
        .enter().append("circle")
        .attr("r",4)
        .style("fill",function (d) {
            return fill(d.community);
        });

    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });


        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        svg.selectAll("path")
            .data(groups)
            .attr("d", groupPath)
            .enter().append("path", "circle")
            .style("fill", groupFill)
            .style("stroke", groupFill)
            .style("stroke-width", 40)
            .style("stroke-linejoin", "round")
            .style("opacity", .2)
            .attr("d", groupPath);

    });

}