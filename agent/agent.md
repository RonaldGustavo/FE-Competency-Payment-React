this my plan:
- refactor my code agar semua logic state di pindahkan menggunakan redux seperti module invoice, wallet, refund, dashboard, payment

integrasi api berikut pada module refund 
- integrasi api untuk create request refund untuk role merchant, dan tambahkan validasi juga agar request refund datenya ga boleh kurang dari hari ini, dan penjagaan error dari response api 
curl -X POST http://localhost:3000/api/refunds \
  -H "Authorization: Bearer MERCHANT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"invoice_id": "UUID_INVOICE", "reason": "Barang tidak sesuai"}'
Review Refund (Admin):


- integrasi api untuk approve / reject refund pada refund modul untuk role admin
curl -X PATCH http://localhost:3000/api/refunds/REFUND_ID/review \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "approve", "note": "Disetujui"}'

- integrasi api get list refund dan buatkan ui untuk filternya juga, table sesuaikan sama balikan api nya saja
curl -X GET "http://localhost:3000/api/refunds?status=REQUESTED&page=1&per_page=10&search=budi" \
  -H "Authorization: Bearer ADMIN_TOKEN"

integrasi api berikut pada module dashboard 
- integrasi api berikut pada modul dashboard saya 
curl -X GET http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer TOKEN"
Response summary:
{
  "summary": {
    "total_invoice": 20,
    "total_paid": 12,
    "total_failed": 3,
    "total_expired": 2,
    "total_paid_amount": "5000000.00",
    "total_refund_amount": "500000.00"
  }
}