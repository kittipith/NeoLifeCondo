// ✅ ดึง Token จาก LocalStorage
const token = localStorage.getItem("accessToken");

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        alert("No token found, please login.");
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/user-check", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Unauthorized");

        //ถ้า Token ถูกต้อง -> แสดงเนื้อหา
        document.body.style.display = "block";

        const data = await response.json();
        console.log("User data:", data);

        //ถ้าเป็น Admin -> Redirect
        if (data.user) {
            window.location.href = "/admin";
            return;
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Session expired, please login again.");
        window.location.href = "/login";
    }
});

// ✅ ฟังก์ชันรีเฟรช Access Token อัตโนมัติ
async function refreshAccessToken() {
    try {
        const response = await fetch("http://localhost:3000/refresh", {
            method: "POST",
            credentials: "include" // เพื่อส่ง Cookie refreshToken
        });

        if (!response.ok) throw new Error("Failed to refresh token");

        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        console.log("Access Token Refreshed!");
    } catch (error) {
        console.error("Refresh Token Failed:", error);
        alert("Session expired, please login again");
        window.location.href = "/login";
    }
}

// ✅ ตั้งให้เรียก refresh token อัตโนมัติเมื่อ access token หมดอายุ
setInterval(refreshAccessToken, 25 * 1000); // รีเฟรชทุก 25 วินาที

// function logout() {
//     localStorage.removeItem("accessToken");
//     alert("Logged out successfully!");
//     window.location.href = "/login";
// }