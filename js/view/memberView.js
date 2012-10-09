window.MemberView = Backbone.View.extend({
    tagName: 'li',

    template:_.template('<span><%= name %></span>'),

    initialize: function() {
        this.model.on('change', this.render, this);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});