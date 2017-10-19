var app = angular.module('codecraft', [
	'ngResource', 'infinite-scroll',
	'angularSpinner',
	'jcs-autoValidate',
	'angular-ladda',
	'mgcrea.ngStrap',
	'toaster',
	'ngAnimate'
]);


app.config(function ($httpProvider, $resourceProvider, laddaProvider, $datepickerProvider) {

	laddaProvider.setOption({
		style: 'expand-right'
	});
	angular.extend($datepickerProvider.defaults, {
		dateFormat: 'd/M/yyyy',
		autoclose: true
	});
});

app.controller('NavController', function ($scope) {


	$scope.navConfigs = [
		{
			rowDetail: [
				{
					bluprint:{ col: 0, row:0},
					entity: { status: 1, name: "Home", url: "home", terminal: null }
				},
				{
				bluprint: { col: 1, row:0},
					entity: { status: 1, name: "Next", url: "Next", terminal: null }
				}]
		},
		{ 
			 rowDetail: [
				{
					bluprint: { col: 0, row:1},
					entity: { status: 1, name: "temps", url: "temps", terminal: null }
				},
				{
				bluprint:{ col: 1, row:1},
					entity: { status: 1, name: "KPI", url: "KPI", terminal: null }
				}]
		}];


});
