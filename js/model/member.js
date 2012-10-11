window.Member = Backbone.Model.extend({
    defaults: function() {
        return {
            trusters: new MemberList(),
            delegateCount: 0,
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
        return this.calcDelegationCount(this.id, 0);
    },

    calcDelegationCount: function(id, depth) {
        // todo: replace this recursion

        //todo: fix this
        if (!this.trusters) {
            return 0;
        }

        // break delegation circle
        if (depth > 0 && this.id == id) {
            return -1;
        }
        var result = 0;
        //this.collection.forEach(this.calcOneDelegationCount, this);

        this.trusters.forEach(function(truster) {
            result += truster.calcDelegationCount(id, depth + 1) + 1;
        }, this);
        return result;
    }

    /*calcOneDelegationCount: function(member) {
        this.result += value.calcDelegationCount(id, depth + 1) + 1;
    }*/
});