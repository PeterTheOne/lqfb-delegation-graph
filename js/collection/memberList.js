window.MemberList = Backbone.Collection.extend({
    model: Member,

    url: 'http://apitest.liquidfeedback.org:25520/member',

    parse: function(resp, xhr) {
        return resp.result;
    },

    updateVelocity: function() {
        this.forEach(function(member1) {
            if (!member1.get('hasDelegation')) {
                return;
            }
            this.forEach(function(member2) {
                if (!member2.get('hasDelegation')) {
                    return;
                }
                if (member1 == member2) {
                    return;
                }
                var dX = member1.get('x') - member2.get('x');
                var dY = member1.get('y') - member2.get('y');
                var distance = Math.sqrt(dX * dX + dY * dY);
                var dXNormalized = (dX / distance);
                var dYNormalized = (dY / distance);
                var nonCollisoinDistance = (member1.get('size') + member2.get('size'));
                if (distance < nonCollisoinDistance * 2.5) {
                    var velocityX = member1.get('velocityX') + (dXNormalized / distance) * 20;
                    var velocityY = member1.get('velocityY') + (dYNormalized / distance) * 20;

                    member1.set({velocityX: velocityX});
                    member1.set({velocityY: velocityY});
                }
            }, this);
        }, this);
    },

    updatePosition: function() {
        this.forEach(function(member) {
            if (!member.get('hasDelegation')) {
                return;
            }

            //damping
            member.set({velocityX: member.get('velocityX') * 0.7});
            member.set({velocityY: member.get('velocityY') * 0.7});

            // add velocity to position
            var x = member.get('x') + member.get('velocityX');
            var y = member.get('y') + member.get('velocityY');

            //todo: make width and height dynamic
            var width = 800;
            var height = 600;

            // clip on world border
            x = x < 0 ? 0 : x;
            y = y < 0 ? 0 : y;
            x = x > width ? width : x;
            y = y > height ? height : y;

            // set
            member.set({x: x});
            member.set({y: y});
        }, this);
    }
});