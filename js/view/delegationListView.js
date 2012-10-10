window.DelegationListView = Backbone.View.extend({
    initialize: function() {
        //this.collection.on('add', this.addOne, this);
        //this.collection.on('reset', this.addAll, this);
    },

    render: function() {
        //$('canvas').clearCanvas();

        this.addAll();
        return this;
    },

    addAll: function() {
        this.$el.empty();
        this.collection.forEach(this.addOne, this);
    },

    addOne: function(delegation) {
        var delegationView = new DelegationView({
            model: delegation
        });
        delegationView.render();
    }
});