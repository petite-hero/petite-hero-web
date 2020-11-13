var app = angular.module('license', []);

app.controller('licenseController', function($scope, $window) {
    $scope.licenseEN = "";
    $scope.licenseVN = "";

    fetch(URL + "config", {
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
            console.log(result.data);
            $scope.$apply(function() {
                $scope.licenseEN = result.data.license_EN;
                $scope.licenseVN = result.data.license_VN;
            });
            $(function () {
                $('.summernote').summernote();
            });
            console.log($scope.licenseEN);
            console.log($scope.licenseVN);
        } else {
            console.log(result.msg);
        }
    })
    .catch(error => {
        console.log(error);
    });

    $scope.updateLicense = async function() {
        $scope.licenseEN = $('.summernote').summernote('code');
        $scope.licenseVN = $('.summernote').eq(1).summernote('code');

        var request = new Object();
        request.license_EN = $scope.licenseEN;
        request.license_VN = $scope.licenseVN;

        fetch(URL + "config", {
            method: 'PUT',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
        .then(response => response.json())
        .then(result => {
            if (result.code == 200) {
                console.log(result.data);
                $window.location.reload();
            } else {
                console.log(result.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

});

