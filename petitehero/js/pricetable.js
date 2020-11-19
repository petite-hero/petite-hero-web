var app = angular.module('pricetab', []);

app.controller('pricetabController', function($scope, $window) {
    $scope.records = [];
    $scope.replacePacks = [];
    $scope.currentSelectedRecord = "";
    $scope.replacePack = "";

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
            angular.forEach(result.data, function(record){
                record.appliedDate = dateToYMD(new Date(record.appliedDate));
            });
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
        console.log("Replace with: " + $scope.replacePack);
        await fetch(URL + "subscription/type/" + $scope.currentSelectedRecord + "/" + $scope.replacePack, {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
        })
        .then(response => response.json())
        .then(result => {
            if (result.code == 200 && result.data.status == 'DELETED') {
                $scope.currentSelectedRecord = "";
                $scope.replacePack = "";
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

    $scope.getReplacePacks = async function(subscriptionId) {
        $scope.currentSelectedRecord = subscriptionId;

        fetch(URL + "subscription/type/replacement/" + subscriptionId, {
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.code == 200) {
                angular.forEach(result.data.subscriptionTypeReplace, function(record){
                    record.appliedDate = dateToYMD(new Date(record.appliedDate));
                });
                $scope.$apply(function() {
                    $scope.replacePacks = result.data.subscriptionTypeReplace;
                });
                console.log($scope.replacePacks);
            } else {
                console.log(result.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    $scope.setReplacePack = function(subId) {
        $scope.replacePack = subId;
    };

    function dateToYMD(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();
        return '' + y + '/' + (m<=9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d);
    }

    // $scope.reloadPage = function(){$window.location.reload()};
});

