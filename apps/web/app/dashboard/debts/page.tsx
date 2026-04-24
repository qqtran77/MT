'use client';

import { useState } from 'react';

type DebtType = 'receivable' | 'payable';
type DebtStatus = 'pending' | 'partial' | 'paid' | 'overdue';

interface Debt {
  id: string;
  type: DebtType;
  party: string;
  phone: string;
  description: string;
  originalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: DebtStatus;
  branch: string;
  createdAt: string;
  notes: string;
}

const MOCK_DEBTS: Debt[] = [
  { id:'1', type:'receivable', party:'Nguyễn Văn An', phone:'0901234567', description:'Tiền phòng Suite tháng 5', originalAmount:5600000, paidAmount:2800000, dueDate:'2024-06-15', status:'partial', branch:'Khách sạn Grand Q.1', createdAt:'2024-05-01', notes:'Khách xác nhận thanh toán nốt ngày 15/6' },
  { id:'2', type:'receivable', party:'Công ty ABC', phone:'0287654321', description:'Đặt phòng hội nghị tháng 6', originalAmount:15000000, paidAmount:0, dueDate:'2024-06-01', status:'overdue', branch:'Khách sạn Grand Q.1', createdAt:'2024-05-10', notes:'Đã nhắc 2 lần, chưa phản hồi' },
  { id:'3', type:'payable', party:'NCC Đồ uống Minh Phát', phone:'0912345678', description:'Nhập nguyên liệu tháng 5', originalAmount:8500000, paidAmount:8500000, dueDate:'2024-05-31', status:'paid', branch:'Cafe CKD Q.3', createdAt:'2024-05-05', notes:'' },
  { id:'4', type:'receivable', party:'Trần Thị Bích', phone:'0923456789', description:'Vé xem phim nhóm - công ty XYZ', originalAmount:3600000, paidAmount:3600000, dueDate:'2024-05-20', status:'paid', branch:'Rạp CKD Q.7', createdAt:'2024-05-15', notes:'' },
  { id:'5', type:'payable', party:'NCC Thiết bị Thành Long', phone:'0934567890', description:'Bảo trì máy lạnh phòng 201-205', originalAmount:12000000, paidAmount:6000000, dueDate:'2024-07-01', status:'partial', branch:'Khách sạn Grand Q.1', createdAt:'2024-05-20', notes:'Thanh toán 50% trước, còn lại khi nghiệm thu' },
  { id:'6', type:'receivable', party:'Lê Hoàng Nam', phone:'0945678901', description:'Thuê phòng VIP sự kiện', originalAmount:25000000, paidAmount:0, dueDate:'2024-06-30', status:'pending', branch:'Khách sạn Grand Q.1', createdAt:'2024-05-25', notes:'Đặt cọc 30% vào ngày 01/06' },
  { id:'7', type:'payable', party:'NCC Thực phẩm Hoàng Gia', phone:'0956789012', description:'Nguyên liệu nhà hàng tháng 6', originalAmount:22000000, paidAmount:0, dueDate:'2024-06-10', status:'pending', branch:'Khách sạn Grand Q.1', createdAt:'2024-05-28', notes:'' },
  { id:'8', type:'receivable', party:'Phạm Thị Lan', phone:'0967890123', description:'Combo cafe tháng - 3 tháng', originalAmount:2670000, paidAmount:890000, dueDate:'2024-06-05', status:'partial', branch:'Cafe CKD Q.3', createdAt:'2024-05-01', notes:'' },
];

const TYPE_CONFIG: Record<DebtType,{label:string;color:string;bg:string}> = {
  receivable: { label:'Phải thu', color:'text-green-700', bg:'bg-green-100' },
  payable: { label:'Phải trả', color:'text-red-700', bg:'bg-red-100' },
};

