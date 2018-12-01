var statesGlobal = [];
var selectedStateHM = [];
var selectedStates = 0;
var count=0;
var cheio=false;
var inter=false;
var indice=0;

var time_range = "2013";
function change_range(str) {
  time_range = "" + str + "";
  gen_vis();
}

gen_slider();
gen_vis();
gen_map();
gen_chord();
gen_summ();

function gen_slider() {
//*******************************************************************
//  CREATE SLIDER
//*******************************************************************
var formatDateIntoYear = d3v4.timeFormat("%Y");
var formatDate = d3v4.timeFormat("%b %Y");

var startDate = new Date("2013-01-01"),
    endDate = new Date("2018-01-01");

var margin = {top:30, right:50, bottom:0, left:50},
    width = 600 -margin.left,
    height = 60;
var svg = d3v4.select("#slider")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height);
var x = d3v4.scaleTime()
    .domain([startDate, endDate])
    .range([0, width])
    .clamp(true);
var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
  .call(d3v4.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { hue(x.invert(d3v4.event.x)); change_range((x.invert(d3v4.event.x)).getFullYear())}));

  slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 14 + ")")
  .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .style("fill","#f1f1f1")
    .style("font-weight", "bold")
    .text(function(d) { return formatDateIntoYear(d); });

  var label = slider.append("text")  
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .style("fill","#f1f1f1")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (-13) + ")")

  var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);


  function hue(h) {
    handle.attr("cx", x(h));
    label
      .attr("x", x(h))
      .text(formatDate(h));
    svg.style("background-color", d3v4.color("#393939"));
  }
}



function gen_vis() {
  while (document.getElementById("vis").firstChild) {
    document.getElementById("vis").removeChild(document.getElementById("vis").firstChild);
}
//**************************************************
//  CREATE CHOROPLETH
//**************************************************
  var width = 500;
  var height = 500;

    var lowColor = '#4169E1' //#228B22
    var highColor = '#DCDCDC'//#87CEFA #32CD32

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-5, 0])
        .html(function(d) {
          var dataRow = dataset.get(d.properties.name);          
             if (dataRow) {
                 return d.properties.name + ": " + dataRow;
             } else {
                //console.log("no dataRow", d);
                return d.properties.name + ": No data.";
             }
        })

    var svg = d3.select('.vis').append('svg')
        .attr('width', width)
        .attr('height', height);

    svg.call(tip);

    var projection = d3.geo.albersUsa()
      .translate([width/2, height/2]) // translate to center of screen
      .scale([580]); // scale things down so see entire US

    var path = d3.geo.path()
        .projection(projection);

    var colorScale = d3.scale.linear().range([lowColor, highColor]).interpolate(d3.interpolateLab);

      // we use queue because we have 2 data files to load.
    queue()
        .defer(d3.json, "data/usa.json")
        .defer(d3.csv, "data/process_count_usa.csv", joinStates)// process
        .await(loaded);

    var dataset = d3.map();

    function joinStates(d) {
    	if (d.year == time_range)
    	{
    		dataset.set(d.state, d.value);
    	}
    	
    	return d;
    }

      function getColor(d) {

      	var dataRow = dataset.get(d.properties.name);          
          if (dataRow) {
              return colorScale(dataRow);
          } else {
              //console.log("no dataRow", d);
              return "#ccc";
          }
      }

    function loaded(error, usa, flights) {

        colorScale.domain(d3.extent(flights, function(d) {return d.value;}));

        var states = topojson.feature(usa, usa.objects.units).features;

            var us = svg.selectAll('path.states')
            .data(states)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .attr('id', function(d) {
              return d.properties.name;
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr('fill', function(d,i) {
                return getColor(d);
            })
            .on('click', function(d,i) {
              if (count == 3) {
                return;
              } else {
                d3.select(this).style("stroke","orange").style("stroke-width","3px");
                count++;
              }
            });

            console.log(states[0]);

        if (inter) {
          if(count == 3) {
                cheio=true;
                ;
          }

          for (var i = 0; i < statesGlobal.length; i++) {
            console.log(statesGlobal[i]);
            d3.select('#'+ statesGlobal[i]).style("stroke","orange").style("stroke-width","3px");
          }
        }   

         // add a legend
        var w = 400, h = 20;

        var key = svg
          .append("svg")
          .attr("width", w+30)
          .attr("height", h)
          .attr("class", "legend")
          .attr("transform", "translate(20,400)");

        var legend = key.append("defs")
          .append("svg:linearGradient")
          .attr("id", "gradient")
          .attr("y1", "100%")
          .attr("x1", "0%")
          .attr("y2", "100%")
          .attr("x2", "50%")
          .attr("spreadMethod", "pad");

        legend.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", highColor)
          .attr("stop-opacity", 1);
            
        legend.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", lowColor)
          .attr("stop-opacity", 1);

        key.append("rect")
          .attr("width", w)
          .attr("height", h)
          .style("fill", "url(#gradient)")
          .attr("transform", "translate(0,0)");

        var x = d3.scale.linear()
          .range([0, w])
          .domain([0, 500000]);

        var xAxis = d3.svg.axis().scale(x);

        key.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0,0)")
          .call(xAxis);
    }
}


