/**
 * 
 */

(function() {
	
	'use strict';
	
	angular
		.module('app')
		.directive('toolbar', toolbar);
	
	function toolbar() {
		return {
			templateUrl: 'components/toolbar/toolbar.tpl.html',
			controller: toolbarController,
			controllerAs: 'toolbar'
		}
	}
	
	function toolbarController(auth, store, $location) {
		
		var vm = this; //view model
		vm.login = login;
		vm.logout = logout;
		vm.auth = auth;
		
		function login() {
			auth.signin({}, function(profile, token) {
				//success
				store.set('profile',profile);
				store.set('token',token);
				$location.path('/home');  //could be the entry point of the application
			}, function(error) {
				console.log(error);
			});
		}
		
		
		function logout(){
			store.remove('profile');
			store.remove('token');
			auth.signout();
			$location.path('/home'); //could be the login page
		}
	}
	
})();