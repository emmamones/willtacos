var app = angular.module('codecraft', [
	'ngResource', 'infinite-scroll',
	'angularSpinner',
	'jcs-autoValidate',
	'angular-ladda',
	'mgcrea.ngStrap',
	'toaster',
	'ngAnimate'
]);


app.config(function ($httpProvider, $resourceProvider, laddaProvider,$datepickerProvider) {
	$httpProvider.defaults.headers.common['Authorization'] = 'Token 3577903640a392f39fa51f09cdf33749976d0ff0';
	$resourceProvider.defaults.stripTrailingSlashes = false;

	laddaProvider.setOption({
		style: 'expand-right'
	});
	angular.extend($datepickerProvider.defaults, {
		dateFormat: 'd/M/yyyy',
		autoclose: true
	});
});

app.factory('Contact', function ($resource) {
	return $resource("https://api.codecraft.tv/samples/v1/contact/:id/", { id: '@id' }, {
		update: {
			method: 'PUT'
		}
	});
});



app.controller('PersonDetailController', function ($scope, ContactService) {
	$scope.contacts = ContactService;

	$scope.save = function () {
		console.log("saving");
		$scope.contacts.updateContact($scope.contacts.selectedPerson);
	};

	$scope.remove = function () {
		console.log("removING");
		$scope.contacts.removeContact($scope.contacts.selectedPerson);
	};

});

app.controller('PersonListController', function ($scope, ContactService, $modal) {


	$scope.contacts = ContactService;

	$scope.loadMore = function () {
		console.log("loadmore");
		$scope.contacts.loadMore();
	};

	$scope.showCreateModal = function () {
		$scope.contacts.selectedPerson = {};
		$scope.createModal = $modal({
			scope: $scope,
			template: 'templates/modal.create.tpl.html',
			show: true
		});
	};

	$scope.createContact = function () {
		console.log("createContact");
		$scope.contacts.createContact($scope.contacts.selectedPerson)
			.then(function () {
				$scope.createModal.hide();
			});
	};

	// $scope.sensitiveSearch = function (person) {
	// 	if ($scope.search) {
	// 		return person.name.indexOf($scope.search) == 0 ||
	// 			person.email.indexOf($scope.search) == 0;
	// 	}
	// 	return true;
	// };

	$scope.$watch('search', function (newVal, oldVal) {
		if (angular.isDefined(newVal)) {
			console.log("searching");
			$scope.contacts.doSearch(newVal);
		}
	});


	$scope.$watch('order', function (newVal, oldVal) {
		if (angular.isDefined(newVal)) {
			console.log("ordering");
			$scope.contacts.doOrder(newVal);
		}
	});

});

app.service('ContactService', function (Contact, $q,toaster) {

	var self = {
		'addPerson': function (person) {
			this.persons.push(person);
		},
		'page': 1,
		'hasMore': true,
		'isLoading': false,
		'isSaving': false,
		'isDeleting': false,
		'selectedPerson': null,
		'persons': [],
		'search': null,
		'ordering': null,
		'resetValues': function () {
			self.hasMore = true;
			self.isLoading = false;
			self.isSaving = false;
			self.persons = [];
			self.page = 1;
		},
		'doSearch': function (search) {
			self.resetValues();
			self.search = search;
			self.loadContacts();

		},
		'doOrder': function (order) {
			self.resetValues();
			self.ordering = order;
			self.loadContacts();
		},
		'loadContacts': function () {

			if (self.hasMore && !self.isLoading) {
				self.isLoading = true;

				console.log("pageINdex :" + self.page);
				var params = {
					'page': self.page,
					'search': self.search,
					'ordering': self.ordering
				};

				Contact.get(params, function (data) {
					console.log(data);

					angular.forEach(data.results, function (person) {
						self.persons.push(new Contact(person));
					})

					if (!data.next) {
						self.hasMore = false;
					}
					self.isLoading = false;
				});
			}
		},
		'loadMore': function () {

			if (self.hasMore && !self.isLoading) {
				self.page += 1;
				self.loadContacts();
			}
		}, 'updateContact': function (person) {

			if (!self.isSaving && !self.isLoading) {
				console.log(person);
				self.isSaving = true;
				person.$update().then(function () {
					self.isSaving = false;
					toaster.pop('success','Updated'+ person.name);
				});
			}
		}, 'removeContact': function (person) {

			if (!self.isDeleting && !self.isLoading) {
				console.log(person);
				self.isDeleting = true;
				person.$remove().then(function () { 
					var index = self.persons.indexOf(person);
					self.persons.splice(index, 1);
				 	toaster.pop('success','deleted'+ person.name);
					self.isDeleting = false;
					self.selectedPerson = null;
				});
			}
		}, 'createContact': function (person) {
			if (!self.isSaving && !self.isLoading) {
				
				var finish = $q.defer();

				console.log(person);
				self.isSaving = true;
				Contact.save(person).$promise.then(function () {
					self.resetValues();
					self.selectedPerson = null;
					self.loadContacts();
					toaster.pop('success','Created'+ person.name);
					finish.resolve();
				});

				return finish.promise;
			}
		}
	};



	self.loadContacts();
	return self;

});