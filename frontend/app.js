'use strict'

angular
	.module('app', ['auth0', 'angular-storage','angular-jwt','ngMaterial','ui.router'])
	.config(function($provide, authProvider, $urlRouterProvider, $stateProvider, $httpProvider, jwtInterceptorProvider, jwtOptionsProvider, $injector) {
		
		authProvider.init({
			domain: 'adriano-fonseca.auth0.com',
			clientID: 'dfBT1qpRBvlmDDInHttYBsotMY8AteDT'
		});
		
		
		jwtInterceptorProvider.tokenGetter = function(store){
			return store.get('token');
		}
		
		/*Define which domains can send us request*/
		jwtOptionsProvider.config({
		      whiteListedDomains: ['localhost','192.168.99.100','192.168.99.101','192.168.99.103']
	    });
		
		
		$urlRouterProvider.otherwise('/home');
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'components/home/home.tpl.html'
			})
			
			.state('profile', {
				url: '/profile',
				templateUrl: 'components/profile/profile.tpl.html',
				controller: 'profileController as user'
			});
			
			
		function redirect($q, $injector, store, $location) {
			
			return{
				responseError: function(rejection) {
					if(rejection.status === 401){
						$injector.get('auth').signout();
						store.remove('profile');
						store.remove('token');
						$location.path('/home');
					}
					
					return $q.reject(rejection);
				}
			}
		}
		
		$provide.factory('redirect', redirect);
		$httpProvider.interceptors.push('redirect')
		$httpProvider.interceptors.push('jwtInterceptor')
	})
	.run(function($rootScope, auth, store,jwtHelper, $location) {
		
		//Fired every time that the location change or when the page is refreshed
		$rootScope.$on('$locationChangeStart', function() {
			
			var token = store.get('token');
			if(token) {
				if(!jwtHelper.isTokenExpired(token)){
					if(!auth.isAuthenticated){
						auth.authenticate(store.get('profile'), token);
					}
				}
			}else {
				$location.path('/home');
			}
		});  
	});
