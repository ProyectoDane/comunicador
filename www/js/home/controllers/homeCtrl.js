communicatorApp.controller('homeCtrl', function($scope, $ionicPopup, $state, $stateParams, tutorialService, 
        levelDbService, appService, configurationDbService) {
    
    configurationDbService.find('categoryEnabled').then(function(results){
        $scope.categoryEnabled = results[0].value === 'true' ? true : false;
    });

    levelDbService.selectAll().then(function(results) {
        $scope.levels = results;
        var lastLevel = 0;
        var lastDate = $scope.levels[0].initDate;
        for (var i = 0; i < $scope.levels.length; i++) {
            if ($scope.levels[i].initDate > lastDate){
                lastLevel = i;
            }
        }
        $scope.levels[lastLevel].selected = true;
        $scope.selectedLevel = $scope.levels[lastLevel];
    });

    $scope.selectLevel = function(level) {

        if ($scope.selectedLevel.id === level.id) {
            level.selected = !level.selected;
        } else {
            if (level.enabled === "true") {
                $scope.selectedLevel.selected = false;
                level.selected = true;
                $scope.selectedLevel = level;
            } else {
                $ionicPopup.alert({
                    title: 'Próximamente',
                    template: 'El nivel seleccionado no se encuentra disponible actualmente'
                });
            }
        }
    };

    appService.uninitialized().then(function() {
        $state.transitionTo('tutorialHome').then(function() {
            tutorialService.showIfActive();
        });
    }, function() {
        tutorialService.showIfActive();
    });
});
