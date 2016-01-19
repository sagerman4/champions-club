angular.module('anal.draft', ['ui.router', 'ui.bootstrap', 'anal.teams', 'anal.drafts', 'anal.draftPicks', 'anal.players', 'angularCharts', 'anal.leagues', 'ngGrid', 'ngGridPlugins', 'anal.league'])
        .config(['$stateProvider',
            function ($stateProvider) {
                $stateProvider
                .state('draft', {url: '/draft', templateUrl: 'draft.html'})
                .state('league', {url: "/leagues/:id", templateUrl: "league.html"});
            }
        ]);

angular.module('anal.draft').service('DraftService', function ($http) {
    this.getAvailablePlayers = function (leagueId, draftId) {
        return $http.get('api/leagues/' + leagueId + '/drafts/' + draftId + '/availablePlayers').then(function success(response) {
            return response.data;
        });
    };

    this.pickPlayer = function (leagueId, draftId, playerId, pricePaid, pickNumber, draftTeamId) {
        return $http.post("api/leagues/" + leagueId + '/drafts/' + draftId + '/picks', {playerId: playerId, pricePaid: pricePaid, draftId: draftId, pickNumber: pickNumber, draftTeamId: draftTeamId}).then(function success(response) {
            return response;
        });
    };

    this.getCombos = function (leagueId, draftId, remainingBudget, positions, comboSelections) {
        return $http.post('/api/leagues/' + leagueId + '/drafts/' + draftId + '/combos', {remainingBudget: remainingBudget, positions: positions, comboSelections: comboSelections}).then(function (response) {
            return response.data;
        });
    };

    this.getDraftTeams = function (leagueId, draftId) {
        return $http.get('api/leagues/' + leagueId + '/drafts/' + draftId + '/teams').then(function success(response) {
            return response.data;
        });
    };

    this.updateDraftTeamBudget = function (leagueId, draftId, draftTeamId, newBudget) {
        return $http.put("api/leagues/" + leagueId + '/drafts/' + draftId + '/teams/' + draftTeamId, {remainingBudget: newBudget}).then(function success(response) {
            return response;
        });
    };

    this.getLeaguePositionConfig = function (leagueId) {
        return $http.get('/api/leagues/' + leagueId + '/positionConfig').then(function success(response) {
            return response.data;
        });
    };
});

