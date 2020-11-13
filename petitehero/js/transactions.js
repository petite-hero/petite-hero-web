var app = angular.module('transactions', []);

app.controller('transactionsController', function($scope, $window) {
    $scope.transactions = [];

    fetch(URL + "payment/list", {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        // body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(result => {
        if (result.code == 200) {
            angular.forEach(result.data, function(transaction){
                transaction.date = dateToYMDHM(new Date(transaction.date));
            });
            $scope.$apply(function() {
                $scope.transactions = result.data;
            });
            console.log("Initialize data: ");
            console.log($scope.transactions);

            $("#transactionsTable").DataTable({
                "responsive": true, "lengthChange": false, "autoWidth": false,
                "buttons": ["copy", "print", "colvis"]
            }).buttons().container().appendTo('#transactionsTable_wrapper .col-md-6:eq(0)');
        } else {
            console.log(result.msg);
        }
    })
    .catch(error => {
        console.log(error);
    });

    function dateToYMDHM(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();
        var h = date.getHours();
        var mm = date.getMinutes();
        return '' + y + '/' + 
            (m<=9 ? '0' + m : m) + '/' + 
            (d <= 9 ? '0' + d : d) + ' ' + 
            (h<=9 ? '0' + h : h) + ':' + (mm<=9 ? '0' + mm : mm);
    }

    // $scope.reloadPage = function(){$window.location.reload()};
});

