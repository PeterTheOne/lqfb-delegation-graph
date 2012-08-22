$(function() {
    var gLoop;
    var members = [];
    var delegations = [];

    var radius = 10;
    var FPS = 60;
    var width = 1000;
    var height = 800;

    init();

    function gameloop() {
        setInterval(function() {
            update();
            draw();
        }, 1000 / FPS);
    }

    function init() {
        $.getJSON('http://apitest.liquidfeedback.org:25520/member?limit=300', function(data) {
            $.each(data.result, function(key, val) {
                var member = {
                    id: key,
                    name: val.name,
                    delegationCount: 0,
                    size: radius,
                    x: Math.random() * width,
                    y: Math.random() * height,
                    velocityX: 0,
                    velocityY: 0
                };
                members[key] = member;
            });
            $.getJSON('http://apitest.liquidfeedback.org:25520/delegation?scope=unit&unit_id=1', function(data) {
                $.each(data.result, function(key, value) {
                    var delegation = {
                        truster_id: value.truster_id,
                        trustee_id: value.trustee_id
                    };
                    delegations.push(delegation);

                    if (typeof members[value.truster_id] != 'undefined' &&
                        typeof members[value.trustee_id] != 'undefined') {
                        var truster = members[value.truster_id];
                        var trustee = members[value.trustee_id];

                        trustee.delegationCount++;
                        trustee.size += 5;
                    }
                });

                gameloop();
            });
        });
    }

    function update() {
        /*$.each(members, function(key, value) {
            value.velocityX = 0;
            value.velocityY = 0;
        });*/
        // seperation
        $.each(members, function(key, value) {
            $.each(members, function(key1, value1) {
                if (key != key1) {
                    var dX = value.x - value1.x;
                    var dY = value.y - value1.y;
                    var distance = Math.sqrt(dX * dX + dY * dY);
                    if (distance < (value.size + value1.size)) {
                        // when two circles are on top of each other
                        value.x += dX * 0.5;
                        value.y += dY * 0.5;
                    } else if (distance < (value.size + value1.size) * 1.3) {
                        value.velocityX += dX * 0.1;
                        value.velocityY += dY * 0.1;
                    }
                }
            });
        });
        // attraction
        $.each(delegations, function(key, value) {
            if (typeof members[value.truster_id] != 'undefined' &&
                    typeof members[value.trustee_id] != 'undefined') {
                var truster = members[value.truster_id];
                var trustee = members[value.trustee_id];
                var dX = truster.x - trustee.x;
                var dY = truster.y - trustee.y;
                var distance = Math.sqrt(dX * dX + dY * dY);
                if (distance > (truster.size + trustee.size) * 2) {
                    truster.velocityX -= dX * 0.01;
                    truster.velocityY -= dY * 0.01;
                    trustee.velocityX += dX * 0.01;
                    trustee.velocityY += dY * 0.01;
                }
            }
        });
        $.each(members, function(key, value) {
            //damping
            value.velocityX *= 0.7;
            value.velocityY *= 0.7;

            // add velocity to position
            value.x += value.velocityX;
            value.y += value.velocityY;

            // clip on world border
            value.x = value.x < 0 ? 0 : value.x;
            value.y = value.y < 0 ? 0 : value.y;
            value.x = value.x > width ? width : value.x;
            value.y = value.y > height ? height : value.y;
        });
    }

    function draw() {
        $('canvas').clearCanvas();

        $.each(members, function(key, value) {
            $('canvas').drawArc({
                strokeStyle: '#000000',
                x: value.x,
                y: value.y,
                radius: value.size
            });
            var text = value.id;
            if (value.delegationCount > 0) {
                text += ': ' + value.delegationCount;
            }
            $('canvas').drawText({
                fillStyle: "#000000",
                strokeWidth: 1,
                x: value.x,
                y: value.y,
                font: "6pt Verdana, sans-serif",
                text: text
            });
        });

        $.each(delegations, function(key, value) {
            if (typeof members[value.truster_id] != 'undefined' &&
                    typeof members[value.trustee_id] != 'undefined') {
                var truster = members[value.truster_id];
                var trustee = members[value.trustee_id];
                $('canvas').drawLine({
                    strokeStyle: "#000",
                    strokeWidth: 1,
                    x1: truster.x, y1: truster.y,
                    x2: trustee.x, y2: trustee.y
                });
            }
        });
    }
});
