const FB_APP_ID = "762977926791763";
const Url = `https://chatbotbe.thanhmaihsk.edu.vn`;
// const Url = `http://localhost:8000`;
const REDIRECT_URI = `${Url}/facebook-pages/callback`;

const FB_SCOPE = "pages_show_list,pages_manage_metadata,pages_read_engagement,pages_messaging,email";

export default function LoginWithFb() {
    const handleLogin = () => {
        const fbLoginUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}&scope=${FB_SCOPE}&response_type=code`;

        window.location.href = fbLoginUrl;
    };

    return (
        <button
            onClick={handleLogin}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
            <span className="text-sm">📘</span>
            Kết nối Facebook
        </button>
    );
}
