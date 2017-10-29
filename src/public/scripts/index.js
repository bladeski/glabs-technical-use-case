(function() {
    'use strict';

    requirejs([
        'knockout',
        'bootstrap',
        'socket.io'
    ], function(ko, bootstrap, io) {

        var viewModel = {
                returnedDebitItems: ko.observableArray(),
                showingAlert: ko.observable(false),
                clearAlert: function () {
                    viewModel.showingAlert(false);
                }
            },
            socket = io();

        $.ajax({
                url: '/items'
            }).done(function(data) {
                console.log(data);
                // data.forEach(function (item) {
                //
                //     item.
                // });
                viewModel.returnedDebitItems(data);
            });

        socket.on('New Item Saved', function (item) {
            viewModel.showingAlert(true);
            viewModel.returnedDebitItems.push(item);
        });

        ko.applyBindings(viewModel);
    });
})();
