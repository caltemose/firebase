var templatizer = require('templatizer');

templatizer(
    __dirname + '/chad/templates/**/*.jade',
    __dirname + '/chad/templates.js',
    function (err, templates) { console.log(err || 'Success!') }
);