angular.module('anal.draft').controller('DraftController', ['$scope', '$state', '$stateParams', 'DraftService', 'TeamsService', 'DraftsService', 'DraftPicksService', 'PlayersService', 'LeaguesService', 'ngGridPlugins', 'LeagueService', function ($scope, $state, $stateParams, DraftService, TeamsService, DraftsService, DraftPicksService, PlayersService, LeaguesService, ngGridPlugins, LeagueService) {
        $scope.chartDataPointsByPosition = [];

        $scope.init = function () {
            LeaguesService.getLeagues().then(function (data) {
                $scope.leagues = data;
            });
        };

        $scope.selectLeague = function (league) {
            $scope.league = league;
            LeagueService.getDraftResults($scope.league.league_key).then(function(data){
                console.log(data);
            });
            // DraftService.getLeaguePositionConfig($scope.league.id).then(function (data) {
            //     $scope.leaguePositions = data;
            //     DraftsService.getDraft($scope.league.id).then(function (data) {
            //         $scope.draft = data;
            //         DraftPicksService.getDraftPicks($scope.league.id, $scope.draft.id).then(function (data) {
            //             $scope.picks = data.sort(compare);
            //             for (var i in $scope.picks) {
            //                 $scope.picks[i].percentagePaid = (-$scope.calculatePercentage($scope.picks[i])) + '%';
            //             }
            //             $scope.getCurrentPick();
            //             $scope.newPrice = 1;
            //             DraftService.getDraftTeams($scope.league.id, $scope.draft.id).then(function (data) {
            //                 $scope.draftTeams = data;
            //                 $scope.calculateDraftTeamPercentages();
            //             });
            //             $scope.calculatePositionalStats();
            //             $scope.getAvailablePlayers();
            //         });
            //     });
            // });
        };

        $scope.selectTeam = function () {
            if ($scope.selectedTeamString) {
                for (var i in $scope.draftTeams) {
                    var team = $scope.draftTeams[i];
                    if (team.id === $scope.selectedTeamString.id) {
                        $scope.selectedTeam = team;
                        break;
                    }
                }
                $scope.setTeamNeeds();
            }
        };

        $scope.startDraft = function () {
            DraftsService.updateDraft($scope.league.id, $scope.draft.id, 'keepersChosen').then(function (response) {
                $scope.draft.status = 'keepersChosen';
            });
        };

        $scope.getCurrentPick = function () {
            var currentPick = {pick_number: 0};
            for (var i in $scope.picks) {
                if ($scope.picks[i].pick_number > currentPick.pick_number) {
                    currentPick = $scope.picks[i];
                }
            }
            $scope.currentPick = currentPick.pick_number + 1;
        };

        $scope.pickPlayer = function () {
            if ($scope.newPrice < 1 || !$scope.draftingTeam || !$scope.newPick) {
                return;
            }
            DraftService.updateDraftTeamBudget($scope.league.id, $scope.draft.id, $scope.draftingTeam.id, $scope.draftingTeam.remaining_budget - $scope.newPrice).then(function (data) {
                DraftService.getDraftTeams($scope.league.id, $scope.draft.id).then(function (data) {
                    $scope.draftTeams = data;
                    $scope.setTeamNeeds();
                    $scope.calculateDraftTeamPercentages();
                });
            });

            DraftService.pickPlayer($scope.league.id, $scope.draft.id, $scope.newPick.id, $scope.newPrice, $scope.currentPick, $scope.draftingTeam.id).then(function (data) {
                $scope.newPick = null;
                DraftPicksService.getDraftPicks($scope.league.id, $scope.draft.id).then(function (data) {
                    $scope.picks = data.sort(compare);
                    for (var i in $scope.picks) {
                        $scope.picks[i].percentagePaid = (-$scope.calculatePercentage($scope.picks[i])) + '%';
                    }
                    $scope.getCurrentPick();
                    $scope.newPrice = 1;
                    $scope.calculatePositionalStats();
                    $scope.getAvailablePlayers();
                });
            });
        };

        $scope.$watch('newPick', function (oldVal, newVal) {
            if ($scope.newPick) {
                $scope.newPick.positionRank = _.findIndex($scope.rankedPlayers[$scope.newPick.position], function (player) {
                    return player.id === $scope.newPick.id;
                }) + 1;
                $scope.newPick.overallRank = _.findIndex($scope.rankedPlayers['overall'], function (player) {
                    return player.id === $scope.newPick.id;
                }) + 1;

                $scope.chartDataPointsByPosition = [];
                for (var i in $scope.rankedPlayers[$scope.newPick.position]) {
                    var player = $scope.rankedPlayers[$scope.newPick.position][i];
                    $scope.chartDataPointsByPosition.push({x: player.id, y: [player.points]});
                }

                $scope.chartDataPointsOverall = [];
                for (var i in $scope.rankedPlayers['overall']) {
                    var player = $scope.rankedPlayers['overall'][i];
                    $scope.chartDataPointsOverall.push({x: player.id, y: [player.points]});
                }
                $scope.calculatePositionNeeds();

                for (var i in $scope.positions) {
                    if ($scope.newPick.position === $scope.positions[i].position) {
                        $scope.newPick.positionStats = $scope.positions[i];
                    }
                }
            }
        });

        $scope.getAvailablePlayers = function () {
            DraftService.getAvailablePlayers($scope.league.id, $scope.draft.id).then(function (data) {
                $scope.availablePlayers = data;
                for (var i in $scope.availablePlayers) {
                    $scope.availablePlayers[i].costPerPoint = Math.round(($scope.availablePlayers[i].price / $scope.availablePlayers[i].points) * 1000) / 1000;
                    for (var j in $scope.positions) {
                        if ($scope.positions[j].position === $scope.availablePlayers[i].position) {
                            $scope.availablePlayers[i].positionCostPerPoint = $scope.positions[j].averageCostPerPoint;
                        }
                    }
                    if (!$scope.availablePlayers[i].positionCostPerPoint) {
                        $scope.availablePlayers[i].positionCostPerPoint = '';
                    }
                }
                $scope.buildRankedPlayersByPositionByPoints();
            });
        };

        $scope.calculatePositionNeeds = function () {
            $scope.setTeamNeeds();
            var positionNeeds = [];
            for (var i in $scope.teamNeeds) {
                var need = $scope.teamNeeds[i];
                if (need.position === "DST" || need.position === "K") {
                    continue;
                }
                positionNeeds.push(need.position);
            }

            var newNeeds = [];
            newNeeds.push($scope.newPick.position);
            var found = false;
            for (var i in positionNeeds) {
                var need = positionNeeds[i];
                if (need === $scope.newPick.position && !found) {
                    found = true;
                    continue;
                }
                newNeeds.push(need);
            }

            DraftService.getCombos($scope.league.id, $scope.draft.id, 200, newNeeds, [$scope.newPick]).then(function (data) {
                $scope.combos = data;
                $scope.combos = _.sortBy($scope.combos, function (combo) {
                    return -combo.points;
                });
            });
        };

        $scope.calculatePercentage = function (pick) {
            return Math.round((((pick.price_paid - pick.price) / pick.price) * 100)) * -1;
        };

        $scope.setTeamNeeds = function () {
            $scope.teamNeeds = [];
            var leaguePositionsCopy = $scope.leaguePositions.slice();
            for (var i in $scope.picks) {
                var pick = $scope.picks[i];
                if (pick.draft_team_id === $scope.selectedTeam.id) {
                    var index = -1;
                    for (var j in leaguePositionsCopy) {
                        if (leaguePositionsCopy[j].position === pick.position) {
                            index = j;
                            break;
                        }
                    }
                    if (index > -1) {
                        leaguePositionsCopy.splice(index, 1);
                    }
                }
            }
            $scope.teamNeeds = leaguePositionsCopy;
        };


        $scope.buildRankedPlayersByPositionByPoints = function () {
            $scope.rankedPlayers = {};
            $scope.rankedPlayers.overall = [];
            for (var i in $scope.availablePlayers) {
                var player = $scope.availablePlayers[i];
                $scope.rankedPlayers.overall.push(player);
                if (!$scope.rankedPlayers[player.position]) {
                    $scope.rankedPlayers[player.position] = [];
                }
                $scope.rankedPlayers[player.position].push(player);
            }
            _.forEach($scope.rankedPlayers, function (attr, value) {
                $scope.rankedPlayers[value] = _.sortBy($scope.rankedPlayers[value], function (player) {
                    return -player.points;
                });
                $scope.rankedPlayers[value] = $scope.rankedPlayers[value].splice(0, 20);
            });
        };

        $scope.calculateDraftTeamPercentages = function () {
            for (var i in $scope.draftTeams) {
                var draftTeam = $scope.draftTeams[i];
                var percentages = [];
                var teamPrice = 0;
                var numberOfPicks = 0;
                for (var j in $scope.picks) {
                    var pick = $scope.picks[j];
                    if (pick.draft_team_id === draftTeam.id) {
                        percentages.push($scope.calculatePercentage(pick));
                        teamPrice += pick.price;
                        numberOfPicks++;
                    }
                }
                var teamPercentage = 0;
                if (percentages.length > 0) {
                    for (var j in percentages) {
                        teamPercentage += percentages[j];
                    }
                    teamPercentage = Math.round(teamPercentage / percentages.length);
                }
                $scope.draftTeams[i].percentage = teamPercentage;
                $scope.draftTeams[i].teamPrice = teamPrice;
                $scope.draftTeams[i].numberOfPicks = numberOfPicks;
            }
        };

        $scope.calculatePositionalStats = function () {
            $scope.positions = [{position: 'QB', numberDrafted: 0, totalPoints: 0, totalCost: 0, totalProjectedCost: 0}, {position: 'WR', numberDrafted: 0, totalPoints: 0, totalCost: 0, totalProjectedCost: 0}, {position: 'RB', numberDrafted: 0, totalPoints: 0, totalCost: 0, totalProjectedCost: 0}, {position: 'TE', numberDrafted: 0, totalPoints: 0, totalCost: 0, totalProjectedCost: 0}, {position: 'DST', numberDrafted: 0, totalPoints: 0, totalCost: 0, totalProjectedCost: 0}, {position: 'K', numberDrafted: 0, totalPoints: 0, totalCost: 0, totalProjectedCost: 0}];
            for (var i in $scope.positions) {
                for (var j in $scope.picks) {
                    var pick = $scope.picks[j];
                    if (pick.position === $scope.positions[i].position) {
                        $scope.positions[i].numberDrafted++;
                        $scope.positions[i].totalPoints += pick.points;
                        $scope.positions[i].totalCost += pick.price_paid;
                        $scope.positions[i].totalProjectedCost += pick.price;
                    }
                }
                $scope.positions[i].averagePoints = Math.round($scope.positions[i].totalPoints / $scope.positions[i].numberDrafted);
                $scope.positions[i].averageCost = Math.round($scope.positions[i].totalCost / $scope.positions[i].numberDrafted);
                $scope.positions[i].averageProjectedCost = Math.round($scope.positions[i].totalProjectedCost / $scope.positions[i].numberDrafted);
                $scope.positions[i].averageCostPerPoint = Math.round(($scope.positions[i].totalCost / $scope.positions[i].totalPoints) * 1000) / 1000;
            }

        };


        var compare = function (a, b) {
            if (a.pick_number < b.pick_number)
                return -1;
            if (a.pick_number > b.pick_number)
                return 1;
            return 0;
        };

        $scope.config = {
            title: 'Position by Points',
            tooltips: true,
            labels: false,
            mouseover: function () {
            },
            mouseout: function () {
            },
            click: function () {
            },
            legend: {
                display: true,
                //could be 'left, right'
                position: 'right'
            }
        };

        $scope.Fchart = function () {
            return {
                series: ['Player'],
                data: $scope.chartDataPointsByPosition
            };
        };

        $scope.overallConfig = {
            title: 'Overall by Points',
            tooltips: true,
            labels: false,
            mouseover: function () {
            },
            mouseout: function () {
            },
            click: function () {
            },
            legend: {
                display: true,
                //could be 'left, right'
                position: 'right'
            }
        };

        $scope.OverallFchart = function () {
            return {
                series: ['Player'],
                data: $scope.chartDataPointsOverall
            };
        };


        var filterBarPlugin = new ngGridPlugins.filterBarPlugin();

        $scope.allAvailableGridOptions = {
            data: 'availablePlayers',
            multiSelect: true,
            selectedItems: [],
            headerRowHeight: 60,
            showSelectionCheckbox: false,
            columnDefs: [
                {field: 'id', displayName: 'VORP', headerCellTemplate: filterBarPlugin.headerCellTemplate},
                {field: 'first_name', displayName: 'First', headerCellTemplate: filterBarPlugin.headerCellTemplate},
                {field: 'last_name', displayName: 'Last', headerCellTemplate: filterBarPlugin.headerCellTemplate},
                {field: 'position', displayName: 'Position', headerCellTemplate: filterBarPlugin.headerCellTemplate},
                {field: 'points', displayName: 'Points', headerCellTemplate: filterBarPlugin.headerCellTemplate},
                {field: 'price', displayName: 'Price', headerCellTemplate: filterBarPlugin.headerCellTemplate},
                {field: 'costPerPoint', displayName: 'Cost/Pt', headerCellTemplate: filterBarPlugin.headerCellTemplate},
                {field: 'positionCostPerPoint', displayName: 'Pos. Cost/Pt', headerCellTemplate: filterBarPlugin.headerCellTemplate}
            ],
            plugins: [filterBarPlugin]
        };


        var picksFilterBarPlugin = new ngGridPlugins.filterBarPlugin();

        $scope.picksGridOptions = {
            data: 'picks',
            multiSelect: true,
            selectedItems: [],
            headerRowHeight: 60,
            showSelectionCheckbox: false,
            columnDefs: [
                {field: 'pick_number', displayName: 'No', headerCellTemplate: picksFilterBarPlugin.headerCellTemplate},
                {field: 'first_name', displayName: 'First', headerCellTemplate: picksFilterBarPlugin.headerCellTemplate},
                {field: 'last_name', displayName: 'Last', headerCellTemplate: picksFilterBarPlugin.headerCellTemplate},
                {field: 'position', displayName: 'Position', headerCellTemplate: picksFilterBarPlugin.headerCellTemplate},
                {field: 'price', displayName: 'Price', headerCellTemplate: picksFilterBarPlugin.headerCellTemplate},
                {field: 'price_paid', displayName: 'Paid', headerCellTemplate: picksFilterBarPlugin.headerCellTemplate},
                {field: 'percentagePaid', displayName: '% Paid', headerCellTemplate: picksFilterBarPlugin.headerCellTemplate},
                {field: 'owner', displayName: 'Owner', headerCellTemplate: picksFilterBarPlugin.headerCellTemplate}
            ],
            plugins: [picksFilterBarPlugin]
        };
    }]);