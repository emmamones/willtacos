var app = angular.module("codecraft", [
  "ngResource",
  "infinite-scroll",
  "angularSpinner",
  "jcs-autoValidate",
  "angular-ladda",
  "mgcrea.ngStrap",
  "toaster",
  "ngAnimate"
]);

app.config(function(
  $httpProvider,
  $resourceProvider,
  laddaProvider,
  $datepickerProvider
) {
  // $httpProvider.defaults.headers.common['Authorization'] = 'Token 20002cd74d5ce124ae219e739e18956614aab490';
  // $resourceProvider.defaults.stripTrailingSlashes = false;
  laddaProvider.setOption({
    style: "expand-right"
  });
  angular.extend($datepickerProvider.defaults, {
    dateFormat: "d/M/yyyy",
    autoclose: true
  });
});

app.factory("Contact", function($resource,$http) {
  function Contact() {
    return {
      getData: function() {
        return  $http.get("/section7/contactlist");
      }
    };
  }

  return Contact;
});

app.controller("PersonDetailController", function($scope, ContactService) {
  $scope.contacts = ContactService;

  $scope.save = function() {
    $scope.contacts.updateContact($scope.contacts.selectedPerson);
  };

  $scope.remove = function() {
    $scope.contacts.removeContact($scope.contacts.selectedPerson);
  };
});

app.controller("PersonListController", function(
  $scope,
  $modal,
  ContactService
) {
  $scope.isLoading = false;
  $scope.search = "";
  $scope.order = "email";
  $scope.contacts = ContactService;

  $scope.loadMore = function() {
    console.log("Load More!!!");
    $scope.contacts.loadMore();
  };

  $scope.showCreateModal = function() {
    $scope.contacts.selectedPerson = {};
    $scope.createModal = $modal({
      scope: $scope,
      template: "../templates/modal.create.tpl.html",
      show: true
    });
  };

  $scope.createContact = function() {
    console.log("createContact");
    $scope.contacts
      .createContact($scope.contacts.selectedPerson)
      .then(function() {
        $scope.createModal.hide();
      });
  };

  $scope.$watch("search", function(newVal, oldVal) {
    if (angular.isDefined(newVal)) {
      $scope.contacts.doSearch(newVal);
    }
  });

  $scope.$watch("order", function(newVal, oldVal) {
    if (angular.isDefined(newVal)) {
      $scope.contacts.doOrder(newVal);
    }
  });
});

app.service("ContactService", function(Contact, $q, toaster) {
  var self = {
    addPerson: function(person) {
      this.persons.push(person);
    },
    page: 1,
    hasMore: true,
    isLoading: false,
    isSaving: false,
    selectedPerson: null,
    persons: [],
    search: null,
    doSearch: function(search) {
      self.hasMore = true;
      self.page = 1;
      self.persons = [];
      self.search = search;
      self.loadContacts();
    },
    doOrder: function(order) {
      self.hasMore = true;
      self.page = 1;
      self.persons = [];
      self.ordering = order;
      self.loadContacts();
    },
    loadContacts: function() {
      if (self.hasMore && !self.isLoading) {
        self.isLoading = true;

        var params = {
          page: self.page,
          search: self.search,
          ordering: self.ordering
        };

        var updateEquipmentStatusHub = Contact();

       var promise= updateEquipmentStatusHub.getData();
       promise.then(function(response) {
          self.persons = response.data;
          self.isLoading = false;
          console.log(response);
        }),function(response){
          console.log(response);
        };
      }
    },
    loadMore: function() {
      if (self.hasMore && !self.isLoading) {
        self.page += 1;
        self.loadContacts();
      }
    },
    updateContact: function(person) {
      console.log("Service Called Update");
      self.isSaving = true;
      person.$update().then(function() {
        self.isSaving = false;
        toaster.pop("success", "Updated " + person.name);
      });
    },
    removeContact: function(person) {
      self.isDeleting = true;
      person.$remove().then(function() {
        self.isDeleting = false;
        var index = self.persons.indexOf(person);
        self.persons.splice(index, 1);
        self.selectedPerson = null;
        toaster.pop("success", "Deleted " + person.name);
      });
    },
    createContact: function(person) {
      var d = $q.defer();
      self.isSaving = true;
      return d.resolve;
    }
  };

  self.loadContacts();

  return self;
});
