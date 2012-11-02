window.Member = Backbone.Model.extend({
    defaults: function() {
        return {
            trusters: new MemberList(),
            delegateCount: 0,
            delegationCountCache: -1,
            //todo: make width and height setable
            x: Math.random() * 800,
            y: Math.random() * 600,
            velocityX: 0,
            velocityY: 0,
            size: 10,
            hasDelegation: false
        };
    },

    delegationCount: function () {
        if (this.get('delegationCountCache') == -1) {
            this.set('delegationCountCache', this.calcDelegationCount(this.id, 0));
        }
        return this.get('delegationCountCache');
    },

    calcDelegationCount: function(id, depth) {
        var trusters = this.get('trusters');

        if (!trusters) {
            return 0;
        }

        // break delegation circle
        if (depth > 0 && this.id == id) {
            return -1;
        }
        var result = 0;

        trusters.forEach(function(truster) {
            result += truster.calcDelegationCount(id, depth + 1) + 1;
        }, this);
        return result;
    }
});