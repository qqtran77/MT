'use client';

import { useState } from 'react';

interface SocialPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'zalo';
  content: string;
  media?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt?: string;
  publishedAt?: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  branch: string;
}

interface SocialAccount {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'zalo';
  name: string;
  followers: number;
  connected: boolean;
  lastPost: string;
}

const SOCIAL_ACCOUNTS: SocialAccount[] = [
  { platform:'facebook', name:'Chuỗi Kinh Doanh CKD', followers:12450, connected:true, lastPost:'2 giờ trước' },
  { platform:'instagram', name:'@ckd.official', followers:8320, connected:true, lastPost:'1 ngày trước' },
  { platform:'tiktok', name:'@ckd_vn', followers:24100, connected:true, lastPost:'3 ngày trước' },
  { platform:'zalo', name:'CKD Official', followers:5680, connected:false, lastPost:'1 tuần trước' },
];

const MOCK_POSTS: SocialPost[] = [
  { id:'1', platform:'facebook', content:'🌟 KHAI TRƯƠNG CHI NHÁNH MỚI! Chuỗi Kinh Doanh CKD hân hạnh thông báo khai trương chi nhánh Cafe tại Quận 7. Giảm 50% tất cả đồ uống trong ngày khai trương 01/06!', status:'published', publishedAt:'2024-05-28 10:00', likes:342, comments:89, shares:156, reach:8420, branch:'Cafe CKD Q.3' },
  { id:'2', platform:'instagram', content:'☀️ Mùa hè đã đến! Combo Cafe + Rạp Phim siêu tiết kiệm chỉ từ 199k. Đặt ngay qua app CKD, nhận ưu đãi thêm 10% 🎬☕\n\n#CKD #CafeRạpPhim #MùaHèUuĐãi', status:'published', publishedAt:'2024-05-27 09:00', likes:567, comments:43, shares:78, reach:12300, branch:'Tất cả' },
  { id:'3', platform:'tiktok', content:'Video Tour Phòng Suite Hạng Sang - Khách sạn CKD Grand Q.1 🏨✨ Xem full video để khám phá không gian nghỉ dưỡng đẳng cấp!', status:'published', publishedAt:'2024-05-25 18:00', likes:1240, comments:234, shares:89, reach:45600, branch:'Khách sạn Grand Q.1' },
  { id:'4', platform:'facebook', content:'🎉 CHƯƠNG TRÌNH HÈ RỰC RỠ - Giảm 30% tất cả dịch vụ từ 01/06 đến 31/08!\n\n✅ Khách sạn Deluxe từ 1.050.000đ/đêm\n✅ Vé xem phim từ 63.000đ\n✅ Combo cafe từ 139.000đ\n\nĐặt ngay: ckd.vn', status:'scheduled', scheduledAt:'2024-06-01 08:00', likes:0, comments:0, shares:0, reach:0, branch:'Tất cả' },
  { id:'5', platform:'instagram', content:'Hậu trường buổi đào tạo nhân viên CKD tháng 6 💪 Đội ngũ chuyên nghiệp, tận tâm - Chúng tôi luôn sẵn sàng phục vụ bạn!\n\n#CKD #TeamCKD #Training', status:'draft', likes:0, comments:0, shares:0, reach:0, branch:'Tất cả' },
  { id:'6', platform:'zalo', content:'📢 Thông báo: Lịch nghỉ lễ Quốc Khánh 2/9. Toàn bộ chi nhánh CKD hoạt động bình thường. Đặt phòng sớm để có giá tốt nhất!', status:'failed', likes:0, comments:0, shares:0, reach:0, branch:'Tất cả' },
];

const PLATFORM_CONFIG = {
  facebook: { label:'Facebook', color:'bg-blue-600', icon:'📘', textColor:'text-blue-600' },
  instagram: { label:'Instagram', color:'bg-gradient-to-r from-purple-500 to-pink-500', icon:'📸', textColor:'text-purple-600' },
  tiktok: { label:'TikTok', color:'bg-black', icon:'🎵', textColor:'text-gray-800' },
  zalo: { label:'Zalo', color:'bg-blue-500', icon:'💬', textColor:'text-blue-500' },
};

const STATUS_CONFIG = {
  draft: { label:'Bản nháp', color:'bg-gray-100 text-gray-600' },
  scheduled: { label:'Đã lên lịch', color:'bg-blue-100 text-blue-700' },
  published: { label:'Đã đăng', color:'bg-green-100 text-green-700' },
  failed: { label:'Lỗi', color:'bg-red-100 text-red-700' },
};

