//a controller asociates a dom element and all of its childres with a javascript module

var app = angular.module("minmax", ['jcs-autoValidate', 'angular-ladda']);

app.run(function (defaultErrorMessageResolver) {
    defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
        errorMessages['tooYoung'] = 'You must be at least {0} years old to use this site';
        errorMessages['badUserName'] = 'User name can only contain numbers and letters';
    });
});

app.controller('MinMaxCtrl', function ($scope, $http) {
    $scope.formData = {};
    $scope.onSubmit = function () {

        $scope.submitting = true;
        /*var promise = $http({
            method:'post',
            url:'https://minmax-server.herokuapp.com/register/',
            data:$scope.formData});
        
        promise.then(function(response){
            var data= response.data; 
                console.log(':)');
        },function(){
            console.log(':(');
        })
        */
        if ($scope.editForm.$invalid)
            return;

        $http.post('https://minmax-server.herokuapp.com/register/', $scope.formData)
            .success(function (response) {
                var data = response.data;
                console.log(':)');
                $scope.submitting=false;
            }).error(function (data) {
                console.log(':(' + data);
                $scope.submitting=false;
            });

    };

});
