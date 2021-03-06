communicatorApp.service('serverService', function($http, $q, configurationService) {
    return {
        timeout: 20,
        getBaseURL: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (this.baseURL) {
                deferred.resolve(this.baseURL);
            } else {
                promise = configurationService.get("server_base_url"); 
            }
            return promise;
        },
        setBaseURL: function(baseURL) {
            if(baseURL !== undefined) {
                this.baseURL = baseURL;
                configurationService.set("server_base_url", baseURL);
            }
        },
        send: function(json) {
            var self = this;
            configurationService.get("autosync_enabled").then(function(autoSyncEnabled) {
                if (autoSyncEnabled === "true" && navigator.onLine) {
                    self.post({ value: json });
                } else {
                    configurationService.insert({ key: "data_to_sync", value: JSON.stringify(json) }).then(function() {
                        if (autoSyncEnabled === "true" && !navigator.onLine) {
                            self.sync();
                        }
                        if(self.getDataToSyncCount() >= 50) {
                            self.clearSyncData();
                        }
                    });
                }
            });
        },
        sync: function() {
            var self = this;
            var deferred = $q.defer();

            if (navigator.onLine) {
                this.timeout = 20;
                configurationService.find("data_to_sync").then(function(configurations) {
                    configurations.forEach(function(configuration, index) {
                        setTimeout(function() {
                            self.post(configuration);
                        }, index * 20);
                    });
                    if (configurations.length) {
                        deferred.resolve(self.syncTime());
                    }
                });
            } else {
                setTimeout(this.sync.bind(this), this.timeout);
                this._incrementTimeout();
                deferred.reject();
            }
            return deferred.promise;
        },
        post: function(configuration) {
            var self = this;
            var stringifiedData = typeof(configuration.value) === "string" ? configuration.value : JSON.stringify(configuration.value);

            this.getBaseURL().then(function(baseURL) {
                if (!baseURL) { return; }

                $.post(self._addProtocol(baseURL) + "/exchanges", { data: stringifiedData }).complete(function() {
                    if (configuration.id) {
                        configurationService.delete(configuration);
                    }
                });

                configurationService.set("server_last_sync_time", self.syncTime());
            });
        },
        syncTime: function() {
            return new Date().toString();
        },
        setAutoSync: function(value) {
            configurationService.set("autosync_enabled", !!value);
        },
        clearSyncData: function() {
            configurationService.deleteByKey("data_to_sync");
        },
        getDataToSyncCount: function() {
            var count = localStorage.getItem('data_to_sync_count');
            if (count === null) {
                configurationService.find("data_to_sync").then(function(configurations) {
                    count = configurations.length;
                    localStorage.setItem('data_to_sync_count', count);
                });
            }
            return count;
        },
        getCurrentConfiguration: function() {
            return configurationService.getMultiple({
                "server_last_sync_time": "lastSyncTime",
                "autosync_enabled": "autoSyncEnabled",
                "data_to_sync": "dataToSync"
            });
        },
        _incrementTimeout: function() {
            if (this.timeout < 20000) {
                this.timeout = this.timeout * 1.5;
            }
        },
        _addProtocol: function(url) {
            return url.search(/^(https?:\/\/)/) !== -1 ? url : "http://" + url;
        }
    };
});
