(function($){

    var Member = Backbone.Model.extend({
        defaults: {
            name: 'default-name'
        }
    });

    var MemberList = Backbone.Collection.extend({
        model: Member,

        url: function() {
            return 'http://apitest.liquidfeedback.org:25520/member';
        },

        parse: function(resp, xhr) {
            return resp.result;
        }
    });

    var MemberView = Backbone.View.extend({
        tagName: 'li',

        events: {
            'click span.delete': 'remove'
        },

        initialize: function() {
            _.bindAll(this, 'render', 'unrender', 'remove');

            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
        },

        render: function() {
            $(this.el).html('<span>' + this.model.get('name') + '</span><span class="delete" style="cursor:pointer; color:red; font-family:sans-serif;">[delete]</span>');
            return this;
        },

        unrender: function() {
            $(this.el).remove();
        },

        remove: function() {
            this.model.destroy();
        }
    });

    var MemberListView = Backbone.View.extend({
        el: $('body'),

        events: {
            'click input#submit': 'loadResults'
        },

        initialize: function() {
            _.bindAll(this, 'render', 'loadResults', 'appendItem');

            this.isLoading = false;

            this.collection = new MemberList();
            this.collection.bind('add', this.appendItem);

            this.counter = 0;
            this.render();
        },

        render: function() {
            var self = this;

            this.loadResults();

            //$(this.el).append("<button id='add'>Add list item</button>");
            //$(this.el).append("<ul></ul>");
            _(this.collection.models).each(function(item) {
                self.appendItem(item);
            }, this);
        },

        loadResults: function() {
            var self = this;

            this.isLoading = true;

            this.collection.fetch({
                success: function(members) {
                    members.each(function(memberData) {
                        var member = new Member();
                        member.set({
                            name: memberData.get('name')
                        });
                        self.collection.add(member);
                    });
                    this.isLoading = false;
                }
            });
        },

        appendItem: function(item) {
            var memberView = new MemberView({
                model: item
            });
            $('ul', this.el).append(memberView.render().el);
        }
    });

    var memberListView = new MemberListView();

})(jQuery);