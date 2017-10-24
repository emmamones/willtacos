# From zero to hero
## Handling Clicks and Display Data
  
- NG Repeat
- docx
- PDF

## NG Repeat

help to iterate tthrough the data in the scope.

ng-style can also accept validations with ternary operators.
```html
<table class="table table-bordered">
			<tr>
				<th>#</th>
				<th>Name</th>
				<th>Email</th>
				<th>Birthday</th>
			</tr>
			<tr ng-repeat="person in persons" ng-click="SelectPerson(person)"
			    ng-style="{
					    	'background-color': 
						   person.name===selectedPerson.name ? 'lightgray' : 'white'
					    	}">
				<td>{{$index}}</td>
				<td>{{person.name}}</td>
				<td>{{person.email}}</td>
				<td>{{person.birthdate | date:"longDate"}}</td>
			</tr>
		</table>
```			 
in the same way i can make it iterate an Object properties
``` html
<div ng-repeat="(key, value) in selectedPerson">
				<dl ng-if="key === 'birthdate' ">
					<dt> {{key}}</dt >
					<dd> {{value | date:"longDate"}}</dd>					
				</dl>
				<dl ng-if="key !== 'birthdate' ">
					<dt> {{key}}</dt >
					<input type="text" ng-model="selectedPerson[key]">
				</dl>
``` 