const STATUS_CONFIG: Record<DebtStatus,{label:string;color:string}> = {
  pending: { label:'Chờ thanh toán', color:'bg-yellow-100 text-yellow-700' },
  partial: { label:'Thanh toán 1 phần', color:'bg-blue-100 text-blue-700' },
  paid: { label:'Đã thanh toán', color:'bg-green-100 text-green-700' },
  overdue: { label:'Quá hạn', color:'bg-red-100 text-red-700' },
};

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>(MOCK_DEBTS);
  const [typeFilter, setTypeFilter] = useState<'all'|DebtType>('all');
  const [statusFilter, setStatusFilter] = useState<'all'|DebtStatus>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [payModal, setPayModal] = useState<Debt | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [form, setForm] = useState({ type:'receivable' as DebtType, party:'', phone:'', description:'', originalAmount:0, dueDate:'', branch:'Khách sạn Grand Q.1', notes:'' });

  const filtered = debts.filter(d => {
    if (typeFilter !== 'all' && d.type !== typeFilter) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (search && !d.party.toLowerCase().includes(search.toLowerCase()) && !d.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalReceivable = debts.filter(d=>d.type==='receivable').reduce((s,d)=>s+(d.originalAmount-d.paidAmount),0);
  const totalPayable = debts.filter(d=>d.type==='payable').reduce((s,d)=>s+(d.originalAmount-d.paidAmount),0);
  const overdue = debts.filter(d=>d.status==='overdue').length;

  function handlePay() {
    if (!payModal) return;
    setDebts(prev => prev.map(d => {
      if (d.id !== payModal.id) return d;
      const newPaid = Math.min(d.originalAmount, d.paidAmount + payAmount);
      const newStatus: DebtStatus = newPaid >= d.originalAmount ? 'paid' : 'partial';
      return { ...d, paidAmount: newPaid, status: newStatus };
    }));
    setPayModal(null);
    setPayAmount(0);
  }

  function handleAddDebt() {
    const debt: Debt = {
      id: Date.now().toString(),
      ...form, paidAmount: 0,
      status: 'pending',
      createdAt: new Date().toISOString().slice(0,10),
    };
    setDebts(prev => [...prev, debt]);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-green-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-green-600 mb-1">💚 Tổng phải thu</p>
          <p className="text-xl font-bold text-green-700">{totalReceivable.toLocaleString('vi-VN')}đ</p>
          <p className="text-xs text-gray-400 mt-0.5">{debts.filter(d=>d.type==='receivable'&&d.status!=='paid').length} khoản chưa thu</p>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-600 mb-1">❤️ Tổng phải trả</p>
          <p className="text-xl font-bold text-red-700">{totalPayable.toLocaleString('vi-VN')}đ</p>
          <p className="text-xs text-gray-400 mt-0.5">{debts.filter(d=>d.type==='payable'&&d.status!=='paid').length} khoản chưa trả</p>
        </div>
        <div className="bg-white border border-orange-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-orange-600 mb-1">⚠️ Quá hạn</p>
          <p className="text-xl font-bold text-orange-700">{overdue}</p>
          <p className="text-xs text-gray-400 mt-0.5">khoản cần xử lý ngay</p>
        </div>
        <div className="bg-white border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 mb-1">📊 Chênh lệch</p>
          <p className={`text-xl font-bold ${totalReceivable >= totalPayable ? 'text-green-600' : 'text-red-600'}`}>
            {totalReceivable >= totalPayable ? '+' : '-'}{Math.abs(totalReceivable - totalPayable).toLocaleString('vi-VN')}đ
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Thu - Chi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {(['all','receivable','payable'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${typeFilter===t?'bg-[#1a3a5c] text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t==='all'?'Tất cả':TYPE_CONFIG[t].label}
            </button>
          ))}
          <span className="text-gray-300">|</span>
          {(['all','pending','partial','overdue','paid'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${statusFilter===s?'bg-[#1a3a5c] text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s==='all'?'Mọi TT':STATUS_CONFIG[s]?.label||s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm đối tác..."
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44" />
          <button onClick={() => setShowForm(!showForm)}
            className="bg-[#1a3a5c] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition">
            + Thêm khoản nợ
          </button>
        </div>
      </div>

      {/* Add Debt Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">➕ Thêm khoản công nợ</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Loại</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value as DebtType})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="receivable">Phải thu</option>
                <option value="payable">Phải trả</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tên đối tác *</label>
              <input value={form.party} onChange={e=>setForm({...form,party:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tên khách hàng / NCC" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại</label>
              <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Số tiền (đ) *</label>
              <input type="number" value={form.originalAmount} onChange={e=>setForm({...form,originalAmount:+e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày đến hạn</label>
              <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Chi nhánh</label>
              <select value={form.branch} onChange={e=>setForm({...form,branch:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Khách sạn Grand Q.1</option>
                <option>Cafe CKD Q.3</option>
                <option>Rạp CKD Q.7</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Mô tả *</label>
              <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi chú</label>
              <input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAddDebt} disabled={!form.party || !form.description || !form.originalAmount}
              className="bg-[#1a3a5c] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition disabled:opacity-40">
              ➕ Thêm khoản nợ
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition">Hủy</button>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {payModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-gray-800 text-lg mb-4">💳 Ghi nhận thanh toán</h3>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="font-semibold text-gray-800">{payModal.party}</p>
              <p className="text-sm text-gray-500">{payModal.description}</p>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-600">Tổng nợ:</span>
                <span className="font-bold">{payModal.originalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Đã trả:</span>
                <span className="font-semibold text-green-600">{payModal.paidAmount.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-sm text-red-600">Còn lại:</span>
                <span className="text-red-600">{(payModal.originalAmount - payModal.paidAmount).toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Số tiền thanh toán (đ)</label>
            <input type="number" value={payAmount} onChange={e=>setPayAmount(+e.target.value)}
              max={payModal.originalAmount - payModal.paidAmount}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />
            <div className="flex gap-2 mb-3">
              {[25,50,75,100].map(pct => (
                <button key={pct} onClick={() => setPayAmount(Math.round((payModal.originalAmount - payModal.paidAmount) * pct / 100))}
                  className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 py-1.5 rounded-lg font-semibold transition">
                  {pct}%
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={handlePay} disabled={!payAmount}
                className="flex-1 bg-[#1a3a5c] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#152e4a] transition disabled:opacity-40">
                ✅ Xác nhận
              </button>
              <button onClick={() => { setPayModal(null); setPayAmount(0); }}
                className="flex-1 border border-gray-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <span className="font-semibold text-gray-700 text-sm">Danh sách công nợ ({filtered.length})</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                <th className="text-left px-4 py-3">Đối tác</th>
                <th className="text-left px-4 py-3">Loại</th>
                <th className="text-left px-4 py-3">Mô tả</th>
                <th className="text-right px-4 py-3">Tổng nợ</th>
                <th className="text-right px-4 py-3">Đã trả</th>
                <th className="text-right px-4 py-3">Còn lại</th>
                <th className="text-left px-4 py-3">Tiến độ</th>
                <th className="text-center px-4 py-3">Đến hạn</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
                <th className="text-center px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(debt => {
                const remaining = debt.originalAmount - debt.paidAmount;
                const progress = Math.round(debt.paidAmount / debt.originalAmount * 100);
                const isOverdue = debt.status !== 'paid' && new Date(debt.dueDate) < new Date();
                return (
                  <tr key={debt.id} className={`hover:bg-gray-50 transition-colors ${isOverdue ? 'bg-red-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{debt.party}</p>
                      <p className="text-xs text-gray-400">{debt.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_CONFIG[debt.type].bg} ${TYPE_CONFIG[debt.type].color}`}>
                        {TYPE_CONFIG[debt.type].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700 text-xs">{debt.description}</p>
                      {debt.notes && <p className="text-xs text-gray-400 mt-0.5 italic">{debt.notes}</p>}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">{debt.originalAmount.toLocaleString('vi-VN')}đ</td>
                    <td className="px-4 py-3 text-right text-green-600">{debt.paidAmount.toLocaleString('vi-VN')}đ</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">{remaining.toLocaleString('vi-VN')}đ</td>
                    <td className="px-4 py-3">
                      <div className="w-24">
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-gray-500">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{width:`${progress}%`}} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-xs">
                      <p className={isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}>{debt.dueDate}</p>
                      {isOverdue && <p className="text-red-500 text-[10px]">QUÁ HẠN</p>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[debt.status].color}`}>
                        {STATUS_CONFIG[debt.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {debt.status !== 'paid' && (
                        <button onClick={() => { setPayModal(debt); setPayAmount(debt.originalAmount - debt.paidAmount); }}
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2.5 py-1 rounded-lg font-semibold transition">
                          💰 Trả nợ
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-10 text-gray-400">Không có công nợ nào</div>}
        </div>
      </div>
    </div>
  );
}
