$(function() {
    var members = [];
    var delegations = [];

    var baseUrl = 'http://apitest.liquidfeedback.org:25520/';
    var apiKey = '';
    var scope = 'unit';
    var unitId = '1';
    var areaId = '';
    var issueId = '';

    var radius = 10;
    var radiusDelegation = 5;
    var FPS = 60;
    var width = 800;
    var height = 600;
    var memberLimit = 1000;

    $('input#submit').click(function(event) {
        reset();
        init();
    });

    $('select#scope').change(function() {
        var tempScope = $('select#scope option:selected').first().val();
        $('select#unit').hide();
        $('select#area').hide();
        $('select#issue').hide();
        if (tempScope != 'all') {
            $('select#' + tempScope).show();
        }
    });

    $('input#baseUrl').change(function() {
        loadUnitAreaIssue();
    });

    $('input#apiKey').change(function() {
        loadUnitAreaIssue();
    });



    loadUnitAreaIssue();
    init();

    function reset() {
        endGameLoop();

        members = [];
        delegations = [];

        baseUrl = $('input#baseUrl').val();
        apiKey = $('input#apiKey').val();
        scope = $('select#scope option:selected').first().val();
        unitId = parseInt($('select#unit option:selected').first().val());
        areaId = parseInt($('select#area option:selected').first().val());
        issueId = parseInt($('select#issue option:selected').first().val());

        FPS = parseInt($('input#FPS').val());
        radius = parseInt($('input#radius').val());
        radiusDelegation = parseInt($('input#radiusDelegation').val());
        memberLimit = parseInt($('input#memberLimit').val());
    }

    function gameLoop() {
        update();
        draw();
    }

    var intervalId;

    function startGameLoop() {
        intervalId = setInterval(gameLoop, 1000 / FPS);
    }

    function endGameLoop() {
        clearInterval(intervalId);
    }

    function loadUnitAreaIssue() {
        var session_key = '';
        $.post(baseUrl + 'session', { key: apiKey }, function(data, msg) {
            if (msg == 'ok') {
                session_key = data.session_key;
            }

            // get unit
            var url = baseUrl + 'unit?limit=100';
            if (session_key != '') {
                url += '&session_key=' + session_key;
            }
            $.getJSON(url, function(data) {
                var options = '';
                $.each(data.result, function(key, val) {
                    options += '<option value="' + val.id
                    if (unitId == val.id) {
                        options += '" selected>';
                    } else {
                        options += '">';
                    }
                    options += val.id + ': ' + val.name + '</option>';
                });
                $('#unit').html(options);
            });

            // get area
            var url = baseUrl + 'area?limit=100';
            if (session_key != '') {
                url += '&session_key=' + session_key;
            }
            $.getJSON(url, function(data) {
                var options = '';
                $.each(data.result, function(key, val) {
                    options += '<option value="' + val.id
                    if (areaId == val.id) {
                        options += '" selected>';
                    } else {
                        options += '">';
                    }
                    options += val.id + ': ' + val.name + '</option>';
                });
                $('#area').html(options);
            });

            // get issue
            var url = baseUrl + 'issue?limit=100';
            if (session_key != '') {
                url += '&session_key=' + session_key;
            }
            $.getJSON(url, function(data) {
                var options = '';
                $.each(data.result, function(key, val) {
                    options += '<option value="' + val.id
                    if (issueId == val.id) {
                        options += '" selected>';
                    } else {
                        options += '">';
                    }
                    options += val.id + '</option>';
                });
                $('#issue').html(options);
            });
        });
    }

    function init() {
        $('canvas').drawText({
            fillStyle: "#000000",
            strokeWidth: 1,
            x: width / 2,
            y: height / 2,
            font: "30pt Verdana, sans-serif",
            text: 'Loading...'
        });

        var session_key = '';
        $.post(baseUrl + 'session', { key: apiKey }, function(data, msg) {
            if (msg == 'ok') {
                session_key = data.session_key;
            }

            // prepare url
            var url = baseUrl + 'member?limit=' + memberLimit;
            if (session_key != '') {
                url += '&session_key=' + session_key;
            }
            $.getJSON(url, function(data) {
                $.each(data.result, function(key, val) {
                    var member = {
                        id: key,
                        name: val.name,
                        delegationCount: function () {
                            return this.calcDelegationCount(this.id, 0);
                        },
                        calcDelegationCount: function(id, depth) {
                            // todo: replace this recursion

                            // break delegation circle
                            if (depth > 0 && this.id == id) {
                                return -1;
                            }
                            var result = 0;
                            $.each(this.trusters, function(key, value) {
                                result += value.calcDelegationCount(id, depth + 1) + 1;
                            });
                            return result;
                        },
                        delegateCount: 0,
                        size: radius,
                        x: Math.random() * width,
                        y: Math.random() * height,
                        velocityX: 0,
                        velocityY: 0,
                        removed: false,
                        trusters: new Array()
                    };
                    members[key] = member;
                });

                // prepare url
                var url = baseUrl + 'delegation';
                if (scope == 'all') {
                    // do nothing
                } else if (scope == 'unit') {
                    url += '?scope=unit&unit_id=' + unitId;
                } else if (scope == 'area') {
                    url += '?scope=area&area_id=' + areaId;
                } else if (scope == 'issue') {
                    url += '?scope=issue&issue_id=' + issueId;
                }
                if (session_key != '') {
                    url += '&session_key=' + session_key;
                }
                $.getJSON(url, function(data) {
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

                            trustee.trusters.push(truster);
                            trustee.size = radius;

                            truster.delegateCount = 1;
                        }
                    });

                    $.each(members, function(key, value) {
                        value.size = radius + value.delegationCount() * radiusDelegation;

                        // remove members that are not trusters or trustees or both
                        if (value.delegationCount() <= 0 && value.delegateCount <= 0) {
                            value.removed = true;
                        }
                    });

                    startGameLoop();
                });
            });
        }, "json");
    }

    function update() {
        // seperation
        $.each(members, function(key, value) {
            if (value.removed) {
                return;
            }
            $.each(members, function(key1, value1) {
                if (value1.removed) {
                    return;
                }
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
            if (value.removed) {
                return;
            }
            $('canvas').drawArc({
                strokeStyle: '#000000',
                x: value.x,
                y: value.y,
                radius: value.size
            });
            var text = '';
            if (value.name == '' || value.name == null || value.name == 'null') {
                text = value.id;
            } else {
                text = value.name;
            }
            if (value.delegationCount() > 0) {
                text += ' +' + value.delegationCount();
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
                var dX = truster.x - trustee.x;
                var dY = truster.y - trustee.y;
                var distance = Math.sqrt(dX * dX + dY * dY);
                dX = dX / distance;
                dY = dY / distance;

                var x1 = truster.x - dX * truster.size;
                var y1 = truster.y - dY * truster.size;
                var x2 = trustee.x + dX * trustee.size;
                var y2 = trustee.y + dY * trustee.size;
                // draw line
                $('canvas').drawLine({
                    strokeStyle: "#000",
                    strokeWidth: 1,
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2
                });
                // draw dot on trustee side
                $('canvas').drawArc({
                    strokeStyle: "#000",
                    fillStyle: "#000",
                    strokeWidth: 1,
                    x: x2 + dX * 3,
                    y: y2 + dY * 3,
                    radius: 3,
                    closed:true
                });
            }
        });
    }
});
