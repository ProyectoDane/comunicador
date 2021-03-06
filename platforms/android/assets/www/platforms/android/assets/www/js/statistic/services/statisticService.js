communicatorApp.service('statisticService', function($q,
                                                    receiverDbService, exchangeDbService,
                                                    exchangeByCardDbService, exchangeByLevelDbService,
                                                    cardDbService,
                                                    scoreByExchangeDbService, scoreDbService,
                                                    stepDbService, relationshipDbService) {
    var r   = receiverDbService;
    var rl  = relationshipDbService;
    var e   = exchangeDbService;
    var ebc = exchangeByCardDbService;
    var ebl = exchangeByLevelDbService;
    var c   = cardDbService;
    var c1   = cardDbService;
    var c2   = cardDbService;
    var sbe = scoreByExchangeDbService;
    var s   = scoreDbService;
    var sp  = stepDbService;

    var receiverRelationshipField = 'CASE WHEN '+ r.prop('relationshipName') + ' IS NULL THEN ' + rl.prop('name') + ' ELSE '+ r.prop('relationshipName') +' END as receiverRelationship';

    receiverDbService
        .define("exchangeCountByReceiver", function(myLevel) {
            return {
                query: 'SELECT avatar as receiverAvatar, '+ receiverRelationshipField +', COUNT(receiverId) as count FROM ' + this.tableName +
                       ' LEFT JOIN ' + e.tableName + ' ON ' + this.prop('id') + ' = receiverId' +
                       ' LEFT JOIN ' + rl.tableName + ' ON ' + this.prop('relationshipId') + ' = ' + rl.prop('id') +
                       ' LEFT JOIN ' + ebl.tableName + ' ON ' + ebl.prop('exchangeId') + ' = ' + e.prop('id') +
                       ' WHERE ' + ebl.prop('levelId') + ' = ? ' + 
                       ' GROUP BY receiverId, ' + r.prop('name'),
                args: [myLevel]
            };
        });

    receiverDbService
        .define("exchangeCountByReceiverForLevelSubleveled", function(subLevel1,subLevel2) {
            return {
                query: 'SELECT avatar as receiverAvatar, '+ receiverRelationshipField +', COUNT(receiverId) as count FROM ' + this.tableName +
                       ' LEFT JOIN ' + e.tableName + ' ON ' + this.prop('id') + ' = receiverId' +
                       ' LEFT JOIN ' + rl.tableName + ' ON ' + this.prop('relationshipId') + ' = ' + rl.prop('id') +
                       ' LEFT JOIN ' + ebl.tableName + ' ON ' + ebl.prop('exchangeId') + ' = ' + e.prop('id') +
                       ' WHERE ' + ebl.prop('levelId') + ' = ? OR ' + ebl.prop('levelId') + ' = ? ' +
                       ' GROUP BY receiverId, ' + r.prop('name'),
                args: [subLevel1,subLevel2]
            };
        });

    exchangeDbService
        .define("exchanges", function(myLevel) {
            return {
                query: 'SELECT ' +
                            e.prop('id')    + ' as id,' +
                            e.prop('date')  + ' as date,' +
                            receiverRelationshipField + ',' +
                            c.prop('title') + ' as cardTitle,' +
                            s.prop('name')  + ' as scoreName,' +
                            sp.prop('name') + ' as stepName,' +
                            ebl.prop('levelId') + ' as level' + 
                       ' FROM ' + this.tableName +
                       ' JOIN ' + r.tableName   + ' ON ' + r.prop('id') +           ' = ' + this.prop('receiverId') +
                       ' LEFT JOIN ' + rl.tableName + ' ON ' + r.prop('relationshipId') + ' = ' + rl.prop('id') +
                       ' JOIN ' + ebc.tableName + ' ON ' + ebc.prop('exchangeId') + ' = ' + this.prop('id') +
                       ' JOIN ' + c.tableName   + ' ON ' + c.prop('id') +           ' = ' + ebc.prop('cardId') +
                       ' JOIN ' + sbe.tableName + ' ON ' + sbe.prop('exchangeId') + ' = ' + this.prop('id') +
                       ' JOIN ' + s.tableName   + ' ON ' + s.prop('id') +           ' = ' + sbe.prop('scoreId') +
                       ' JOIN ' + sp.tableName  + ' ON ' + sp.prop('id') +          ' = ' + sbe.prop('stepId') +
                       ' JOIN ' + ebl.tableName  + ' ON ' + ebl.prop('exchangeId') + ' = ' + e.prop('id') +
                       ' WHERE ' + ebl.prop('levelId') + ' = ? ' + 
                       ' GROUP BY stepId, ' + e.prop('id') + ' , date, ' + r.prop('name') +', cardTitle, scoreName, stepName, level',
                args: [myLevel]
            };
        });

    exchangeDbService
        .define("exchangesForLevelSubleveled", function(subLevel1,subLevel2) {
            return {
                query: 'SELECT ' +
                            e.prop('id')    + ' as id,' +
                            e.prop('date')  + ' as date,' +
                            receiverRelationshipField + ',' +
                            c.prop('title') + ' as cardTitle,' +
                            s.prop('name')  + ' as scoreName,' +
                            sp.prop('name') + ' as stepName,' +
                            ebl.prop('levelId') + ' as level' +  
                       ' FROM ' + this.tableName +
                       ' JOIN ' + r.tableName   + ' ON ' + r.prop('id') +           ' = ' + this.prop('receiverId') +
                       ' LEFT JOIN ' + rl.tableName + ' ON ' + r.prop('relationshipId') + ' = ' + rl.prop('id') +
                       ' JOIN ' + ebc.tableName + ' ON ' + ebc.prop('exchangeId') + ' = ' + this.prop('id') +
                       ' JOIN ' + c.tableName   + ' ON ' + c.prop('id') +           ' = ' + ebc.prop('cardId') +
                       ' JOIN ' + sbe.tableName + ' ON ' + sbe.prop('exchangeId') + ' = ' + this.prop('id') +
                       ' JOIN ' + s.tableName   + ' ON ' + s.prop('id') +           ' = ' + sbe.prop('scoreId') +
                       ' JOIN ' + sp.tableName  + ' ON ' + sp.prop('id') +          ' = ' + sbe.prop('stepId') +
                       ' JOIN ' + ebl.tableName  + ' ON ' + ebl.prop('exchangeId') + ' = ' + e.prop('id') +
                       ' WHERE ' + ebl.prop('levelId') + ' = ? OR ' + ebl.prop('levelId') + ' = ? ' +
                       ' GROUP BY stepId, ' + e.prop('id') + ' , date, ' + r.prop('name') +', cardTitle, scoreName, stepName, level',
                args: [subLevel1,subLevel2]
            };
        });

    exchangeDbService
        .define("exchangesForLevelSubleveled3", function(subLevel) {
            return {
                query: 'SELECT ' +
                            e.prop('id')    + ' as id,' +
                            e.prop('date')  + ' as date,' +
                            receiverRelationshipField + ',' +
                            'c1.title as cardTitle,' +
                            'c2.title as cardExtraTitle,' +
                            s.prop('name')  + ' as scoreName,' +
                            sp.prop('name') + ' as stepName,' +
                            ebl.prop('levelId') + ' as level' +  
                       ' FROM ' + this.tableName +
                       ' JOIN ' + r.tableName   + ' ON ' + r.prop('id') +           ' = ' + this.prop('receiverId') +
                       ' LEFT JOIN ' + rl.tableName + ' ON ' + r.prop('relationshipId') + ' = ' + rl.prop('id') +
                       ' JOIN ' + ebc.tableName + ' ON ' + ebc.prop('exchangeId') + ' = ' + this.prop('id') +
                       ' LEFT JOIN ' + c.tableName + ' c1 ON c1.id  = ' + ebc.prop('cardId') +
                       ' LEFT JOIN ' + c.tableName + ' c2 ON c2.id  = ' + ebc.prop('cardExtraId') +
                       ' JOIN ' + sbe.tableName + ' ON ' + sbe.prop('exchangeId') + ' = ' + this.prop('id') +
                       ' JOIN ' + s.tableName   + ' ON ' + s.prop('id') +           ' = ' + sbe.prop('scoreId') +
                       ' JOIN ' + sp.tableName  + ' ON ' + sp.prop('id') +          ' = ' + sbe.prop('stepId') +
                       ' JOIN ' + ebl.tableName  + ' ON ' + ebl.prop('exchangeId') + ' = ' + e.prop('id') +
                       ' WHERE ' + ebl.prop('levelId') + ' = ? ' +
                       ' GROUP BY stepId, ' + e.prop('id') + ' , date, ' + r.prop('name') +', cardTitle, scoreName, stepName, level',
                args: [subLevel]
            };
        });

    return {
        exchangeCountByReceiver: function(myLevel) {
            return receiverDbService.exchangeCountByReceiver(myLevel);
        },
        exchangeCountByReceiverForLevelSubleveled: function(subLevel1,subLevel2) {
            return receiverDbService.exchangeCountByReceiverForLevelSubleveled(subLevel1,subLevel2);
        },
        exchanges: function(myLevel) {
            var deferred = $q.defer();

            exchangeDbService.exchanges(myLevel).then(function(result) {
                var exchanges = result.reduce(function(memo, current) {
                    if (!memo[current.id]) {
                        memo[current.id] = current;
                    }
                    memo[current.id][current.stepName] = current.scoreName;
                    return memo;
                }, {});
                deferred.resolve(exchanges);
            });
            
            return deferred.promise;
        },
        exchangesForLevelSubleveled: function(subLevel1,subLevel2) {
            var deferred = $q.defer();

            exchangeDbService.exchangesForLevelSubleveled(subLevel1,subLevel2).then(function(result) {
                var exchanges = result.reduce(function(memo, current) {
                    if (!memo[current.id]) {
                        memo[current.id] = current;
                    }
                    memo[current.id][current.stepName] = current.scoreName;
                    return memo;
                }, {});
                deferred.resolve(exchanges);
            });
            
            return deferred.promise;
        },
        exchangesForLevelSubleveled3: function(subLevel) {
            var deferred = $q.defer();

            exchangeDbService.exchangesForLevelSubleveled3(subLevel).then(function(result) {
                var exchanges = result.reduce(function(memo, current) {
                    if (!memo[current.id]) {
                        memo[current.id] = current;
                    }
                    memo[current.id][current.stepName] = current.scoreName;
                    return memo;
                }, {});
                deferred.resolve(exchanges);
            });
            
            return deferred.promise;
        }
    };
});