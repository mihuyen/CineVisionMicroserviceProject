export default function dateConvertForTicket(date) {
    // Hiển thị tiếng Việt thay vì tiếng Thổ Nhĩ Kỳ
    // vi-VN sẽ trả "1 tháng 11" và "Thứ Hai/Thứ Ba/..."
    const day = new Date(date).toLocaleDateString("vi-VN", {
        month: 'long',
        day: 'numeric'
    });
    const dayName = new Date(date).toLocaleDateString("vi-VN", {
        weekday: "long",
    });
    const d = new Date(date);
    const today = new Date();
    const isToday = d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();

    return (
        <div>
            {isToday ? (
                <h4 id="today" className="pt-2 text-primary">Hôm nay</h4>
            ): <h5>{day}</h5>} 
            
            {!isToday ? (
                <h5 onClick={() => {
                    document.getElementById("today").className = "pt-2"
                }}>{dayName}</h5> 
            ): null} 
        </div>
    );
    
}
