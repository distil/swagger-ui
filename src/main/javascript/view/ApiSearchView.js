'use strict';

SwaggerUi.Views.ApiSearchView = Backbone.View.extend({
    ui: {
        searchField: 'input#api-search'
    },

    events: {
        'awesomplete-selectcomplete input#api-search': 'onApiSelectChange'
    },

    template: Handlebars.templates.api_search,

    initialize: function (opts) {
        this.options = opts || {};
        this.router = opts.router;
    },

    getAwesomplete: function (element, list) {
        return new Awesomplete(element, {
            maxItems: 5,
            minChars: 1,
            list: list,
            filter: function(text, input) {
                var cleansedInput = Awesomplete.$.regExpEscape(input.trim());
                cleansedInput = cleansedInput.replace(/\s/g, '[\\W\\s]*');
                return RegExp(cleansedInput, 'i').test(text);
            },
            item: function (text, input) {
                var html = '';
                if (input === '') {
                    html = text;
                } else {
                    var cleansedInput = Awesomplete.$.regExpEscape(input.trim());
                    cleansedInput = cleansedInput.replace(/\s/g, '[\\W\\s]*');
                    var regexp = RegExp(cleansedInput, 'gi');
                    html = text.replace(regexp, '<mark>$&</mark>');
                }
                return Awesomplete.$.create('li', {
                    innerHTML: html,
                    'aria-selected': 'false'
                });
            }
        });
    },

    buildApiList: function () {
        var apiList = this.model.apisArray.map(function (api) {
            return api.operationsArray.map(function (operation) {
                return {
                    label: api.tag + ': ' + operation.summary + ' - ' + operation.method + ' ' + operation.path,
                    value: api.id + '|' + operation.nickname
                };
            });
        });
        return [].concat.apply([], apiList);
    },

    render: function () {
        $(this.el).html(Handlebars.templates.api_search(this.model));

        var apiList = this.buildApiList();
        this.getAwesomplete(this.ui.searchField, apiList);
        return this;
    },

    onApiSelectChange: function (event) {
        var combinedId = event.target.value;
        var delimiterIndex = combinedId.indexOf('|');
        var resourceId = combinedId.slice(0, delimiterIndex);
        var operationId = combinedId.slice(delimiterIndex + 1, combinedId.length);

        // Expand selected resource
        var resource = _.find(this.model.apisArray, {id: resourceId});
        // Open requested operation
        Docs.expandEndpointListForResource(resource.id);

        // Expand selected operation
        var operationSelector = $('#' + resourceId + '_' + operationId + '_content');
        Docs.expandOperation(operationSelector);

        operationSelector.promise().done(function () {
            // Scroll to the opened DOM element
            var operationHeaderId = resourceId + '_' + operationId;
            document.getElementById(operationHeaderId).scrollIntoView();
        });

        event.target.value = '';
    }
});