function gen_map() {
//************************************************
//  CREATE HEATMAP
//************************************************    

    var itemSize = 11,
          cellSize = itemSize - 1,
          margin = {top: 30, right: 20, bottom: 20, left: 75};
          
      var width_1 = 1100 - margin.right - margin.left,
          height_1 = 660 - margin.top - margin.bottom;

      d3.csv('data/process_count.csv', function ( response ) {

        var data = response.map(function( item ) {
            var newItem = {};
            newItem.year = item.x_year;
            newItem.state = item.y_state;
            newItem.count = item.value;

            return newItem;
        })

        var x_elements = d3.set(data.map(function( item ) { return item.year; } )).values(),
            y_elements = d3.set(data.map(function( item ) { return item.state; } )).values();

        var xScale = d3.scale.ordinal()
            .domain(x_elements)
            .rangeBands([0, x_elements.length * itemSize]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(function (d) {
                return d;
            }).orient("top");
             

        var yScale = d3.scale.ordinal()
            .domain(y_elements)
            .rangeBands([0, y_elements.length * itemSize]);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .tickFormat(function (d) {
                return d;
            }).orient("left");
         

        var colorScale = d3.scale.threshold()
            .domain([10000, 50000,100000, 250000, 500000])
            .range(["#DCDCDC","#99b3e6", "#4775d1","#2e5cb8", "#24478f", "#4169E1"]);

        var svg = d3.select('.heatmap')
            .append("svg")
            .attr("height", width_1 + margin.left + margin.right)
            .attr("width", 200 + margin.top)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var cells = svg.selectAll('rect')
            .data(data)
            .enter().append('g').append('rect')
            .attr('class', 'cell')
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('y', function(d) { return yScale(d.state); })
            .attr('x', function(d) { return xScale(d.year); })
            .attr("rx",3)
            .attr("rx",3)
            .attr('id', function(d) {
              return y_elements[yScale(d.state)/itemSize].trim();
            })
            .attr('fill', function(d) { return colorScale(d.count); })
            .on("click", clickHM);

            function clickHM(d) {

             if(count == 3) {
                cheio=true;
                ;
              }

              for (var i = 0; i < selectedStateHM.length; i++) {
                if (selectedStateHM[i] == (x_elements[xScale(d.year)/itemSize] + y_elements[yScale(d.state)/itemSize].trim())) {
                  d3.select(this).style("stroke","none");
                  delete selectedStateHM[i];
                  count--;
                  console.log(selectedStateHM);
                  cheio=false;
                  return 0;
                }
              }  

              if(cheio == true) {
                return;
              }

              selectedStateHM[selectedStates]=x_elements[xScale(d.year)/itemSize] + y_elements[yScale(d.state)/itemSize].trim();
              statesGlobal[selectedStates]=y_elements[yScale(d.state)/itemSize].trim();
              inter=true;
              d3.select(this).style("stroke","orange").style("stroke-width","3px");
              selectedStates++;
              count++;
              console.log(selectedStateHM);
              gen_vis();
            };
        
        // tooltip
        tooltip=d3.select("body").append("div").style("background","#A9A9A9")
        .style("opacity","1").style("position","absolute").style("visibility","hidden").style("box-shadow","0px 0px 6px #7861A5").style("padding","10px");
        
        toolval=tooltip.append("div");
        
        // selection of cells     
        cells.on("mouseover",function(d){
           d3.select(this).style("opacity","0.7");
       });

        //unselection of cells  
        cells.on("mouseout",function(){
            d3.select(this).style("opacity","1");
            tooltip.style("visibility","hidden");});

        cells.on("mousemove",function(d){
            tooltip.style("visibility","visible")
            .style("top",(d3.event.pageY-30)+"px").style("left",(d3.event.pageX+20)+"px");
            
            tooltip.select("div").html(d.year+" in "+d.state+ "- "+(+d.count) + " Flights").style("color", "white")
            
        });

        //LEGENDA

        var legends=svg.append("g").attr("class","legends")
        .attr("transform","translate("+((width_1 + margin.right)/2)+","+((height_1+margin.bottom)/5 )+ ")");

        legends.append("g").attr("class","rect")
        .attr("transform","translate(0,"+15+")")
        .selectAll("rect").data(colorScale.range()).enter()
        .append("rect").attr("width","70px").attr("height","15px").attr("fill",function(d){ return d})
        .attr("x",function(d,i){ return i*(70) });

        legends.append("g").attr("class","text")
        .attr("transform","translate(0,45)")
        .append("text")
        .attr("x",200)
        .style("text-anchor", "middle")
        .text("\xa0\xa0\xa0\xa0\xa0" + "0-10K" + "\xa0\xa0\xa0\xa0\xa0\xa0" + "10-50K" + "\xa0\xa0\xa0\xa0" + "50-100K" + "\xa0\xa0\xa0\xa0" + "100-250K" + "\xa0\xa0" + "250-500K" + "\xa0\xa0\xa0" +">500K");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll('text')
            .attr('font-weight', 'normal');

        svg.append("g")
            .attr("class", "x axis")
            .call(xAxis)
            .selectAll('text')
            .attr('font-weight', 'normal')
            .style("text-anchor", "start")
            .attr("dx", ".8em")
            .attr("dy", ".5em")
            .attr("transform", function (d) {
                return "rotate(-65)";
            });
      });
}

function gen_chord() {
//***************************************
//  CREATE CHORD
//****************************************

        d3.csv('data/chord_diagram_data2013.csv', function (error, data) {

      //var data1 = alasql('SELECT ORIGIN_STATE_NM, DEST_STATE_NM, SUM(TOTAL_FLIGHTS) AS TOTAL_FLIGHTS FROM ? GROUP BY ORIGIN_STATE_NM,DEST_STATE_NM',[data]);
      

      var mpr = chordMpr(data);
        mpr
          .addValuesToMap('ORIGIN_STATE_NM')
          .setFilter(function (row, a, b) {
            return (row.ORIGIN_STATE_NM === a.name && row.DEST_STATE_NM === b.name);
          })
          .setAccessor(function (recs, a, b) {
            if (!recs[0]) return 0;
            return +recs[0].TOTAL_FLIGHTS;
          });
        drawChords(mpr.getMatrix(), mpr.getMap());
      });
      //*******************************************************************
      //  DRAW THE CHORD DIAGRAM
      //*******************************************************************
       function drawChords (matrix, mmap) {
        var w = 550, h = 500, r1 = h / 2, r0 = r1 - 100;
        margin = {top: 10, right: 20, bottom: 10, left: 10};
        var fill = d3.scale.ordinal()
            .domain(d3.range(4))
            .range(["#DCDCDC", "#4775d1", "#4169E1", "#2e5cb8"]);
        var chord = d3.layout.chord()
            .padding(.02)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);
        var arc = d3.svg.arc()
            .innerRadius(r0)
            .outerRadius(r0 + 20);
        var svg = d3.select("#chord_d").append("svg:svg")
            //.attr("width", w)
            .attr("width", w)
            .attr("height", h)
          .append("svg:g")
            .attr("id", "circle")
            //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            .attr("transform", "translate(" + w/2 +"," + h/2+")");
            svg.append("circle")
                .attr("r", r0 + 20);
        var rdr = chordRdr(matrix, mmap);
        chord.matrix(matrix);
        var g = svg.selectAll("g.group")
            .data(chord.groups())
          .enter().append("svg:g")
            .attr("class", "group")
            .on("mouseover", mouseover)
            .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });
        g.append("svg:path")
            .style("stroke", "black")
            .style("fill", function(d) { return fill(d.index); })
            .attr("d", arc);
        g.append("svg:text")
            .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", ".35em")
            .style("font-family", "arial, helvetica, sans-serif")
            .style("font-size", "10px")
            .style("fill","#f1f1f1")
            .style("font-weight", "bold")
            .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
            .attr("transform", function(d) {
              return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                  + "translate(" + (r0 + 26) + ")"
                  + (d.angle > Math.PI ? "rotate(180)" : "");
            })
            .text(function(d) { return rdr(d).gname; });
          var chordPaths = svg.selectAll("path.chord")
                .data(chord.chords())
              .enter().append("svg:path")
                .attr("class", "chord")
                .style("stroke", function(d) { return d3.rgb(fill(d.target.index)).darker(); })
                .style("fill", function(d) { return fill(d.target.index); })
                .attr("d", d3.svg.chord().radius(r0))
                .on("mouseover", function (d) {
                  d3.select("#tooltip")
                    .style("visibility", "visible")
                    .html(chordTip(rdr(d)))
                    .style("top", function () { return (d3.event.pageY - 100)+"px"})
                    .style("left", function () { return (d3.event.pageX - 100)+"px";})
                })
                .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });
          function chordTip (d) {
            var p = d3.format(".2%"), q = d3.format(",.3r")
            return "Route Info:<br/>"
              + p(d.svalue/d.stotal) + " (" + q(d.svalue) + ") of "
              + d.sname + " flies to " + d.tname
              + (d.sname === d.tname ? "": ("<br/>while...<br/>"
              + p(d.tvalue/d.ttotal) + " (" + q(d.tvalue) + ") of "
              + d.tname + " flies to " + d.sname))
          }
          function groupTip (d) {
            var p = d3.format(".1%"), q = d3.format(",.3r")
            return "State Info:<br/>"
                + d.gname + " : " + q(d.gvalue) + "<br/>"
                + p(d.gvalue/d.mtotal) + " of Matrix Total (" + q(d.mtotal) + ")"
          }
          function mouseover(d, i) {
            d3.select("#tooltip")
              .style("visibility", "visible")
              .html(groupTip(rdr(d)))
              .style("top", function () { return (d3.event.pageY - 80)+"px"})
              .style("left", function () { return (d3.event.pageX - 130)+"px";})
            chordPaths.classed("fade", function(p) {
              return p.source.index != i
                  && p.target.index != i;
            });

          }
      }

}

function gen_summ() {
  // set the dimensions and margins of the graph
  var width = 960,
      height = 500;

  // parse the date / time
  var parseTime = d3.timeParse("%d-%b-%y");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the 1st line
  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

  // define the 2nd line
  var valueline2 = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.open); });

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("#summ")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform","translate(20,-20)");

  // Get the data
  d3.csv("data/data2.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.close = +d.close;
        d.open = +d.open;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) {
      return Math.max(d.close, d.open); })]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // Add the valueline2 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline2);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

  });

}