import { useEffect, useState } from 'react';

const useAdminAuth = (): boolean => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const validateToken = () => {
            // LocalStorage-аас token авах
            const token = localStorage.getItem('adminToken');
            setIsAuthenticated(!!token); // Хэрэв token байгаа бол true гэж үзнэ
        };

        validateToken(); // Эхлээд нэг шалгана

        // Storage эвэнтийг сонсох (Token-ийг нэмэх/устгах үед шинэчлэх)
        window.addEventListener('storage', validateToken);

        // 30 минут тутамд token-г шалгах
        const interval = setInterval(() => {
            validateToken();
        }, 30 * 60 * 1000); // 30 минут (миллисекундээр)

        return () => {
            // Эвэнт болон интервал цэвэрлэх
            window.removeEventListener('storage', validateToken);
            clearInterval(interval);
        };
    }, []);

    return isAuthenticated;
};

export default useAdminAuth;
