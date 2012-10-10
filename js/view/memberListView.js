window.MemberListView = Backbone.View.extend({
    tagName: 'ul',

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

    addOne: function(member) {
        var memberView = new MemberView({model: member});
        memberView.render();
    }
});