const dateConvert = (date) => {
    // Đổi sang tiếng Việt: ví dụ "3 tháng 11 2025"
    return new Date(date).toLocaleDateString("vi-VN", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export default dateConvert;