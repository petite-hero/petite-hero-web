var app = angular.module('parents', []);

app.controller('parentsController', function($scope, $window, $timeout) {
    $scope.user;
    $scope.users = [];
    $scope.children = [];
    $scope.collaborators = [];
    $scope.subscriptions = [];
    $scope.transactions = [];
    $scope.currentSelectedAccount = "";

    fetch(URL + "account/list", {
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
            angular.forEach(result.data, function(user){
                user.expiredDate = dateToDMY(new Date(user.expiredDate));
            });
            $scope.$apply(function() {
                $scope.users = result.data;
            });
            console.log("Initialize data: ");
            console.log($scope.users);

            

            $("#parentsTable").DataTable({
                "responsive": true, "lengthChange": true, "autoWidth": false,
                "buttons": ["colvis"]
            }).buttons().container().appendTo('#parentsTable_wrapper .col-md-6:eq(0)');
            $('.dataTables_filter input').attr('maxLength', 30)
            // $("#parentsTable").DataTable().search('value something').draw();
        } else {
            console.log(result.msg);
        }
    })
    .catch(error => {
        console.log(error);
    });

    $scope.disable = async function() {
        console.log("Disable: " + $scope.currentSelectedAccount);
        await fetch(URL + "parent/" + $scope.currentSelectedAccount + "?isDisable=true", {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
        })
        .then(response => response.json())
        .then(result => {
            if (result.code == 200) {
                $scope.changeStatus($scope.currentSelectedAccount, true);
                $scope.currentSelectedAccount = "";
                $('#modal-disable').modal('toggle');
                $('#modal-msg-text').text("Updated successfully");
                $('#modal-msg').modal('toggle');
                // $window.location.reload();
            } else {
                console.log(result.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    $scope.activate = async function() {
        console.log("Activate: " + $scope.currentSelectedAccount);
        await fetch(URL + "parent/" + $scope.currentSelectedAccount + "?isDisable=false", {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
        })
        .then(response => response.json())
        .then(result => {
            if (result.code == 200) {
                $scope.changeStatus($scope.currentSelectedAccount, false);
                $scope.currentSelectedAccount = "";
                $('#modal-activate').modal('toggle');
                $('#modal-msg-text').text("Updated successfully");
                $('#modal-msg').modal('toggle');
                // $window.location.reload();
            } else {
                console.log(result.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    $scope.getDetails = async function(phoneNumber) {
        console.log("Details: " + phoneNumber);
        await fetch(URL + "account/" + phoneNumber, {
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
        })
        .then(response => response.json())
        .then(result => {
            if (result.code == 200) {
                console.log(result.data);
                $scope.$apply(function() {
                    $scope.user = result.data;
                    $scope.user.expiredDate = dateToDMY(new Date($scope.user.expiredDate));
                    $scope.children = result.data.childInformationList;
                    $scope.collaborators = result.data.collaboratorInformationList;
                    $scope.subscriptions = result.data.subscriptionHistoryList;

                    angular.forEach($scope.subscriptions, function(subscription){
                        subscription.startDate = dateToDMY(new Date(subscription.startDate));
                        subscription.expiredDate = dateToDMY(new Date(subscription.expiredDate));
                    });
                });

            } else {
                console.log(result.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    $scope.setSelectedAccount = function(phoneNumber) {
        $scope.currentSelectedAccount = phoneNumber;
        console.log("Set to: " + $scope.currentSelectedAccount);
    };

    function dateToDMY(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();
        // return '' + y + '/' + (m<=9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d);
        return '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;
    }

    $scope.changeStatus = function(phoneNumber, status) {
        $timeout(function () {
            for (var i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].phoneNumber == phoneNumber) {
                    $scope.$apply(function() {
                        $scope.users[i].isDisable = status;
                    });
                }
            }
        });
    }

    $scope.resetDevice = function(phoneNumber) {
        console.log(phoneNumber);
        fetch(URL + "parent/reset-device?parentPhoneNumber=" + phoneNumber, {
            method: 'PUT',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
        })
        .then(response => response.json())
        .then(result => {
            if (result.code == 200) {
                if (result.data.status == "UPDATED") {
                    $('#modal-msg-text').text(result.data.status);
                    $('#modal-msg').modal('toggle');
                }
                // $window.location.reload();
            } else {
                $('#modal-msg-text').text(result.data.status);
                $('#modal-msg').modal('toggle');
                console.log(result.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });

     }

     $scope.getSubscriptionDetails = function(subscriptionId) {
        console.log(subscriptionId)
        var request = new Object();
        request.subscriptionId = subscriptionId;
        fetch(URL + "payment/list?subscriptionId=" + subscriptionId, {
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
        })
        .then(response => response.json())
        .then(result => {
            if (result.code == 200) {
                if (result.data.length != 0) {
                    angular.forEach(result.data, function(record){
                        record.date = dateToDMY(new Date(record.date));
                    });
                    $scope.$apply(function() {
                        $scope.transactions = result.data;
                    });
                    console.log($scope.transactions);

                    $("#transactionsTable").DataTable({
                        "responsive": true, "lengthChange": false, "autoWidth": false, "bdestroy": true, "bInfo" : false, "bPaginate": false
                    }).buttons().container().appendTo('#replacebTable_wrapper .col-md-6:eq(0)');
                    $('.dataTables_filter input').attr('maxLength', 30);
                    $.fn.dataTable.ext.errMode = 'none';
                }
                else {
                    
                }
                
            } else {
                console.log(result.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    $scope.openSubscription = function(subscriptionType) {
       console.log(subscriptionType);
       window.location.href = "pricetable.html?filter=" + subscriptionType;
    }

    $scope.openTransaction = function(phoneNumber) {
       console.log(phoneNumber);
       window.location.href = "transactions.html?filter=" + phoneNumber;
    }

    // $scope.reloadPage = function(){$window.location.reload()};
});

