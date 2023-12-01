
let params = (new URL(document.location)).searchParams;

window.onload = function(){
    //if there is a log in error that means there was an invalid email/paswword input
    if (params.has('loginErr')) {
        //after window loads, get the value form key 'loginError' and dis[lay it in errorMessage
        document.getElementById('errMsg').innerHTML = params.get('loginErr')
    }
    //this pastes the error into the div and it will keep your email so you don't have to keep typing it: It's sticky!
    document.getElementById('email').value = params.get('email');
}