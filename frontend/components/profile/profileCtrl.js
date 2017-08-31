/**
 * 
 */

(function() {
	'use strict';
	
	angular
		.module('app')
		.controller('profileController', profileController);
	
	function profileController($http, store) {
		
		var vm = this; //view model
		
		vm.getPublicInfo = getPublicInfo;
		vm.getPrivateInfo = getPrivateInfo;
		vm.getStudents = getStudents;
		vm.deleteStudent = deleteStudent;
		vm.addStudent = addStudent
		vm.info;
		
		vm.profile = store.get('profile');
		
		function deleteStudent(idStudent){
			console.log("delete: "+idStudent);
			$http.delete('http://192.168.99.100:8081/api/students/'+idStudent,{}).then(function(response) {
				vm.info = vm.info.filter(function(element){
					  return element.idStudent !== idStudent;
				});
				console.log(vm.info)
			}, function(error){
				console.log('teste');
				console.log(error);
			});
		}
		
		function addStudent(name){
			console.log("Add New Aluno: "+name);
			
			var noteData = {
				    "name":name,
				}

				var req = {
				    method: 'POST',
				    url: 'http://192.168.99.100:8081/api/students',
				    data: noteData
				}

				$http(req).then(function(reponse){
					vm.info.push(reponse.data)
				    console.log(reponse.data);
				});
		}
		
		function getPublicInfo(){
			console.log("public");
			$http.get('http://192.168.99.100:8081/api/public',{
				skipAuthorization: true
			}).then(function(response) {
				vm.info = response.data;
			});
		}
		
		function getPrivateInfo(){
			console.log("private");
			$http.get('http://192.168.99.100:8081/api/private').then(function(response) {
				vm.info = response.data;
			});
		}
		
		function getStudents(){
			$http.get('http://192.168.99.100:8081/api/students').then(function(response) {
				vm.info = response.data;
			});
		}
		
	}
	
})();