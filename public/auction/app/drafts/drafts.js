angular.module('anal.drafts', ['ui.router', 'ui.bootstrap']);

angular.module('anal.drafts').service('DraftsService', function ($http) {
    this.getDrafts = function (leagueId) {
        return $http.get('api/leagues/' + leagueId + '/drafts').then(function success(response) {
            return response.data;
        });
    };
    
    this.getDraft = function (leagueId, id) {
        return $http.get('api/leagues/' + leagueId + '/drafts/' + id).then(function success(response) {
            return response.data[0];
        });
    };
    
    this.removeDraft = function (leagueId, id) {
        return $http.delete('api/leagues/' + leagueId + '/drafts/' + id).then(function success(response) {
            return response.data;
        });
    };
    
    this.createDraft = function (leagueId, year) {
        return $http.post('api/leagues/' + leagueId + '/drafts', {year: year}).then(function success(response) {
            return response;
        });
    };
    
    this.updateDraft = function(leagueId, id, status) {
        return $http.put('api/leagues/' + leagueId + '/drafts/' + id, {status: status}).then(function success(response){
            return response; 
        });
    };
});