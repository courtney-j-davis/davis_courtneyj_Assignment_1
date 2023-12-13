if (getCookie('user_cookie') != false) {
    user_cookie =getCookie('user_cookie');

    document.getElementById('verify').innerHTML = `
    <h1>Aloha ${user_cookie['name']}!</h1>
    <p> Are you sure you WANT to leave?</p>
    `;
//This clears the user_cookie and won't be personalized. Effectively gets rid of client side cookie. 
    document.getElementById('logout_buton').addEventListener('click', function(){
        document.cookie = 'user_cookie=; expires=Thu, 01 Jan 1981 00:00:00 UTC; path=/;';


        location.href = './login.html';
        window.stop;
    });
} else {
    location.href= './login.html';
    window.stop;
}