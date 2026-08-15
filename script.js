let currentType = "url";


const typeButtons =
    document.querySelectorAll(".type-btn");

const mainInput =
    document.getElementById("mainInput");

const inputLabel =
    document.getElementById("inputLabel");

const qrColor =
    document.getElementById("qrColor");

const colorValue =
    document.getElementById("colorValue");

const qrSize =
    document.getElementById("qrSize");

const generateBtn =
    document.getElementById("generateBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const qrcode =
    document.getElementById("qrcode");

const error =
    document.getElementById("error");

const toast =
    document.getElementById("toast");


/* متن‌های مربوط به هر نوع QR */

const settings = {

    url: {
        label: "لینک سایت",
        placeholder:
            "مثلاً https://example.com"
    },

    text: {
        label: "متن",
        placeholder:
            "متن موردنظر خود را وارد کنید..."
    },

    phone: {
        label: "شماره تلفن",
        placeholder:
            "مثلاً 09123456789"
    },

    email: {
        label: "آدرس ایمیل",
        placeholder:
            "مثلاً example@gmail.com"
    },

    wifi: {
        label: "اطلاعات Wi-Fi",
        placeholder:
            "مثلاً نام وای‌فای و رمز عبور"
    }

};


/* انتخاب نوع QR */

typeButtons.forEach(button => {

    button.addEventListener("click", () => {

        typeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentType =
            button.dataset.type;

        inputLabel.textContent =
            settings[currentType].label;

        mainInput.placeholder =
            settings[currentType].placeholder;

        mainInput.value = "";

        error.classList.remove("show");

    });

});


/* نمایش رنگ */

qrColor.addEventListener("input", () => {

    colorValue.textContent =
        qrColor.value;

});


/* ساخت QR */

generateBtn.addEventListener(
    "click",
    generateQR
);


function generateQR() {

    let value =
        mainInput.value.trim();


    if (!value) {

        error.textContent =
            "لطفاً اطلاعات موردنظر را وارد کنید.";

        error.classList.add("show");

        return;
    }


    /* لینک */

    if (currentType === "url") {

        if (
            !value.startsWith("http://") &&
            !value.startsWith("https://")
        ) {

            value =
                "https://" + value;

        }

    }


    /* تلفن */

    if (currentType === "phone") {

        value =
            "tel:" + value;

    }


    /* ایمیل */

    if (currentType === "email") {

        value =
            "mailto:" + value;

    }


    /* وای‌فای */

    if (currentType === "wifi") {

        value =
            "WIFI:S:" +
            value +
            ";;";

    }


    error.classList.remove("show");


    /* پاک کردن QR قبلی */

    qrcode.innerHTML = "";


    const size =
        Number(qrSize.value);


    /* ساخت QR */

    new QRCode(qrcode, {

        text: value,

        width: size,

        height: size,

        colorDark:
            qrColor.value,

        colorLight:
            "#ffffff",

        correctLevel:
            QRCode.CorrectLevel.H

    });


    /* نمایش دانلود */

    downloadBtn.classList.add("show");


    showToast();

}


/* دانلود */

downloadBtn.addEventListener(
    "click",
    downloadQR
);


function downloadQR() {

    const canvas =
        qrcode.querySelector("canvas");

    const image =
        qrcode.querySelector("img");


    let url;


    if (canvas) {

        url =
            canvas.toDataURL("image/png");

    }
    else if (image) {

        url =
            image.src;

    }


    if (!url) {
        return;
    }


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "qr-code.png";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}


/* پیام موفقیت */

function showToast() {

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ساخت QR با Ctrl + Enter */

mainInput.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            generateQR();

        }

    }
);