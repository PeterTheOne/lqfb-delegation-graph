window.DelegationList = Backbone.Collection.extend({
    model: Delegation,

    url: 'http://apitest.liquidfeedback.org:25520/delegation',

    parse: function(resp, xhr) {
        return resp.result;
    }
});