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
            //$.ajaxSetup({async: true});
        }
    },

    index: function() {
        this.memberList = new MemberList();
        this.memberList.url = this.baseUrl + '/member';
        this.memberListView = new MemberListView({collection: this.memberList});

        this.memberList.fetch({
            data: {
                'session_key': this.sessionKey,
                'limit': 1000
            }
        });

        this.delegationList = new DelegationList();
        this.delegationList.url = this.baseUrl + '/delegation';
        this.delegationListView = new DelegationListView({
            collection: this.delegationList,
            'memberList': this.memberList
        });

        this.delegationList.fetch({
            data: {
                'session_key': this.sessionKey,
                'limit': 1000
            }
        });

        this.delegationList.forEach(function(delegation) {
            var truster = this.memberList.get(delegation.get('truster_id'));
            var trustee = this.memberList.get(delegation.get('trustee_id'));
            if (truster && trustee) {
                delegation.set({truster: truster});
                delegation.set({trustee: trustee});

                truster.set({'delegateCount': 1});

                var trusters = trustee.get('trusters');
                trusters.push(truster);
            }

        }, this);


        var list = this.memberList;
        this.memberList.forEach(function(member) {
            if (member.get('delegateCount') <= 0 && member.get('delegationCount') <= 0) {
                list.remove(member);
            }
        });

        this.memberListView.render();
        this.delegationListView.render();
        //$('#canvas').html(this.memberListView.el);
    },

    start: function() {
        //todo: {pushState: true} ? (htaccess)?
        Backbone.history.start();
    }
}));