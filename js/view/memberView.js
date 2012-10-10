window.MemberView = Backbone.View.extend({
    tagName: 'li',

    template:_.template('<span><%= name %></span>'),

    initialize: function() {
        //this.model.on('change', this.render, this);
    },

    render: function() {
        //this.$el.html(this.template(this.model.toJSON()));
        //return this;

        if (!this.model.get('hasDelegation')) {
            return;
        }

        // draw arc
        $('canvas').drawArc({
            strokeStyle: '#000000',
            x: this.model.get('x'),
            y: this.model.get('y'),
            radius: this.model.get('size')
        });

        // draw name
        var text = '';
        if (this.model.get('name')) {
            text = this.model.get('name');
        } else {
            text = this.model.get('id');
        }
        if (this.model.get('delegationCount') > 0) {
            text += ' +' + this.model.get('delegationCount');
        }
        $('canvas').drawText({
            fillStyle: "#000000",
            strokeWidth: 1,
            x: this.model.get('x'),
            y: this.model.get('y') + 18,
            font: "6pt Verdana, sans-serif",
            text: text
        });

        // draw image
        //$('canvas').drawImage({ source: value.image_src, x: value.x, y: value.y, scale: 0.5 });
    }
});