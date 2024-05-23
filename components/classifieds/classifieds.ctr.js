(function() {

  "use strict";

  angular
    .module('ngClassifieds')
    .controller('classifiedsController', function($scope, $mdSidenav, $mdDialog, $mdToast, classifiedsFactory) {

      classifiedsFactory.getClassifieds().then(function(data) {
        $scope.classifieds = data.data;
        $scope.categories = getCategories($scope.classifieds);
      });

      var contact = {
        name: "Ryan Chenkie", 
        phone: "(555) 555-5555",
        email: "ryanchenkie@gmail.com"
      }

      function showToast(message) {
        $mdToast.show(
          $mdToast.simple()
            .content(message)
            .position('top, right')
            .hideDelay(3000)
        );
      }

      $scope.openSidebar = function() {
        $scope.sidebarTitle = 'Add a Classified';
        $mdSidenav('left').open();
      }

      $scope.closeSidebar = function() {
        $scope.classified = {};
        $mdSidenav('left').close();
      }

      $scope.saveClassified = function(classified) {
        if(classified) {
          $scope.classified.contact = contact;
          $scope.classifieds.push(classified);
          $scope.classified = {};
          $scope.closeSidebar();
          showToast('Classified Saved');
        }
      }

      $scope.editClassified = function(classified) {
        $scope.editing = true;
        $scope.sidebarTitle = 'Edit Classified';
        $scope.classified = classified;
        $mdSidenav('left').open();
      }

      $scope.saveEdit = function() {
        $scope.editing = false;
        // Need to clear the form after, or else it will be populated when we go to add new classifieds
        $scope.classified = {};
        $mdSidenav('left').close();
        showToast('Edit Saved');
      }

      $scope.deleteClassified = function(event, classified) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete ' + classified.title + '?')
            .targetEvent(event)
            .ok('Yes')
            .cancel('No');
        $mdDialog.show(confirm).then(function() {
          var index = $scope.classifieds.indexOf(classified);
          $scope.classifieds.splice(index, 1);
          showToast('Classified Deleted');
        }, function() {
          $scope.status = classified.title + ' is still here.';
        });
      };

    });
    
    function getCategories(classifieds) {

        var categories = [];

        angular.forEach(classifieds, function(ad) {
          angular.forEach(ad.categories, function(category) {
            categories.push(category);
          });
        });

        return _.uniq(categories);
      }

})();