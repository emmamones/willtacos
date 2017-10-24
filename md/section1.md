# From zero to hero
## doing http call
  
Hello world!
We will output Markdown to:
- HTML
- docx
- PDF

## Performing validation

we can do validation with :
-html5
-with angular
-with angular auto validate

```html
<form ng-submit="onSubmit()">
<button class="btn btn-primary"  type="submit" />
```			
-with angular
```html
<form novalidate="novalidate" ng-submit="onSubmit()" name="editForm">

<button class="btn btn-primary"></button >
```
same time we can provide more info about the errors
```html
<div class="form-group" ng-class=" {
		   'has-error':!editForm.email.$valid && (!editForm.email.$pristine || editForm.$submitted),
		   'has-success':editForm.email.$valid && (!editForm.email.$pristine || editForm.$submitted)
		   }">
			<label for="email" class="control-label">Email</label >
			<input type="email" name="email"
			       class="form-control"
			       ng-model="formData.email"
			       id="email" required="required">
		    <p class="help-block" ng-show="editForm.email.$error.required && (!editForm.email.$pristine || editForm.$submitted)">
			This Field is required	
			</p>
			 <p class="help-block" ng-show="editForm.email.$error.email && (!editForm.email.$pristine || editForm.$submitted)">
   			please enter an email with at least @ symbol
			</p> 
			  <pre>email error: {{editForm.$error | json}}</pre>
		    <pre>email error: {{editForm.email.$error | json}}</pre>
			<pre>email Valid {{editForm.email.$valid}}</pre>
		</div > 
```
--AutoValidate
include the js reference,modify your angular module
``` javascript
<script src="../libs/angular-auto-validate/dist/jcs-auto-validate.min.js"></script >
var app = angular.module("minmax", ['jcs-autoValidate']);
```
```html 

	<div class="form-group" >
    <label for="sex"></label>
	<select class="form-control" ng-model="formData.sex"  id="sex" name="sex" required="required" >
		<option value="">Please Choose</option>
		<option value="male">Male</option>
		<option value="female">Female</option>
	</select>
    </div>

    <div class="form-group" >
			<label for="age" class="control-label" >Age</label >
			<input type="number"  class="form-control" ng-model="formData.age" id="age" name="age" required="required" min="18" max="64" ng-min-err-type="tooYoung" >
	</div >

 

```
you have to wrap your control and label inside a form-group DIV!
if we want to customize the error messages wi will need to preset this values 
``` javascript
app.run(function (defaultErrorMessageResolver) {
    defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
        errorMessages['tooYoung'] = 'You must be at least {0} years old to use this site';
        errorMessages['badUserName'] = 'User name can only contain numbers and letters';
    });
});
```
and the use it in html
```html 
<div class="form-group" >
			<label for="age" class="control-label" >Age</label >
			<input type="number"  class="form-control" ng-model="formData.age" id="age" name="age" required="required" min="18" max="64" ng-min-err-type="tooYoung" >
	</div >
```
##Adding ladda Buttons
install lada with bower
add css style and javascript reference
```html 
	<link href="../libs/ladda/dist/ladda-themeless.min.css" rel="stylesheet">
   <script src="../libs/angular-ladda/dist/spin.min.js"></script >
<script src="../libs/angular-ladda/dist/ladda.min.js"></script >
<script src="../libs/angular-ladda/dist/angular-ladda.min.js"></script >
```
    add it to the angular module

``` javascript
var app = angular.module("minmax", ['jcs-autoValidate','angular-ladda']);
```
``` javascript
   $http.post('https://minmax-server.herokuapp.com/register/', $scope.formData)
            .success(function (response) {
                var data = response.data;
                console.log(':)');
                $scope.submitting=false;
            }).error(function (data) {
                console.log(':(' + data);
                $scope.submitting=false;
            });

	<button class="btn btn-primary"  ladda="submitting" data-style="expand-right" type="submit" >
			<span ng-show="submitting">Registering</span>
			<span ng-show="!submitting">Register</span>
			</button >

``` 