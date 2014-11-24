var offset_height = document.getElementById("sonic-bg").offsetHeight,
    offset_width = document.getElementById("sonic-bg").offsetWidth,
    stepsize = 5,
    steps = offset_width / stepsize;

(function() {
    p = document.getElementById("little_person")
    p.setAttribute("x", offset_width / 2)
    p.setAttribute("y", offset_height - 50);
})();


var margin = {
        top: 200,
        right: 50,
        bottom: 200,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.bottom - margin.top;

var x = d3.scale.linear()
    .domain([0, steps])
    .range([0, document.getElementById("sliderbox").offsetWidth])
    .clamp(true);

var brush = d3.svg.brush()
    .x(x)
    .extent([0, 0])
    .on("brush", brushed);

svg = d3.select("#sliderbox");

var rocketslider = svg.append("g")
    .attr("class", "rocketslider")
    .call(brush);

var handle = rocketslider.append("ellipse")
    .attr("class", "handle")
    .attr("id", "handle")
    .attr("rx", 10).attr("ry", 150);

// var handle = d3.select("#rocket");

sound = {
    init: function() {
        this.radii = new Array();
        this.pressures = new Array();
        for (i = 0; i < offset_width / stepsize; i++) {
            this.radii.push(i * stepsize);
            this.pressures.push()
        };
        // this.radii.reverse();
        // this.pressures.reverse();
    },

    update: function(state) {
        rocket.setAttribute("y", -state * stepsize)
        state_radii = this.radii.slice(0, state);
        circles = d3.select(".soundwaves")
            .selectAll("circle").data(state_radii.reverse());
        circles.exit().remove();
        circles.enter()
            .append("circle")
            .attr("cx", function(d, i) {
                return state * stepsize
            })
            .attr("cy", 45)
            .style("fill-opacity", 0)
            .style("stroke", "white")
            .style("stroke-width", 3);

        circles.attr("r", function(d) {
            if (d == "NaN") {
                return null
            }
            return d;
        }).attr("stroke-opacity", function(d) {
            return .5 - d / offset_width
        })
    }
}

sound.init();

function brushed() {
    var value = brush.extent()[0];

    if (d3.event.sourceEvent) { // not a programmatic event
        value = x.invert(d3.mouse(this)[0]);
        brush.extent([value, value]);
    }

    handle.attr("cx", x(value));
    sound.update(value);
}

function move(x) {
    pos = brush.extent()[0]
    right_edge = document.getElementById("sliderbox").offsetWidth;;
    if (x < 0 || x > right_edge) {
        var x = right_edge;
    }

    var duration = Math.abs(10 * (x - pos));


    rocketslider
        .call(brush.event)
        .transition()
        .duration(duration)
        .ease("linear")
        .call(brush.extent([x, x]))
        .call(brush.event);
}
