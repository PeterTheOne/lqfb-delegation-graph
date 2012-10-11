window.DelegationList = Backbone.Collection.extend({
    model: Delegation,

    url: 'http://apitest.liquidfeedback.org:25520/delegation',

    parse: function(resp, xhr) {
        return resp.result;
    },

    updateVelocity: function() {
        this.forEach(function(delegation) {
            var truster = delegation.get('truster');
            var trustee = delegation.get('trustee');
            if (truster && trustee) {
                var dX = truster.get('x') - trustee.get('x');
                var dY = truster.get('y') - trustee.get('y');
                var distance = Math.sqrt(dX * dX + dY * dY);
                var dXNormalized = (dX / distance);
                var dYNormalized = (dY / distance);
                var nonCollisoinDistance = (truster.get('size') + trustee.get('size'));
                //if (distance > nonCollisoinDistance * 2) {
                var trusterVelocityX = truster.get('velocityX') - (dX * 0.0001 * distance + nonCollisoinDistance * 0.01 * -dXNormalized);
                var trusterVelocityY = truster.get('velocityY') - (dY * 0.0001 * distance + nonCollisoinDistance * 0.01 * -dYNormalized);
                var trusteeVelocityX = trustee.get('velocityX') + (dX * 0.0001 * distance + nonCollisoinDistance * 0.01 * -dXNormalized);
                var trusteeVelocityY = trustee.get('velocityY') + (dY * 0.0001 * distance + nonCollisoinDistance * 0.01 * -dYNormalized);
                //}
                truster.set({velocityX: trusterVelocityX});
                truster.set({velocityY: trusterVelocityY});
                trustee.set({velocityX: trusteeVelocityX});
                trustee.set({velocityY: trusteeVelocityY});
            }
        }, this);
    }
});