window.Area = Backbone.Model.extend({
    parse: function(resp, xhr) {
        return resp.result[0];

    }
});