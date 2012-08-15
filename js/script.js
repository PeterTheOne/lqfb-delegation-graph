$(function() {
    var gLoop;
    var members = [];
    var delegations = [];

    var radius = 10;
    var FPS = 30;

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
                    x: Math.random() * 600,
                    y: Math.random() * 600,
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

                    gameloop();
                });
            });
        });
    }

    function update() {
        $.each(members, function(key, value) {
            value.velocityX = 0;
            value.velocityY = 0;
        });
        // seperation
        $.each(members, function(key, value) {
            $.each(members, function(key1, value1) {
                if (key != key1) {
                    var dX = value.x - value1.x;
                    var dY = value.y - value1.y;
                    var distance = Math.sqrt(dX * dX + dY * dY);
                    if (distance < (value.size + value1.size) * 1.5) {
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
                truster.velocityX -= dX * 0.1;
                truster.velocityY -= dY * 0.1;
                trustee.velocityX += dX * 0.1;
                trustee.velocityY += dY * 0.1;
            }
        });
        $.each(members, function(key, value) {
            value.x += value.velocityX;
            value.y += value.velocityY;
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
            $('canvas').drawText({
                fillStyle: "#000000",
                strokeWidth: 1,
                x: value.x,
                y: value.y,
                font: "6pt Verdana, sans-serif",
                text: value.id + ': ' + value.delegationCount
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
