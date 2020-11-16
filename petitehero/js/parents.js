var app = angular.module('parents', []);

app.controller('parentsController', function($scope, $window) {
    $scope.users = [];
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
                user.expiredDate = dateToYMD(new Date(user.expiredDate));
            });
            $scope.$apply(function() {
                $scope.users = result.data;
            });
            console.log("Initialize data: ");
            console.log($scope.users);

            $("#parentsTable").DataTable({
                "responsive": true, "lengthChange": false, "autoWidth": false,
                "buttons": ["copy", "print", "colvis"]
            }).buttons().container().appendTo('#parentsTable_wrapper .col-md-6:eq(0)');
        } else {
            console.log(result.msg);
        }
    })
    .catch(error => {
        console.log(error);
    });

    $scope.disable = async function() {
        console.log("Disable: " + $scope.currentSelectedAccount);
        await fetch(URL + "parent/" + $scope.currentSelectedAccount, {
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

    $scope.setSelectedAccount = function(phoneNumber) {
        $scope.currentSelectedAccount = phoneNumber;
        console.log("Set to: " + $scope.currentSelectedAccount);
    };

    function dateToYMD(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();
        return '' + y + '/' + (m<=9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d);
    }

    // $scope.reloadPage = function(){$window.location.reload()};
});
