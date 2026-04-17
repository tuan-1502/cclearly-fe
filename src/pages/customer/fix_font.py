
import os

file_path = r'd:\swp\cclearly-fe\src\pages\customer\BestSellerPage.jsx'

with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Replace patterns
replacements = [
    ('Dữ liệu SẢN PHẨM khng h?p l?. Vui lng th? l?i sau.', 'Dữ liệu sản phẩm không hợp lệ. Vui lòng thử lại sau.'),
    ('Khng th? t?i Dữ liệu SẢN PHẨM. Vui lng th? l?i sau.', 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.'),
    ("'Gng knh'", "'Gọng kính'"),
    ("'Trng knh'", "'Tròng kính'"),
    (' Những thiết kế biểu tượng du?c khch hng CClearly lựa chọn nhi?u\n            nh?t', ' Những thiết kế biểu tượng được khách hàng CClearly lựa chọn nhiều nhất'),
    ('placeholder="Tm SẢN PHẨM hot theo tn, m t? ho?c m SKU..."', 'placeholder="Tìm sản phẩm hot theo tên, mô tả hoặc mã SKU..."'),
    ('? \'Gng knh\'', "? 'Gọng kính'"),
    (': \'Trng knh\'', ": 'Tròng kính'"),
    ('dnh gi', 'đánh giá'),
    ('Khng tm th?y SẢN PHẨM ph h?p', 'Không tìm thấy sản phẩm phù hợp'),
    ('Th? d?i t? kha ho?c ch?n l?i danh m?c d? xem thm g?i .', 'Thử đổi từ khóa hoặc chọn lại danh mục để xem thêm gợi ý.'),
]

for old, new in replacements:
    # Use a more flexible replace since characters might vary
    # Replace the replacement char \ufffd with a regex-like match or just try common variations
    content = content.replace(old, new)

# One more pass for specific broken words if they remain
content = content.replace('khng', 'không')
content = content.replace('knh', 'kính')
content = content.replace('du?c', 'được')
content = content.replace('khch hng', 'khách hàng')
content = content.replace('nhi?u', 'nhiều')
content = content.replace('nh?t', 'nhất')
content = content.replace('Tm', 'Tìm')
content = content.replace('m t?', 'mô tả')
content = content.replace('dnh gi', 'đánh giá')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
