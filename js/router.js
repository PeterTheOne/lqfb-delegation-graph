window.lqfbDelegationGraph = new (Backbone.Router.extend({
    routes: {
        '': 'index'
    },

    initialize: function() {
        this.baseUrl = 'http://apitest.liquidfeedback.org:25520';
        this.apiKey = null;
        this.sessionKey = null;

        var parameterUrl = getURLParameter('baseUrl');
        var apiKey = getURLParameter('apiKey');
        if (parameterUrl && apiKey) {
            this.baseUrl = parameterUrl;
            this.apiKey = apiKey;
        }

        if (this.apiKey) {
            /*var session = new Session();
            session.url = this.baseUrl + '/session';
            session.fetch({
                key: this.apiKey,

                success: function() {
                    console.log(this.get('session_key'));
                }
            });*/

            var self = this;
            $.ajaxSetup({async: false});
            $.post(
                this.baseUrl + '/session',
                {
                    key: this.apiKey
                },
                function(data, msg) {
                    if (msg == 'success') {
                        self.sessionKey = data.session_key;
                    }
                },
                'json'
            );
            $.ajaxSetup({async: true});
        }
    },

    index: function() {
        this.memberList = new MemberList();
        this.memberList.url = this.baseUrl + '/member';
        this.memberListView = new MemberListView({collection: this.memberList});
        this.memberListView.render();
        $('#canvas').html(this.memberListView.el);

        this.memberList.fetch({
            data: {
                'session_key': this.sessionKey
            }
        });
    },

    start: function() {
        //todo: {pushState: true} ? (htaccess)?
        Backbone.history.start();
    }
}));