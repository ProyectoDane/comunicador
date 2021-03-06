communicatorApp.controller('mainStatisticsCtrl', function($scope, statisticService, levelDbService) {

    $scope.loaded = false;
    $scope.hasExchanges = false;
    $scope.exchanges = {};
    $scope.exchanges3A = {};
    $scope.exchanges3B = {};
    $scope.exchangeCountByReceiver = [];

    levelDbService.selectAll().then(function(levels){
        $scope.levels = levels;
        $scope.myLevel = levels[0];
        
    }).then(function(){
        statisticService.exchangeCountByReceiver($scope.myLevel.levelNumber).then(function(result) {
            $scope.exchangeCountByReceiver = result;
        });
        
    }).then(function(){
        statisticService.exchanges($scope.myLevel.levelNumber).then(function(result) {
            if (Object.keys(result).length > 0) {
                $scope.hasExchanges = true;
                $scope.exchanges = result;
            }
            $scope.loaded = true;
        });

    });

    $scope.getLevelData = function(myLevel){

        if(myLevel.levelNumber == 1){
            statisticService.exchangeCountByReceiver(myLevel.levelNumber).then(function(result) {
                $scope.exchangeCountByReceiver = result;
            });
            statisticService.exchanges(myLevel.levelNumber).then(function(result) {
                if (Object.keys(result).length > 0) {
                    $scope.hasExchanges = true;
                }
                else{
                    $scope.hasExchanges = false;
                }
                $scope.exchanges = result;
                $scope.loaded = true;
            });
       }

        if(myLevel.levelNumber == 2){
            statisticService.exchangeCountByReceiverForLevelSubleveled(myLevel.levelNumber + '1',myLevel.levelNumber + '2').then(function(result) {
            $scope.exchangeCountByReceiver = result;
        }); 
           statisticService.exchangesForLevelSubleveled(myLevel.levelNumber + '1',myLevel.levelNumber + '2').then(function(result) {
               if (Object.keys(result).length > 0) {
                    $scope.hasExchanges = true;
                }
                else{
                    $scope.hasExchanges = false;
                }
            $scope.exchanges = result;
            $scope.loaded = true;
           
        });
       }

       if(myLevel.levelNumber == 3){
            statisticService.exchangeCountByReceiverForLevelSubleveled(myLevel.levelNumber + '1',myLevel.levelNumber + '2').then(function(result) {
            $scope.exchangeCountByReceiver = result;
        }); 
           statisticService.exchangesForLevelSubleveled3(myLevel.levelNumber + '1').then(function(result) {
               if (Object.keys(result).length > 0) {
                    $scope.hasExchanges = true;
                    $scope.exchanges3A = result;
                }
                else{
                    if(!$scope.hasExchanges){
                     $scope.hasExchanges = false;
                    }
                }
            $scope.loaded = true;
           
        });
            statisticService.exchangesForLevelSubleveled3(myLevel.levelNumber + '2').then(function(result) {
               if (Object.keys(result).length > 0) {
                    $scope.hasExchanges = true;
                    $scope.exchanges3B = result;
                }
                else{
                    if(!$scope.hasExchanges){
                     $scope.hasExchanges = false;
                    }
                }
        });
        $scope.loaded = true;
       }

       if(myLevel.levelNumber == 4){
            statisticService.exchangeCountByReceiver(myLevel.levelNumber).then(function(result) {
                $scope.exchangeCountByReceiver = result;
            });
            statisticService.exchanges(myLevel.levelNumber).then(function(result) {
                if (Object.keys(result).length > 0) {
                    $scope.hasExchanges = true;
                }
                else{
                    $scope.hasExchanges = false;
                }
                $scope.exchanges = result;
                $scope.loaded = true;
            });
       }
       

};   

$scope.score = {
    withHelp: 'AT',
    withPartialHelp: 'AP',
    withoutHelp: '✓'
};
});

communicatorApp.filter('yes_no_spanish', function() {
    return function(text, length, end) {
        if (text == 'withoutHelp') {
            return 'Si';
        }
        if (text !== undefined) {
            return 'No';
        }
        return 'NA';
    };
});

communicatorApp.filter('oral_output', function() {
    return function(text, length, end) {
        if (text == 'ne') {
            return 'Ninguna';
        }
        if (text == 'gl') {
            return 'Llanto';
        }
        if (text == 'risa') {
            return 'Risa';
        }
        if (text == 'vc') {
            return 'Vocal/Consonante';
        }
        if (text == 'sil') {
            return 'Sílaba';
        }
        if (text == 'pnrdie') {
            return 'Palabra NRI';
        }
        if (text == 'prdie') {
            return 'Palabra RI';
        }
        return 'NA';
    };
});

communicatorApp.filter('level_sublevel', function() {
    return function(text, length, end) {
        if (text == '21') {
            return 'Receptor';
        }
        if (text == '22') {
            return 'Dispositivo';
        }
        if (text == '31') {
            return 'IIIA';
        }
        if (text == '32') {
            return 'IIIB';
        }
    };
});

communicatorApp.filter('reaction', function() {
    return function(text, length, end) {
        if (text == 'reactionNegative') {
            return 'Sí';
        }
        if (text == 'reactionPositive') {
            return 'No';
        }
    };
});

communicatorApp.filter('discrimination', function() {
    return function(text, length, end) {
        if (text == 'favorite') {
            return 'Favorito';
        }
        if (text == 'distractor') {
            return 'Distractor';
        }
    };
});
