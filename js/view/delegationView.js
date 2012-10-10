window.DelegationView = Backbone.View.extend({
    initialize: function() {

    },

    render: function() {
        var truster = this.model.get('truster');
        var trustee = this.model.get('trustee');
        if (truster && trustee) {
            var dX = truster.get('x') - trustee.get('x');
            var dY = truster.get('y') - trustee.get('y');
            var distance = Math.sqrt(dX * dX + dY * dY);
            dX = dX / distance;
            dY = dY / distance;

            var x1 = truster.get('x') - dX * truster.get('size');
            var y1 = truster.get('y') - dY * truster.get('size');
            var x2 = trustee.get('x') + dX * trustee.get('size');
            var y2 = trustee.get('y') + dY * trustee.get('size');

            console.log('drawLine: ' + x1);

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
    }
});