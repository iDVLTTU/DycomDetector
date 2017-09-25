/* September 2017 
 * Tommy Dang, Assistant professor, iDVL@TTU
 * Long Nguyen, PhD student, iDVL@TTU
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

var margin = {top: 0, right: 0, bottom: 5, left: 0};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 50 - margin.top - margin.bottom;


//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", 1400);
svg.call(tip);  

var personTerms;
var locTerms;
var misTerms;
var orgTerms;

var data, data2;
var minYear;
var maxYear;
var numMonth;


var nodes;
var numNode;

var link;
var linkArcs;
var termArray, termArray2, termArray3;
var relationship;
var termMax=0;
var terms;
var xStep = 170;
var yScale;
var linkScale;
var searchTerm = "";

var nodeY_byName = {};

var isLensing = false;
var lensingMul = 7;
var lMonth = -lensingMul * 2;
var oldLmonth = -1000; // use this variable to compare if we are lensing over a different month

var coordinate = [0, 0];
var XGAP_; // gap between months on xAxis
var numLens = 3;

function xScale(m) {
    if (isLensing) {
        var maxM = Math.max(0, lMonth - numLens - 1);
        var numMonthInLense = (lMonth + numLens - maxM + 1);

        //compute the new xGap
        var total = numMonth + numMonthInLense * (lensingMul - 1);
        var xGap = (XGAP_ * numMonth) / total;

        if (m < lMonth - numLens)
            return m * xGap;
        else if (m > lMonth + numLens) {
            return maxM * xGap + numMonthInLense * xGap * lensingMul + (m - (lMonth + numLens + 1)) * xGap;
        }
        else {
            return maxM * xGap + (m - maxM) * xGap * lensingMul;
        }
    }
    else {
        return m * XGAP_;
    }
}



var area = d3.svg.area()
    .interpolate("basic")
    .x(function (d) {
        return xStep + xScale(d.monthId);
    })
    .y0(function (d) {
        return d.yNode - yScale(d.value);
    })
    .y1(function (d) {
        return d.yNode + yScale(d.value);
    });

var optArray = [];   // FOR search box

var listMonth;



// Replacing the silder value ******************
var valueSlider =5;
    
//var query =  "http://127.0.0.1:1337/status?userID=pakistan";
// new Promise(function(resolve) {
//  d3.json(query, function(d) { 
   // debugger;
//    resolve(d) })
//});

var categories = ["person","location","organization","miscellaneous"];
var getColor3 = d3.scale.category10();  // Colors of categories
for (var cate=0; cate<categories.length;cate++){ // This loop makes sure person is Blue ...
    var category = categories[cate];
    getColor3(category);
}    

// d3.tsv("data/americablog.tsv", function (error, data_) {
// d3.tsv("data/crooks_and_liars.tsv", function (error, data_) {
// d3.tsv("data/emptywheel.tsv", function (error, data_) {
// d3.tsv("data/esquire.tsv", function (error, data_) {
 d3.tsv("data/factcheck.tsv", function (error, data_) {
// d3.tsv("data/glenngreenwald.tsv", function (error, data_) {
//d3.tsv("data/huffington.tsv", function (error, data_) {
//d3.tsv("data/propublica.tsv", function (error, data_) {
//d3.tsv("data/wikinews.tsv", function (error, data_) {
    if (error) throw error;
    data = data_;

    terms = new Object();
    minYear = 9999;
    maxYear = 0;
    data.forEach(function (d) {
        d.source = d["source"];
        // Process date
        var curDate = Date.parse(d["time"]);
        d.date = new Date(d["time"]);
        var year = d.date.getFullYear();
        // Compute min and max years from the data
        if (year<minYear)
            minYear = year;
        if (year>maxYear)
            maxYear = year;
        var m = 12 * year + d.date.getMonth();
        d.m = m;
        
    });
    // Update months
    numMonth = 12*(maxYear - minYear);
    XGAP_ = (width-xStep)/numMonth; // gap between months on xAxis
    data.forEach(function (d) {
        d.m = d.m-12*minYear;
        for (var cate=0; cate<categories.length;cate++){
            var category = categories[cate];
            if (d[category]!="" &&  d[category] != 1) {
                var list = d[category].split("|");
                for (var i = 0; i < list.length; i++) {
                    var term = list[i];
                    d[term] = 1;
                    if (!terms[term]) {
                        terms[term] = new Object();
                        terms[term].max = 0;
                        terms[term].maxMonth = -100;   // initialized negative
                        terms[term].category = category;
                    }
                    if (!terms[term][d.m])
                        terms[term][d.m] = 1;
                    else {
                        terms[term][d.m]++;
                        if (terms[term][d.m] > terms[term].max) {
                            terms[term].max = terms[term][d.m];
                            terms[term].maxMonth = d.m;
                        }
                    }
                }
            }
        }
    });    
    
    readTermsAndRelationships();
    console.log("DONE computing relationshipMax=" + relationshipMax);

    
    drawColorLegend();
    drawTimeLegend();

    drawTimeBox(); // This box is for brushing
    drawControlPanel();


    // 2017. this function is main2.js
    computeMonthlyGraphs();

    updateTransition();

    for (var i = 0; i < termArray.length / 10; i++) {
        optArray.push(termArray[i].term);
    }
    optArray = optArray.sort();
    $(function () {
        $("#search").autocomplete({
            source: optArray
        });
    });
});

function recompute() {
    var bar = document.getElementById('progBar'),
        fallback = document.getElementById('downloadProgress'),
        loaded = 0;

    var load = function () {
        loaded += 1;
        bar.value = loaded;

        /* The below will be visible if the progress tag is not supported */
        $(fallback).empty().append("HTML5 progress tag not supported: ");
        $('#progUpdate').empty().append(loaded + "% loaded");

        if (loaded == 100) {
            clearInterval(beginLoad);
            $('#progUpdate').empty().append("Complete");
        }
    };
}

