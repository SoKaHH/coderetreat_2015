'use strict';

describe('Controller: GameController', function () {

    beforeEach(function () {
        // load app module
        module('GameOfLiveApp');
    });

    var controller,
        rootScope,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$rootScope_, _$controller_) {
        scope = _$rootScope_.$new();
        rootScope = _$rootScope_;
        // init mocks
        controller = _$controller_('GameController', {
            $scope: scope
        });
    }));

    it('should init successfully', function () {
        scope.$apply();
        expect(scope.stop).toBe(false);
        expect(scope.loopActive).toBe(false);
    });


});