var app = angular.module('pricetab', []);

app.controller('pricetabController', function($scope, $window) {
    $scope.records = [];
    $scope.currentSelectedRecord = "";

    fetch(URL + "subscription/type/list", {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.code == 200) {
            $scope.$apply(function() {
                $scope.records = result.data;
            });
            console.log("Initialize data: ");
            console.log($scope.records);

            $("#pricetabTable").DataTable({
                "responsive": true, "lengthChange": false, "autoWidth": false,
                "buttons": ["copy", "print", "colvis"]
            }).buttons().container().appendTo('#pricetabTable_wrapper .col-md-6:eq(0)');
        } else {
            console.log(result.msg);
        }
    })
    .catch(error => {
        console.log(error);
    });

    $scope.disable = async function() {
        console.log("Disable: " + $scope.currentSelectedRecord);
        await fetch(URL + "subscription/type/" + $scope.currentSelectedRecord, {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
        })
        .then(response => response.json())
        .then(result => {
            if (result.code == 200) {
                $scope.currentSelectedAccount = "";
                $window.location.reload();
            } else {
                console.log(result.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    $scope.add = async function() {
        var request = new Object();
        request.name = $('#packName').val();
        request.maxChildren = $('#maxChildren').val();
        request.maxCollaborator = $('#maxCollaborator').val();
        request.price = $('#price').val();
        request.durationDay = $('#duration').val();
        request.description = $('#description').val();

        console.log(request);

        await fetch(URL + "subscription/type", {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
        .then(response => response.json())
        .then(result => {
            if (result.code == 200) {
                $window.location.reload();
            } else {
                console.log(result.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    $scope.setSelectedRecord = function(subId) {
        $scope.currentSelectedRecord = subId;
        console.log("Set to: " + $scope.currentSelectedRecord);
    };

    // $scope.reloadPage = function(){$window.location.reload()};
});

