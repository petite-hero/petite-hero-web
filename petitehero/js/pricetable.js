var app = angular.module('pricetab', []);

app.controller('pricetabController', function($scope, $window, $timeout) {
    $scope.records = [];
    $scope.replacePacks = [];
    $scope.currentSelectedRecord = "";
    $scope.replacePack = "";
    $scope.noReplacePack = false;

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
            
            const preFilter = new URLSearchParams(window.location.search).get('filter');
            
            $("#pricetabTable").DataTable({
                "responsive": true, "lengthChange": true, "autoWidth": false, "bInfo": false, "bPaginate": false,
                "buttons": ["colvis"]
            }).buttons().container().appendTo('#pricetabTable_wrapper .col-md-6:eq(0)');
            $('.dataTables_filter input').attr('maxLength', 30)
            $.fn.dataTable.ext.errMode = 'none';

            if (preFilter !== null) {
                $("#pricetabTable").DataTable().search(preFilter).draw();
            }            
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
                $('#modal-disable').modal('toggle');
                $('#modal-replace').modal('toggle');
                let deletedRecord = $scope.currentSelectedRecord;
                
                $timeout(function () {
                    for (var i = 0; i < $scope.records.length; i++) {
                        if ($scope.records[i].subscriptionTypeId === deletedRecord) {
                            $scope.$apply(function() {
                                $scope.records.splice(i, 1);
                                console.log("Done deleting");
                            });
                        }
                    }
                });
                $scope.noReplacePack = false;
                $scope.currentSelectedRecord = "";
                $scope.replacePack = "";
                $scope.replacePacks = [];

                // $window.location.reload();
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
                $('#modal-add').modal('toggle');
                $timeout(function () {
                    $scope.$apply(function() {
                        request.subscriptionTypeId = result.data.subscriptionTypeId;
                        request.appliedDate = dateToYMD(new Date());
                        $scope.records.push(request);
                    })
                });
                // $window.location.reload();
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
                if (result.data.subscriptionTypeReplace == null) {
                    $scope.$apply(function() {
                        $scope.replacePacks = $scope.records;
                    });
                    $scope.noReplacePack = true;
                    $timeout(function () {
                        for (var i = 0; i < $scope.replacePacks.length; i++) {
                            if ($scope.replacePacks[i].subscriptionTypeId === subscriptionId) {
                                $scope.$apply(function() {
                                    $scope.replacePacks.splice(i, 1);
                                });
                            }
                        }
                    });
                    console.log($scope.replacePacks);
                } else if (result.data.subscriptionTypeReplace.length != 0) {
                    angular.forEach(result.data.subscriptionTypeReplace, function(record){
                        record.appliedDate = dateToYMD(new Date(record.appliedDate));
                    });
                    $scope.$apply(function() {
                        $scope.replacePacks = result.data.subscriptionTypeReplace;
                    });
                    console.log($scope.replacePacks);
                }
                
                $("#replacebTable").DataTable({
                    "responsive": true, "lengthChange": false, "autoWidth": false, "bdestroy": true, "bInfo" : false, "bPaginate": false
                }).buttons().container().appendTo('#replacebTable_wrapper .col-md-6:eq(0)');
                $('.dataTables_filter input').attr('maxLength', 30);
                $.fn.dataTable.ext.errMode = 'none';
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

    $scope.removeRecord = function(record) {
        $timeout(function () {
            $scope.records.splice($scope.records.indexOf(record), 1);
        });

        // $("#replacebTable").DataTable().destroy();
        // $("#replacebTable").empty();
        // $("#pricetabTable").DataTable().clear().destroy();

        // $("#pricetabTable").DataTable({
        //     "responsive": true, "lengthChange": true, "autoWidth": false, "bInfo": false, 
        //     "buttons": ["colvis"]
        // }).buttons().container().appendTo('#pricetabTable_wrapper .col-md-6:eq(0)');
        // $('.dataTables_filter input').attr('maxLength', 30)
        // $.fn.dataTable.ext.errMode = 'none';
    }

    // $scope.reloadPage = function(){$window.location.reload()};
});

