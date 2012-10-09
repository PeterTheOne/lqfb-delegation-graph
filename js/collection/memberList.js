window.MemberList = Backbone.Collection.extend({
    model: Member,

    url: 'http://apitest.liquidfeedback.org:25520/member',

    parse: function(resp, xhr) {
        return resp.result;
    }
});