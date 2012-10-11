window.lqfbDelegationGraph = new (Backbone.Router.extend({
    routes: {
        '': 'selectInstance',
        'selectScope/:baseUrl/:apiKey': 'selectScope',
        'graphView/:baseUrl/:apiKey/:scope/:scopeId': 'graphView'
    },

    initialize: function() {

    },

    selectInstance: function() {
        $('#content').html('<a href="#selectScope/http%3A%2F%2F88.198.24.116%3A25520/9QPQjHjW4dcd23rSbN66">lqfb ppoe</a>');
    },

    selectScope: function(baseUrl, apiKey) {
        $('#content').html('<a href="#graphView/' + baseUrl + '/' + apiKey + '/' + 'unit' + '/' + '1' + '">unit 1</a>');
    },

    graphView: function(baseUrl, apiKey, scope, scopeId) {
        $.get('template/canvas.html', function(template) {
            $('#content').html(template);
        });


        this.baseUrl = stripTrailingSlash(decodeURIComponent(baseUrl));
        this.sessionKey = null;
        this.scope = scope;
        this.scopeId = scopeId;
        this.unitId = null;
        this.areaId = null;
        this.issueId = null;
        this.sessionKey = null;

        this.fetchSessionKey(apiKey);

        if (this.scope == 'unit') {
            this.unitId = scopeId;
        } else if (this.scope == 'area') {
            this.area = new Area();
            this.area.url = this.baseUrl + '/area';
            this.area.fetch({
                data: {
                    'session_key': this.sessionKey,
                    'area_id': scopeId
                },
                async: false
            });
            this.unitId = this.area.get('unit_id');
            this.areaId = scopeId;
        } else {
            this.issue = new Issue();
            this.issue.url = this.baseUrl + '/issue';
            this.issue.fetch({
                data: {
                    'session_key': this.sessionKey,
                    'issue_id': scopeId
                },
                async: false
            });
            this.area = new Area();
            this.area.url = this.baseUrl + '/area';
            this.area.fetch({
                data: {
                    'session_key': this.sessionKey,
                    'area_id': this.issue.get('area_id')
                },
                async: false
            });
            this.unitId = this.area.get('unit_id');
            this.areaId = this.issue.get('area_id');
            this.issueId = scopeId;
        }

        this.memberList = new MemberList();
        this.memberList.url = this.baseUrl + '/member';
        this.memberListView = new MemberListView({collection: this.memberList});

        this.memberList.fetch({
            data: {
                'session_key': this.sessionKey,
                'limit': 1000
            },
            async: false
        });

        this.delegationListUnit = new DelegationList();
        this.delegationListUnit.url = this.baseUrl + '/delegation';
        this.delegationListUnitView = new DelegationListView({
            collection: this.delegationListUnit,
            'memberList': this.memberList
        });

        this.delegationListArea = new DelegationList();
        this.delegationListArea.url = this.baseUrl + '/delegation';
        this.delegationListAreaView = new DelegationListView({
            collection: this.delegationListArea,
            'memberList': this.memberList
        });

        this.delegationListIssue = new DelegationList();
        this.delegationListIssue.url = this.baseUrl + '/delegation';
        this.delegationListIssueView = new DelegationListView({
            collection: this.delegationListIssue,
            'memberList': this.memberList
        });

        this.delegationListUnit.fetch({
            data: {
                'session_key': this.sessionKey,
                'limit': 1000,
                'scope': 'unit',
                'unit_id': this.unitId
            },
            async: false
        });

        if (this.scope == 'area' || this.scope == 'issue') {
            this.delegationListArea.fetch({
                data: {
                    'session_key': this.sessionKey,
                    'limit': 1000,
                    'scope': 'area',
                    'area_id': this.areaId
                },
                async: false
            });
        }

        if (this.scope == 'issue') {
            this.delegationListIssue.fetch({
                data: {
                    'session_key': this.sessionKey,
                    'limit': 1000,
                    'scope': 'issue',
                    'issue_id': this.issueId
                },
                async: false
            });
        }

        // issue
        this.delegationListIssue.forEach(function(delegation) {
            var truster = this.memberList.get(delegation.get('truster_id'));
            var trustee = this.memberList.get(delegation.get('trustee_id'));
            if (truster && trustee && truster.get('delegateCount') <= 0) {
                delegation.set({truster: truster});
                delegation.set({trustee: trustee});

                truster.set({delegateCount: 1});
                truster.set({hasDelegation: true});
                trustee.set({hasDelegation: true});

                var trusters = trustee.get('trusters');
                trusters.push(truster);
            }
        }, this);

        // area
        this.delegationListArea.forEach(function(delegation) {
            var truster = this.memberList.get(delegation.get('truster_id'));
            var trustee = this.memberList.get(delegation.get('trustee_id'));
            if (truster && trustee && truster.get('delegateCount') <= 0) {
                delegation.set({truster: truster});
                delegation.set({trustee: trustee});

                truster.set({delegateCount: 1});
                truster.set({hasDelegation: true});
                trustee.set({hasDelegation: true});

                var trusters = trustee.get('trusters');
                trusters.push(truster);
            }
        }, this);

        // unit
        this.delegationListUnit.forEach(function(delegation) {
            var truster = this.memberList.get(delegation.get('truster_id'));
            var trustee = this.memberList.get(delegation.get('trustee_id'));
            if (truster && trustee && truster.get('delegateCount') <= 0) {
                delegation.set({truster: truster});
                delegation.set({trustee: trustee});

                truster.set({delegateCount: 1});
                truster.set({hasDelegation: true});
                trustee.set({hasDelegation: true});

                var trusters = trustee.get('trusters');
                trusters.push(truster);
            }
        }, this);

        //todo: fix remove
        /*var list = this.memberList;
        var i = 0;
        this.memberList.forEach(function(member) {
            //if (member.get('delegateCount') <= 0 && member.delegationCount() <= 0) {
            console.log('i: ' + i++ + ', name: ' + member.get('name') + ', hasDelegation: ' + member.get('hasDelegation'));
            if (!member.get('hasDelegation')) {
                console.log('remove');
                list.remove(member);
            }
        });*/

        this.memberListView.render();
        this.delegationListUnitView.render();
        this.delegationListAreaView.render();
        this.delegationListIssueView.render();
        //$('#canvas').html(this.memberListView.el);

        //todo: move gameloop to..
        var self = this;
        this.intervalId = setInterval(function() {
            self.memberList.updatePosition();

            $('canvas').clearCanvas();
            self.memberListView.render();
            self.delegationListUnitView.render();
            self.delegationListAreaView.render();
            self.delegationListIssueView.render();
        }, (1000 / 60));
    },

    start: function() {
        //todo: {pushState: true} ? (htaccess)?
        Backbone.history.start({
            root: '/lqfb-delegation-graph'
        });
    },

    fetchSessionKey: function(apiKey) {
        var self = this;
        $.ajaxSetup({async: false});
        $.post(
            this.baseUrl + '/session',
            {
                key: apiKey
            },
            function(data, msg) {
                if (msg == 'success') {
                    self.setSessionKey(data.session_key);
                }
            },
            'json'
        );
        //$.ajaxSetup({async: true});
    },

    setSessionKey: function(sessionKey) {
        this.sessionKey = sessionKey;
    }
}));