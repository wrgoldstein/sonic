var width = 600,
    height = 300,
    speed_of_rocket = 8,
    speed_of_sound = 5,
    steps = 90,
    sound_origin_x = 0,

    max_radius = steps * speed_of_sound,
    sound_profile = [],
    sound_circle_radii = [0];

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
    .attr("height", height)
    .attr("id", "sonic-bg");

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

var offset_height = document.getElementById("sonic-bg").offsetHeight,
    offset_width = document.getElementById("sonic-bg").offsetWidth;

little_person.x = offset_width / 2
little_person.y = offset_height - 50

rocket.speed = 0

// d3.select(".littlePerson")
//     .attr("x", offset_width / 2)
//     .attr("y", offset_height - 50);


// SOUND CIRCLES
k = 0;

function update() {
        k++;
        // new sound circle
        any_null = sound_circle_radii.every(function(v) {
            return v === null;
        });
        console.log(any_null)
        if (k % 2 == 0 && !any_null) {
            sound_circle_radii.push(0);
        }
        // update circle radii
        for (i = 0; i < sound_circle_radii.length; i++) {
            sound_circle_radii[i] += speed_of_sound;
        }
        //update rocketship position
        sound_origin_x += speed_of_rocket;
        rocket.y = -sound_origin_x + -70;
        rocket.speed++;

        // enter the new circles
        var sound_circles = svg.selectAll("circle").data(sound_circle_radii);

        sound_circles.enter()
            .append("circle")
            .attr("cx", sound_origin_x + 22)
            .attr("cy", 45)
            .style("stroke", "black")
            .style("fill-opacity", 0);

        sound_circles.attr("r", function(d) {
            if (d == "NaN") {
                return null
            }
            return d;
        });


        function update_sound_profile() {
            // sound profile
            var little_person_x = document.getElementById("sonic-bg").offsetWidth / 2,
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
                }, 5);
            }
        })(0);
