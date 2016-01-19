angular.module('ngGridPlugins', [])
  .factory('ngGridPlugins', ['$timeout', function ($timeout) {
      var filterBarPlugin = function () {
        this.headerCellTemplate = 'resources/ng-grid/filterHeader.html';
        var self = this;
        self.grid = null;
        self.scope = null;
        self.init = function (scope, grid) {
          self.scope = scope;
          self.grid = grid;
          self.grid.clearFilters = function () {
            self.scope.$parent.filterText = "";
            self.grid.searchProvider.evalFilter();
            angular.forEach(self.scope.columns, function (col) {
              col.filterText = "";
            });
          };
          var timeoutPromise;
          self.scope.$watch(
            function () {
              var searchQuery = "";
              angular.forEach(self.scope.columns, function (col) {
                if (col.visible && col.filterText) {
//                var filterText = (col.filterText.indexOf('*') === 0 ? col.filterText.replace('*', '') : "^" + col.filterText) + ";";
                  var filterText = col.filterText;
                  searchQuery += col.displayName + ": " + filterText + ";";
                }
              });
              return searchQuery;
            },
            function (searchQuery) {
              //cancel our previous call to search if it is still waiting through timeout.
              $timeout.cancel(timeoutPromise);
              //wait for a bit before we do our search, save our reference in case we need to cancel.
              timeoutPromise = $timeout(function () {
                self.scope.$parent.filterText = searchQuery;
                self.grid.searchProvider.evalFilter();
              }, 200);
            });
        };
      };

      var filteredCheckboxPlugin = function () {
        this.checkboxHeaderTemplate = '<input class="ngSelectionHeader" type="checkbox" ng-show="multiSelect" ng-model="allSelected" ng-click="toggleSelectAll(!allSelected, true)" data-ui-indeterminate="allIndeterminate"/>';

        var getNumSelected = function (rows) {
          var numSelected = 0;
          _.each(rows, function (row) {
            if (row.selected) {
              ++numSelected;
            }
          });

          return numSelected;
        };

        var updateHeaderCheckBox = function (rows, selector) {
          var selectAllHeaderScope = angular.element(selector).scope();
          if (selectAllHeaderScope) {
            var numSelected = getNumSelected(rows);

            if (!numSelected) {
              selectAllHeaderScope.allSelected = false;
              selectAllHeaderScope.allIndeterminate = false;
              return;
            }

            if (numSelected >= rows.length) {
              selectAllHeaderScope.allSelected = true;
              selectAllHeaderScope.allIndeterminate = false;
              return;
            }

            selectAllHeaderScope.allSelected = false;
            selectAllHeaderScope.allIndeterminate = true;
          }
        };

        this.init = function (scope, grid) {
          var selector = "." + grid.gridId + " .ngSelectionHeader";

          scope.$watchCollection('selectedItems', function (newValue) {
            if (newValue) {
              updateHeaderCheckBox(grid.filteredRows, selector);
            }
          });

          // this event fires a lot, may need a different solution to catch row change events if performace is an issue
          scope.$parent.$on('ngGridEventRows', function () {
            updateHeaderCheckBox(grid.filteredRows, selector);
          });
        };
      };

      /**
       * selectedCell = Info about the cell
       *  - columnCode
       *  - invalid
       *  - rowIndex
       *  - shiftKey
       *  - value
       * selectedRange = Info about the range
       *  - initialCell
       *  - endCell
       *
       * @returns {ngGridPlugins_L2.gridRangeSelectionPlugin}
       */
      var gridRangeSelectionPlugin = function () {
        this.init = function (scope, grid) {
          if (!scope.gridOptions.selectedCell) {
            scope.gridOptions.selectedCell = {};
          }
          if (!scope.gridOptions.selectedRange) {
            scope.gridOptions.selectedRange = {};
          }

          // Select Range
          scope.$watch('gridOptions.selectedCell', function (current, previous) {
            //will fire on initialization of grid

            if (null === current || null === current.columnCode)
            {
              scope.gridOptions.selectedRange = {};
              return;
            }

            var range = scope.gridOptions.selectedRange;

            //if shift and range already has values
            if (current.shiftKey && range.initialCell && range.initialCell.columnCode === current.columnCode)
            {
              //extend our current range
              //range.endCell = angular.copy(current);
              range.endCell = angular.copy(current);
            }
            else
            {
              //otherwise we need to set our initial cell.
              range.initialCell = angular.copy(current);
              range.endCell = null;
            }
          }, true);

          scope.$watch('gridOptions.selectedRange', function (currentRange, previousRange) {
            if (previousRange.initialCell && previousRange.endCell) {
              changeHighlightRange(previousRange, false);
            }

            if (currentRange.initialCell && currentRange.endCell) {
              changeHighlightRange(currentRange, true);
            }
          }, true);

          // clear selection on filter change
          scope.$watch(function () {
            var searchQuery = "";
            angular.forEach(scope.columns, function (col) {
              if (col.visible && col.filterText) {
                var filterText = col.filterText;
                searchQuery += col.displayName + ": " + filterText + ";";
              }
            });
            return searchQuery;
          },
            function () {
              clearSelection();
            }
          );

          scope.$parent.$on('ngGridEventColumns', function (event, newColumns) {
            if (!scope.selectedRange || !scope.selectedRange.columnCode) {
              return;
            }

            var visibleColumns = [];
            for (var i = 0; i < newColumns.length; ++i) {
              var column = newColumns[i];
              if (column.visible) {
                visibleColumns.push(newColumns[i].colDef.colName);
              }
            }

            if (-1 === visibleColumns.indexOf(scope.selectedRange.columnCode)) {
              clearSelection();
            }
          });

          scope.$parent.$on('ngGridEventSorted', function () {
            clearSelection();
          });

          scope.$parent.$on('ngGridEventData', function () {
            clearSelection();
          });

          function clearSelection() {
            scope.gridOptions.selectedCell = {};
            scope.gridOptions.selectedRange = {};
          }

          function changeHighlightRange(range, onOrOff) {
            //determine the column
            var column = range.endCell.columnCode;
            grid.data[range.initialCell.rowIndex][column].selectedOrigin = onOrOff;

            //determine the lowest rowIndex for initialCell/endCell
            var initialCellHighest = range.initialCell.rowIndex < range.endCell.rowIndex;
            var startIndex = initialCellHighest ? range.initialCell.rowIndex : range.endCell.rowIndex;
            var endIndex = initialCellHighest ? range.endCell.rowIndex : range.initialCell.rowIndex;

            //loop over all cells between initialCell/endCell and set selected
            for (var i = startIndex; i <= endIndex; ++i) {
              grid.data[convertVisibleToTrueRowIndex(i)][column].selected = onOrOff;
            }
          }

          function convertVisibleToTrueRowIndex(visibleRowIndex) {
            return grid.data.indexOf(scope.gridOptions.ngGrid.filteredRows[visibleRowIndex].entity);
          }
        };
      };

      return {
        filterBarPlugin: filterBarPlugin,
        filteredCheckboxPlugin: filteredCheckboxPlugin,
        gridRangeSelectionPlugin: gridRangeSelectionPlugin
      };
    }]);
