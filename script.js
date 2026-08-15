let currentType = "url";


// =========================
// ELEMENTS
// =========================

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


// =========================
// SETTINGS
// =========================

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
            "مثلاً MyWifi,12345678"
    }

};


// =========================
// SELECT QR TYPE
// =========================

typeButtons.forEach(button => {

    button.addEventListener("click", () => {

        // حذف active از همه
        typeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // فعال کردن دکمه انتخاب شده
        button.classList.add("active");

        // نوع فعلی
        currentType =
            button.dataset.type;

        // تغییر عنوان
        inputLabel.textContent =
            settings[currentType].label;

        // تغییر placeholder
        mainInput.placeholder =
            settings[currentType].placeholder;

        // پاک کردن ورودی
        mainInput.value = "";

        // مخفی کردن خطا
        error.classList.remove("show");

    });

});


// =========================
// COLOR
// =========================

qrColor.addEventListener("input", () => {

    colorValue.textContent =
        qrColor.value;

});


// =========================
// GENERATE QR
// =========================

generateBtn.addEventListener(
    "click",
    generateQR
);


function generateQR() {

    let value =
        mainInput.value.trim();


    // بررسی خالی بودن
    if (!value) {

        error.textContent =
            "لطفاً اطلاعات موردنظر را وارد کنید.";

        error.classList.add("show");

        return;
    }


    // =========================
    // URL
    // =========================

    if (currentType === "url") {

        if (
            !value.startsWith("http://") &&
            !value.startsWith("https://")
        ) {

            value =
                "https://" + value;

        }

    }


    // =========================
    // PHONE
    // =========================

    if (currentType === "phone") {

        value =
            "tel:" + value;

    }


    // =========================
    // EMAIL
    // =========================

    if (currentType === "email") {

        value =
            "mailto:" + value;

    }


    // =========================
    // WIFI
    // =========================

    if (currentType === "wifi") {

        const parts =
            value.split(",");

        const wifiName =
            parts[0]?.trim() || "";

        const wifiPassword =
            parts[1]?.trim() || "";

        value =
            `WIFI:T:WPA;S:${wifiName};P:${wifiPassword};;`;

    }


    // حذف خطا
    error.classList.remove("show");


    // پاک کردن QR قبلی
    qrcode.innerHTML = "";


    // اندازه QR
    const size =
        Number(qrSize.value);


    // =========================
    // CREATE QR
    // =========================

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


    // نمایش دکمه PDF
    downloadBtn.classList.add("show");


    // پیام موفقیت
    showToast();

}


// =========================
// DOWNLOAD PDF
// =========================

downloadBtn.addEventListener(
    "click",
    downloadPDF
);


function downloadPDF() {

    const canvas =
        qrcode.querySelector("canvas");


    if (!canvas) {

        error.textContent =
            "ابتدا QR Code را بسازید.";

        error.classList.add("show");

        return;
    }


    // بررسی jsPDF
    if (!window.jspdf) {

        alert(
            "کتابخانه PDF بارگذاری نشده است. اینترنت خود را بررسی کنید."
        );

        return;
    }


    const { jsPDF } =
        window.jspdf;


    // =========================
    // CREATE PDF
    // =========================

    const pdf =
        new jsPDF({

            orientation: "portrait",

            unit: "mm",

            format: "a4"

        });


    // تبدیل QR به تصویر
    const imageData =
        canvas.toDataURL("image/png");


    // اندازه صفحه A4
    const pageWidth = 210;
    const pageHeight = 297;


    // اندازه QR
    const qrSize = 100;


    // وسط صفحه
    const x =
        (pageWidth - qrSize) / 2;

    const y =
        (pageHeight - qrSize) / 2;


    // =========================
    // PDF HEADER
    // =========================

    pdf.setTextColor(10, 36, 113);

    pdf.setFontSize(24);

    pdf.text(
        "QR Studio",
        pageWidth / 2,
        35,
        {
            align: "center"
        }
    );


    pdf.setTextColor(100, 100, 100);

    pdf.setFontSize(12);

    pdf.text(
        "QR Code",
        pageWidth / 2,
        48,
        {
            align: "center"
        }
    );


    // =========================
    // QR CODE
    // =========================

    pdf.addImage(
        imageData,
        "PNG",
        x,
        y,
        qrSize,
        qrSize
    );


    // =========================
    // FOOTER
    // =========================

    pdf.setTextColor(10, 36, 113);

    pdf.setFontSize(11);

    pdf.text(
        "Generated by QR Studio",
        pageWidth / 2,
        275,
        {
            align: "center"
        }
    );


    // خط طلایی
    pdf.setDrawColor(255, 185, 9);

    pdf.setLineWidth(1);

    pdf.line(
        55,
        265,
        155,
        265
    );


    // =========================
    // SAVE
    // =========================

    pdf.save("QR-Studio.pdf");

}


// =========================
// TOAST
// =========================

function showToast() {

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// =========================
// CTRL + ENTER
// =========================

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
