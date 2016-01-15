define(function(require) {
    var controllers = require("controllers/controllers");

    function HomeCtrl(User, Teams) {
        this.welcome = "THE Fantasy League";
        
        this.user = {
            id: User.id
        };

        this.week = 1;

        Teams.teams().success(function(teams) {
            this.teams = teams;

            this.totalMoves = this.teams.reduce(function(memo, team) {
                memo += team.number_of_moves;
                return memo;
            }, 0);

            this.totalTrades = this.teams.reduce(function(memo, team) {
                memo += team.number_of_trades;
                return memo;
            }, 0);

        }.bind(this));

        Morris.Line({
            // ID of the element in which to draw the chart.
            element: 'morris-line-chart',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            data: [{
                d: '2014-10-01',
                points: 89
            }, {
                d: '2014-10-02',
                points: 91
            }, {
                d: '2014-10-03',
                points: 78
            }, {
                d: '2014-10-04',
                points: 102
            }, {
                d: '2014-10-05',
                points: 110
            }, {
                d: '2014-10-06',
                points: 98
            }, {
                d: '2014-10-07',
                points: 92
            }, {
                d: '2014-10-08',
                points: 96
            }, {
                d: '2014-10-09',
                points: 95
            }],
            // The name of the data record attribute that contains x-visitss.
            xkey: 'd',
            // A list of names of data record attributes that contain y-visitss.
            ykeys: ['points'],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: ['points'],
            // Disables line smoothing
            smooth: false,
            resize: true
        });
    }

    return controllers.controller("HomeCtrl", HomeCtrl);
});
