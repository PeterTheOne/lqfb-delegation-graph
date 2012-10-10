window.Member = Backbone.Model.extend({
    defaults: function() {
        return {
            trusters: new MemberList(),
            delegateCount: 0,
            //todo: make width and height setable
            x: Math.random() * 800,
            y: Math.random() * 600,
            size: 10
        };
    },

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
    }
});