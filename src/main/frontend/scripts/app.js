// declare namespace
var GameOfLiveApp = GameOfLiveApp || {};// jshint ignore:line
var app = angular.module('GameOfLiveApp', [ // jshint ignore:line
    'ui.bootstrap',
    'ngTouch',
]);

app.controller('GameController', function ($scope, $timeout) {
    'use strict';

    function init(height, width) {

        var board = [];
        for (var h = 0; h < height; h++) {
            var row = [];
            for (var w = 0; w < width; w++) {
                row.push(false);
            }
            board.push(row);
        }
        return board;
    }

    function computeNext(board) {
        var newBoard = [];
        for (var r = 0; r < board.length; r++) {
            var newRow = [];
            for (var c = 0; c < board[r].length; c++) {
                newRow.push(willLive(board, r, c) || newCell(board, r, c));
            }
            newBoard.push(newRow);
        }
        return newBoard;
    }

    function willLive(board, row, cell) {
        return cellAt(board, row, cell) && neighbours(board, row, cell) >= 2 && neighbours(board, row, cell) <= 3;
    }

    function willDie(board, row, cell) {
        return cellAt(board, row, cell) && (neighbours(board, row, cell) < 2 || neighbours(board, row, cell) > 3);
    }

    function newCell(board, row, cell) {
        return !cellAt(board, row, cell) && neighbours(board, row, cell) == 3;
    }

    function neighbours(board, row, cell) {
        var n = 0;
        n += cellAt(board, row - 1, cell - 1) ? 1 : 0;
        n += cellAt(board, row - 1, cell + 0) ? 1 : 0;
        n += cellAt(board, row - 1, cell + 1) ? 1 : 0;
        n += cellAt(board, row + 0, cell - 1) ? 1 : 0;
        n += cellAt(board, row + 0, cell + 1) ? 1 : 0;
        n += cellAt(board, row + 1, cell - 1) ? 1 : 0;
        n += cellAt(board, row + 1, cell + 0) ? 1 : 0;
        n += cellAt(board, row + 1, cell + 1) ? 1 : 0;
        return n;
    }

    function cellAt(board, row, cell) {
        var x = cell,
            y = row;
        if (row < 0) {
            y = board.length - 1;
        }
        if (row > board.length - 1) {
            y = 0;
        }
        if (cell < 0) {
            x = board[y].length - 1;
        }
        if (cell > board[y].length - 1) {
            x = 0;
        }

        return board[y][x];
        /*return (row >= 0   && row < board.length &&
         cell >= 0  && cell < board[row].length &&
         board[row][cell]);*/
    }

    function arraysAreIdentical(arr1, arr2) {
        for (var y = 0; y < arr1.length; y++) {
            for (var x = 0; x < arr1[y].length; x++) {
                if (arr1[y][x] !== arr2[y][x]) {
                    return false;
                }
            }
        }
        return true;
    }

    // API

    $scope.newGame = function () {
        $scope.history = [];
        $scope.board = init($scope.height, $scope.width);
    };

    $scope.stepOver = function () {
        $scope.history.push($scope.board);
        $scope.board = computeNext($scope.board);
    };

    $scope.loop = function () {
        $scope.loopActive = true;
        // stop if not changed
        if ($scope.stop || $scope.history.length > 1 && arraysAreIdentical($scope.history[$scope.history.length - 2], $scope.history[$scope.history.length - 1])) {
            $scope.stopLoop();
            return;
        } else {
            $timeout(function () {
                $scope.stepOver();
                $scope.loop();
            }, 50);
        }
    };


    $scope.startLoop = function () {
        $scope.stop = false;
        $scope.loop();
    };

    $scope.stopLoop = function () {
        $scope.stop = true;
        $scope.loopActive = false;
    };

    $scope.step = function (index) {
        $scope.board = $scope.history[index];
        $scope.history = $scope.history.slice(0, index);
    };

    $scope.toggle = function (row, cell) {
        $scope.history = []; // Reset history as it is no longer accurate
        $scope.board[row][cell] = !$scope.board[row][cell];
    };

    $scope.cellClass = function (row, cell) {
        if (willDie($scope.board, row, cell)) {
            return 'die';
        }
        if (newCell($scope.board, row, cell)) {
            return 'new';
        }
        return '';
    };

    // Load

    $scope.loadDisco = function () {

        $scope.height = 20;
        $scope.width = 20;

        $scope.board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        $scope.startLoop();
    };


    $scope.loadSpaceships = function () {

        $scope.height = 22;
        $scope.width = 20;

        $scope.board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        $scope.startLoop();
    };

    // init
    $scope.stop = false;
    $scope.loopActive = false;
    $scope.height = 20;
    $scope.width = 20;
    $scope.newGame();
});
