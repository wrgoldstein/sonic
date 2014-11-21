var width = 600,
    height = 300,
    speed_of_rocket = 8,
    speed_of_sound = 5,
    steps = 300,
    sound_origin_x = 0,

    max_radius = steps * speed_of_sound,
    sound_profile = [],
    sound_circle_radii = [];

var xscale = d3.scale.linear()
    .domain([0, steps])
    .range([0, width]);

var yscale = d3.scale.linear()
    .domain([0, 10]) // max sound 
    .range([0, -height + 10]);

var line = d3.svg.line()
    .x(function(d, i) {
        return xscale(i);
    })
    .y(function(d) {
        return yscale(d);
    });

// svg background
var svg = d3.select(".sonic-bg").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = d3.select(".graph-bg").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(20," + height + ")");

var path = g.append("path")
    .datum(sound_profile)
    .attr("d", line)
    .attr("class", "line")
    .style("stroke-width", 2);

var leader = g.append("circle")
    .datum(sound_profile)
    .attr("cx", 0)
    .attr("cy", height)
    .attr("r", 5)
    .style("fill", "red");

// ROCKETSHIP -- animate with CSS
var rocket = new Image(100, 100);
rocket.src = "rocket.png";
rocket.className = "rocket";

// div to hold rocket
var div = d3.select(".container").append("div")
    .attr("width", rocket.width)
    .attr("height", rocket.height)
    .attr("id", "rocketDiv")
    .style("position", "absolute")
    .style("top", "6px");

rocketDiv.appendChild(rocket);

// SOUND CIRCLES
ii = 0;

function update() {
    ii++;
    // new sound circle
    sound_circle_radii.push(0);

    // update circle radii
    for (i = 0; i < sound_circle_radii.length; i++) {
        sound_circle_radii[i] += speed_of_sound;
    };

    //update rocketship position
    sound_origin_x += speed_of_rocket;
    div.style("left", sound_origin_x);

    rocketDiv.style.left = sound_origin_x + "px";

    //enter the new circles
    var sound_circles = svg.selectAll("circle").data(sound_circle_radii);

    sound_circles.enter()
        .append("circle")
        .attr("cx", sound_origin_x + 22)
        .attr("cy", 45)
        .style("stroke", "black")
        .style("fill-opacity", 0);

    sound_circles.attr("r", function(d) {
        return d;
    });

    // sound profile
    var little_person_x = 300,
        little_person_height = 50,
        v_distance_to_rocket = 300 - little_person_height;

    function sound_pressure(radius, i) {
        var this_sound_origin_x = i * speed_of_rocket;
        x = this_sound_origin_x - little_person_x
        y = v_distance_to_rocket

        if (Math.abs(Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2)) - radius) < little_person_height) {
            return 2 / Math.pow(radius, .5)
        } else {
            return 0
        }
    };

    pressure = sound_circle_radii.map(sound_pressure).reduce(function(a, b) {
        return a + b
    });

    path.transition()
        .duration(500)
        .ease("linear")
        .attr("d", line);

    leader
        .attr("cx", xscale(ii))
        .attr("cy", yscale(pressure));
}

(function(count) {
    if (count < steps) {
        // call the function.
        update();

        // The currently executing function which is an anonymous function.
        var caller = arguments.callee;
        window.setTimeout(function() {
            // the caller and the count variables are
            // captured in a closure as they are defined
            // in the outside scope.
            caller(count + 1);
        }, 50);
    }
})(0);
