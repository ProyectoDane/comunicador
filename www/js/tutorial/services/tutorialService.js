communicatorApp.service('tutorialService', function($state, $ionicPopup, $timeout) {
    var popup;
    var closeEvent = {
        attach: function() {
            closeEvent.remove();
            document.addEventListener('click', closeEvent.event, false);
        },
        event: function(event) {
            if (event.target.classList.contains('closeTutorial')) {
                closeEvent.remove();
                popup.close();
                $state.transitionTo("app.home");
            }
        },
        remove: function() {
            document.removeEventListener('click', closeEvent.event);
        }
    };

    return {
        closeHTML: '&nbsp;<span class="closeTutorial">close</span>',
        showIfActive: function() {
            switch($state.current.name) {
                case 'tutorialHome':
                    this.step('Iniciar nivel.', 'Este tutorial te llevará a través de las funciones básicas de la aplicación.<br/><br/>Para comenzar una actividad se debe presionar IR', {
                        back: function() {
                            $state.transitionTo("app.home");
                        },
                        next: function() {
                            $state.transitionTo("tutorialLevelCards", { levelNumber: 1 });
                        }
                    });
                    closeEvent.attach();
                    break;
                case 'tutorialLevelCards':
                    this.step('Seleccionar pictograma', 'Al comenzar un intercambio se debe seleccionar un pictograma de la lista.<br/>En esta sección solo se mostraran los pictogramas habilitados', {
                        back: function() {
                            $state.transitionTo("tutorialHome");
                        },
                        next: function() {
                            $state.transitionTo("tutorialLevelSingleCard", { id: 1 });
                        }
                    });
                    break;
                case 'tutorialLevelSingleCard':
                    this.step('Intercambio', 'Se muestra el pictograma para que pueda ser visto claramente y entregado al receptor por el usuario.<br /><br />Para puntuar el intercambio, puede presionarce el botón de menú o mantener precionado sobre la imagen', {
                        back: function() {
                            $state.transitionTo("tutorialLevelCards", { levelNumber: 1 });
                        },
                        next: function() {
                            $state.transitionTo("tutorialPatternLock");
                        }
                    });
                    break;
                case 'tutorialPatternLock':
                    this.step('Registrar intercambio', 'Al registrar un intercabio se deben seleccionar los comportamientos que ocurrieron durante el mismo.', {
                        back: function() {
                            $state.transitionTo("tutorialLevelSingleCard", { id: 1 });
                        },
                        next: function() {
                            $state.transitionTo("app.home").then(function() {
                                var lastPopup = $ionicPopup.alert({
                                    title: 'Fin!',
                                    template: 'Eso es todo ya puedes realizar intercambios! <br />Para ver el tutorial nuevamente, puedes iniciarlo desde Menú -> Configuración.'
                                });
                                $timeout(function() {
                                    lastPopup.close(); 
                                }, 3000);

                                closeEvent.remove();
                            });
                        }
                    });
                    break;
            }
        },
        step: function(title, description, callbackTransitions) {
            popup = $ionicPopup.confirm({
                title: title + this.closeHTML,
                template: description,
                buttons: [{
                    text: 'Volver',
                    onTap: callbackTransitions.back
                }, {
                    text: 'Seguir',
                    type: 'button-positive',
                    onTap: callbackTransitions.next
                }]
            });
        }
    };
});