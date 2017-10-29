require.config({
    shim : {
        bootstrap : { deps :['jquery'] }
    },
    paths: {
        jquery: '/lib/jquery/jquery.min',
        bootstrap: '/lib/bootstrap/bootstrap.min',
        knockout: '/lib/knockout/knockout-latest',
        'socket.io': '/lib/socket.io/socket.io',
        index: '/scripts/index'
    }
});
