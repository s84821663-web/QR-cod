```javascript
(function () {
  "use strict";

  // رمز ورود سایت
  const SITE_PASSWORD = "srqu12";

  // کلید ذخیره وضعیت ورود در مرورگر
  const AUTH_KEY = "qrStudioAuthenticated";

  // بررسی وجود عناصر صفحه ورود
  const loginScreen = document.getElementById("login-screen");
  const mainContent = document.getElementById("main-content");
  const loginForm = document.getElementById("login-form");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");

  // اگر عناصر HTML وجود نداشته باشند، اجرا متوقف می‌شود.
  if (
    !loginScreen ||
    !mainContent ||
    !loginForm ||
    !passwordInput ||
    !errorMessage
  ) {
    console.error("عناصر صفحه ورود در HTML پیدا نشدند.");
    return;
  }

  // نمایش سایت پس از ورود موفق
  function showSite() {
    loginScreen.style.display = "none";
    mainContent.style.display = "block";
  }

  // بررسی ورود قبلی در همین مرورگر
  try {
    if (localStorage.getItem(AUTH_KEY) === "true") {
      showSite();
    }
  } catch (error) {
    console.warn("ذخیره‌سازی مرورگر در دسترس نیست.");
  }

  // بررسی رمز واردشده
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const enteredPassword = passwordInput.value;

    if (enteredPassword === SITE_PASSWORD) {
      try {
        localStorage.setItem(AUTH_KEY, "true");
      } catch (error) {
        // ورود در همین صفحه همچنان انجام می‌شود.
      }

      errorMessage.textContent = "";
      passwordInput.value = "";
      showSite();
    } else {
      errorMessage.textContent = "رمز عبور اشتباه است!";
      passwordInput.value = "";
      passwordInput.focus();
    }
  });
})();
```
