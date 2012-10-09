window.lqfbDelegationGraph = new (Backbone.Router.extend({
    routes: {
        '': 'index'
    },

    initialize: function() {
        this.baseUrl = 'http://apitest.liquidfeedback.org:25520';
        this.apiKey = null;

        var parameterUrl = getURLParameter('baseUrl');
        var apiKey = getURLParameter('apiKey');
        if (parameterUrl && apiKey) {
            this.baseUrl = parameterUrl;
            this.apiKey = apiKey;
        }
    },

    index: function() {
        this.memberList = new MemberList();
        this.memberList.url = this.baseUrl + '/member';
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