describe('Unit: ChatCtrl', function() {
  // Load the module with MainController
  beforeEach(module('sampleApp', 'firebase'));

  var chatCtrl, usersCtrl, usersScope, chatScope, usersFirebase, chatFirebase;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $firebase) {
    // Create a new scope that's a child of the $rootScope
    chatScope = $rootScope.$new();
    // Create the controller
    chatCtrl = $controller('ChatCtrl', {
      $scope: chatScope,
      $firebase: chatFirebase
    });

    usersScope = $rootScope.$new();
    // Create the controller
    usersCtrl = $controller('UsersCtrl', {
      $scope: usersScope,
      $firebase: usersFirebase

    });
 
  }));

  it('should get the length of the user and verify it to be 8 in size', 
    function() {
      console.log("--> in TC #1");
      var length = chatScope.userLength;
      console.log(chatScope.user + " :-: " + length);

      expect(chatScope.userLength).toBe(8);
  });
  it('should pass if it gets a fireBaseArray which is not null', 
    function() {
      console.log("--> In TC #2 - Got a Firebase array that is not null!");
      console.log(usersScope.users);
      expect(usersScope.users).not.toBeNull();
  });
    it('should test if can connect to firebase to firebase',
      function() {
         usersFirebase = new Firebase('https://marketsquare.firebaseio.com/groups');  
        var key = usersFirebase.key();
        console.log(key);
      });
})