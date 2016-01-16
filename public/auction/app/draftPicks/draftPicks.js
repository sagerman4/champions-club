angular.module('anal.draftPicks', ['ui.router', 'ui.bootstrap']);

angular.module('anal.draftPicks').service('DraftPicksService', function ($http) {
    this.getDraftPicks = function (leagueId, draftId) {
        return $http.get('api/leagues/'+leagueId+'/drafts/'+draftId+'/picks').then(function success(response) {
            return response.data;
        });
    };
    
    this.getDraftPick = function (leagueId, draftId, id) {
        return $http.get('api/leagues/'+leagueId+'/drafts/'+draftId+'/picks/'+ id).then(function success(response) {
            return response.data[0];
        });
    };
    
    this.removeDraftPick = function (leagueId, draftId, id) {
        return $http.delete('api/leagues/'+leagueId+'/drafts/'+draftId+'/picks/'+ id).then(function success(response) {
            return response.data;
        });
    };
    
    this.createDraftPick = function (leagueId, draftId, playerId, pricePaid, timeTaken) {
        return $http.post('api/leagues/'+leagueId+'/drafts/'+draftId+'/picks', {draftId: draftId, playerId: playerId, pricePaid: pricePaid, timeTaken: timeTaken}).then(function success(response) {
            return response;
        });
    };
});