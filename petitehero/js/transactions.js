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
            for(var i = 0; i < result.data.length; i++){ 
                if ( result.data[i].status == "PENDING") { 
                    result.data.splice(i, 1); 
                }
                result.data[i].date = dateToDMY(new Date(result.data[i].date));
                if (result.data[i].payDate != null) {
                    result.data[i].payDate = dateToDMY(new Date(result.data[i].payDate));
                } else {
                    result.data[i].payDate = "--"
                }
            }
            $scope.$apply(function() {
                $scope.transactions = result.data;
            });
            console.log("Initialize data: ");
            console.log($scope.transactions);

            const preFilter = new URLSearchParams(window.location.search).get('filter');

            $("#transactionsTable").DataTable({
                "responsive": true, "lengthChange": true, "autoWidth": false,
                "buttons": ["colvis"]
            }).buttons().container().appendTo('#transactionsTable_wrapper .col-md-6:eq(0)');
            $('.dataTables_filter input').attr('maxLength', 30)

            if (preFilter !== null) {
                $("#transactionsTable").DataTable().search(preFilter).draw();
            }
        } else {
            console.log(result.msg);
        }
    })
    .catch(error => {
        console.log(error);
    });

    function dateToDMY(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();
        return '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;
        // var h = date.getHours();
        // var mm = date.getMinutes();
        // return '' + y + '/' + 
        //     (m<=9 ? '0' + m : m) + '/' + 
        //     (d <= 9 ? '0' + d : d) + ' ' + 
        //     (h<=9 ? '0' + h : h) + ':' + (mm<=9 ? '0' + mm : mm);
    }

    // $scope.reloadPage = function(){$window.location.reload()};
});