export default function SocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_POSTS);
  const [platform, setPlatform] = useState<'all'|'facebook'|'instagram'|'tiktok'|'zalo'>('all');
  const [statusFilter, setStatusFilter] = useState<'all'|'draft'|'scheduled'|'published'|'failed'>('all');
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState({ platform:'facebook' as any, content:'', scheduledAt:'', branch:'Tất cả' });

  const filtered = posts.filter(p => {
    if (platform !== 'all' && p.platform !== platform) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const totalFollowers = SOCIAL_ACCOUNTS.filter(a=>a.connected).reduce((s,a)=>s+a.followers,0);
  const totalReach = posts.filter(p=>p.status==='published').reduce((s,p)=>s+p.reach,0);
  const totalEngagement = posts.filter(p=>p.status==='published').reduce((s,p)=>s+p.likes+p.comments+p.shares,0);

  function handlePost(asDraft: boolean) {
    const newPost: SocialPost = {
      id: Date.now().toString(),
      platform: compose.platform,
      content: compose.content,
      status: asDraft ? 'draft' : compose.scheduledAt ? 'scheduled' : 'published',
      scheduledAt: compose.scheduledAt || undefined,
      publishedAt: (!asDraft && !compose.scheduledAt) ? new Date().toISOString().slice(0,16).replace('T',' ') : undefined,
      likes:0, comments:0, shares:0, reach:0,
      branch: compose.branch,
    };
    setPosts(prev => [newPost, ...prev]);
    setShowCompose(false);
    setCompose({ platform:'facebook', content:'', scheduledAt:'', branch:'Tất cả' });
  }

  return (
    <div className="space-y-6">
      {/* Connected Accounts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SOCIAL_ACCOUNTS.map(acc => (
          <div key={acc.platform} className={`bg-white rounded-xl border-2 ${acc.connected ? 'border-green-200' : 'border-dashed border-gray-300'} p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{PLATFORM_CONFIG[acc.platform].icon}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${acc.connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {acc.connected ? '✓ Kết nối' : 'Chưa kết nối'}
              </span>
            </div>
            <p className="font-bold text-gray-800 text-sm">{PLATFORM_CONFIG[acc.platform].label}</p>
            <p className="text-xs text-gray-500 truncate">{acc.name}</p>
            {acc.connected ? (
              <>
                <p className="text-lg font-bold text-blue-600 mt-1">{acc.followers.toLocaleString('vi-VN')}</p>
                <p className="text-xs text-gray-400">Người theo dõi · {acc.lastPost}</p>
              </>
            ) : (
              <button className="mt-2 w-full bg-blue-600 text-white text-xs py-1.5 rounded-lg hover:bg-blue-700 transition font-semibold">
                Kết nối ngay
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-800">{totalFollowers.toLocaleString('vi-VN')}</p>
          <p className="text-sm text-gray-500">Tổng người theo dõi</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-blue-600">{totalReach.toLocaleString('vi-VN')}</p>
          <p className="text-sm text-gray-500">Tổng lượt tiếp cận</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-purple-600">{totalEngagement.toLocaleString('vi-VN')}</p>
          <p className="text-sm text-gray-500">Tổng tương tác</p>
        </div>
      </div>

      {/* Compose + Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {(['all','facebook','instagram','tiktok','zalo'] as const).map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${platform===p?'bg-[#1a3a5c] text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {p==='all' ? 'Tất cả' : `${PLATFORM_CONFIG[p].icon} ${PLATFORM_CONFIG[p].label}`}
            </button>
          ))}
        </div>
        <button onClick={() => setShowCompose(!showCompose)}
          className="bg-[#1a3a5c] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition">
          ✏️ Soạn bài viết
        </button>
      </div>

      {/* Compose Form */}
      {showCompose && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">✏️ Soạn bài đăng mạng xã hội</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nền tảng</label>
              <select value={compose.platform} onChange={e=>setCompose({...compose,platform:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="facebook">📘 Facebook</option>
                <option value="instagram">📸 Instagram</option>
                <option value="tiktok">🎵 TikTok</option>
                <option value="zalo">💬 Zalo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Chi nhánh</label>
              <select value={compose.branch} onChange={e=>setCompose({...compose,branch:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Tất cả</option>
                <option>Khách sạn Grand Q.1</option>
                <option>Cafe CKD Q.3</option>
                <option>Rạp CKD Q.7</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Lên lịch đăng (để trống = đăng ngay)</label>
              <input type="datetime-local" value={compose.scheduledAt} onChange={e=>setCompose({...compose,scheduledAt:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nội dung bài viết *</label>
            <textarea value={compose.content} onChange={e=>setCompose({...compose,content:e.target.value})} rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập nội dung bài viết..." />
            <p className="text-xs text-gray-400 mt-1">{compose.content.length} ký tự</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handlePost(false)} disabled={!compose.content}
              className="bg-[#1a3a5c] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition disabled:opacity-40">
              {compose.scheduledAt ? '⏰ Lên lịch đăng' : '🚀 Đăng ngay'}
            </button>
            <button onClick={() => handlePost(true)} disabled={!compose.content}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-40">
              💾 Lưu nháp
            </button>
            <button onClick={() => setShowCompose(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition">Hủy</button>
          </div>
        </div>
      )}

      {/* Filter by status */}
      <div className="flex gap-2 flex-wrap">
        {(['all','published','scheduled','draft','failed'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${statusFilter===s?'bg-[#1a3a5c] text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s==='all'?'Tất cả':STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.map(post => (
          <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{PLATFORM_CONFIG[post.platform].icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-sm">{PLATFORM_CONFIG[post.platform].label}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[post.status].color}`}>
                      {STATUS_CONFIG[post.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {post.publishedAt ? `Đã đăng: ${post.publishedAt}` : post.scheduledAt ? `Lên lịch: ${post.scheduledAt}` : 'Bản nháp'}
                    {post.branch !== 'Tất cả' && ` · ${post.branch}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-blue-600 hover:text-blue-800" title="Sửa">✏️</button>
                <button onClick={() => setPosts(prev => prev.filter(p=>p.id!==post.id))} className="text-sm text-red-500 hover:text-red-700" title="Xóa">🗑️</button>
              </div>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed mb-3">{post.content}</p>
            {post.status === 'published' && (
              <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1.5 text-sm text-gray-500"><span>❤️</span><span className="font-semibold text-gray-700">{post.likes.toLocaleString()}</span></span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500"><span>💬</span><span className="font-semibold text-gray-700">{post.comments.toLocaleString()}</span></span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500"><span>🔁</span><span className="font-semibold text-gray-700">{post.shares.toLocaleString()}</span></span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500 ml-auto"><span>👁️</span><span className="font-semibold text-blue-600">{post.reach.toLocaleString()}</span> tiếp cận</span>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-200">Chưa có bài viết nào</div>}
      </div>
    </div>
  );
}
