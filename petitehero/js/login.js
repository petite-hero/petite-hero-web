async function login() {
    var request = new Object();
    request.username = $('#username').val();
    request.password = $('#password').val();

    await fetch(URL + "account/login", {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    .then(response => response.json())
    .then(result => {
        if (result.code == 200 && !result.data.jwt.isEmpty) {
            if (result.data.role == "Admin") {
                window.location.href = "index.html";
            } else {
                $('#firstMsg').val("Your account cannot access");
                $('#secondMsg').val("Please try a different account");
                $('.container').stop().addClass('active');
            }
        } else if (result.code == 404 && result.msg == "Wrong username or password. Please try again") {
            $('#firstMsg').val("Wrong username or password");
            $('#secondMsg').val("Please try again!");
            $('.container').stop().addClass('active');
        } else {
            console.log(result.msg);
            $('#firstMsg').val(result.msg);
            $('#secondMsg').val("Please try again!");
            $('.container').stop().addClass('active');
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function test() {
    return false;
}

