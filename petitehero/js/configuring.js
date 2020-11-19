function openModal() {
    console.log("Opening")
    $('#modal-update').modal();
}

var app = angular.module('config', []);
app.controller('configController', function($scope, $window) {

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
            $('#safezone').val(result.data.safezone_cron_time);
            $('#task').val(result.data.task_cron_time);
            $('#quest').val(result.data.quest_cron_time);
            $('#expiredTime').val(result.data.parent_subscription_cron_time);
            $('#expiredDay').val(result.data.expired_date_subscription_noti);
            $('#radius').val(result.data.outer_radius);
            $('#delay').val(result.data.report_delay);
            $('#housework').val(result.data.total_hour_task_housework);
            $('#education').val(result.data.total_hour_task_education);
            $('#skill').val(result.data.total_hour_task_skills);
        } else {
            console.log(result.msg);
        }
    })
    .catch(error => {
        console.log(error);
    });

    $scope.update = async function() {
        var request = new Object();
        request.safezone_cron_time = $('#safezone').val();
        request.task_cron_time = $('#task').val();
        request.quest_cron_time = $('#quest').val();
        request.parent_subscription_cron_time = $('#expiredTime').val();
        request.expired_date_subscription_noti = $('#expiredDay').val();
        request.outer_radius = $('#radius').val();
        request.report_delay = $('#delay').val();
        request.total_hour_task_housework = $('#housework').val();
        request.total_hour_task_education = $('#education').val();
        request.total_hour_task_skills = $('#skill').val();

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

