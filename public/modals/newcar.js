mainModule.controller('NewCarController', ['$scope', 'ModalService', function($scope, ModalService) {

  $scope.close = function(result) {
 	  close(result, 500); // close, but give 500ms for bootstrap to animate
  };

  $scope.showYesNo = function() {

    ModalService.showModal({
      templateUrl: "modals/newcar-template.html",
      controller: "NewCarController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        $scope.yesNoResult = result ? "You said Yes" : "You said No";
      });
    });

  };
}]);