function readTermsAndRelationships() {
    data2 = data.filter(function (d, i) {
        if (!searchTerm || searchTerm == "") {
            return d;
        }
        else if (d[searchTerm])  // data2 contain the row which contains searched term
            return d;
    });

    var selected = {}
    if (searchTerm && searchTerm != "") {
        data2.forEach(function (d) {
            for (var term1 in d) {
                if (!selected[term1])
                    selected[term1] = {};
                else {
                    if (!selected[term1].isSelected)
                        selected[term1].isSelected = 1;
                    else
                        selected[term1].isSelected++;
                }
            }
        });
    }

    var removeList = {};   // remove list **************
    removeList["source"] = 1;
    removeList["person"] = 1;
    removeList["location"] = 1;
    removeList["organization"] = 1;
    removeList["miscellaneous"] = 1;

    removeList["muckreads weekly deadly force"] = 1
    removeList["propublica"] = 1;
    removeList["white this alabama judge has figured out how"] = 1;
    removeList["dea ’s facebook impersonato"] = 1;
    removeList["dismantle roe"] = 1;
    removeList["huffington post"] = 1;

    termArray = [];
    for (var att in terms) {
        var e = {};
        e.term = att;
        if (removeList[e.term] || (searchTerm && searchTerm != "" && !selected[e.term])) // remove list **************
            continue;

        var maxNet = 0;
        var maxMonth = -1;
        for (var m = 1; m < numMonth; m++) {
            if (terms[att][m]) {
                var previous = 0;
                if (terms[att][m - 1])
                    previous = terms[att][m - 1];
                var net = (terms[att][m] + 1) / (previous + 1);
                if (net > maxNet) {
                    maxNet = net;
                    maxMonth = m;
                }
            }
        }
        e.max = maxNet;
        e.maxMonth = maxMonth;
        e.category = terms[att].category;

        if (e.term == searchTerm) {
            e.max = 10000;
            e.isSearchTerm = 1;
        }
        else if (searchTerm && searchTerm != "" && selected[e.term] && selected[e.term].isSelected) {
            e.max = 5000 + selected[e.term].isSelected;
        }

        if (e.max > 2 && e.term.length>2)    // Only get terms with some increase ************** with TEXT
            termArray.push(e);
    }
    termArray.sort(function (a, b) {
        if (a.max < b.max) {
            return 1;
        }
        if (a.max > b.max) {
            return -1;
        }
        return 0;
    });

    // Compute relationship **********************************************************
    numNode = Math.min(topNumber, termArray.length);
    for (var i=0; i<numNode;i++){
       top200terms[termArray[i].term] = termArray[i];  // top200terms is defined in main2.js
    }

    // compute the term frequency
    termMax = 0;
    for (var i = 0; i < numNode; i++) {
        for (var m = 0; m < numMonth; m++) {
            var mon = new Object();
            if (terms[termArray[i].term][m]) {
                mon.value = terms[termArray[i].term][m];
                if (mon.value > termMax)
                    termMax = mon.value;
            }
        }
    }
    
    relationship ={};
    relationshipMax =0;
    data2.forEach(function(d) { 
        var m = d.m;
        for (var term1 in d) {
            if (top200terms[term1]){   // if the term is in the selected 100 terms
                for (var term2 in d) {
                    if (top200terms[term2]){   // if the term is in the selected 100 terms
                        if (!relationship[term1+"__"+term2]){
                            relationship[term1+"__"+term2] = new Object();
                            relationship[term1+"__"+term2].max = 1;
                            relationship[term1+"__"+term2].maxMonth =m;
                        }    
                        if (!relationship[term1+"__"+term2][m])
                            relationship[term1+"__"+term2][m] = 1;
                        else{
                            relationship[term1+"__"+term2][m]++;
                            if (relationship[term1+"__"+term2][m]>relationship[term1+"__"+term2].max){
                                relationship[term1+"__"+term2].max = relationship[term1+"__"+term2][m];
                                relationship[term1+"__"+term2].maxMonth =m;  
                                if (relationship[term1+"__"+term2].max>relationshipMax) // max over time
                                    relationshipMax = relationship[term1+"__"+term2].max;
                            }  
                        }    
                    }
                }
            }
        }
    });
}


$('#btnUpload').click(function () {
    var bar = document.getElementById('progBar'),
        fallback = document.getElementById('downloadProgress'),
        loaded = 0;

    var load = function () {
        loaded += 1;
        bar.value = loaded;

        /* The below will be visible if the progress tag is not supported */
        $(fallback).empty().append("HTML5 progress tag not supported: ");
        $('#progUpdate').empty().append(loaded + "% loaded");

        if (loaded == 100) {
            clearInterval(beginLoad);
            $('#progUpdate').empty().append("Upload Complete");
            console.log('Load was performed.');
        }
    };

    var beginLoad = setInterval(function () {
        load();
    }, 50);

});


function searchNode() {
    searchTerm = document.getElementById('search').value;
    valueSlider = 2;
    handle.attr("cx", xScaleSlider(valueSlider));

    recompute();
}


function updateTransition() {
    updateTimeLegend();
    updateTimeBox();
}