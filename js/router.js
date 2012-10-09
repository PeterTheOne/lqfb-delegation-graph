window.lqfbDelegationGraph = new (Backbone.Router.extend({
    routes: {
        '': 'index'
    },

    initialize: function() {

    },

    index: function() {
        this.memberList = new MemberList();
        this.memberListView = new MemberListView({collection: this.memberList});
        this.memberListView.render();
        $('#canvas').html(this.memberListView.el);

        this.memberList.fetch();
    },

    start: function() {
        //todo: {pushState: true} ? (htaccess)?
        Backbone.history.start();
    }
}));