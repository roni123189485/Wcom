import React, { useState, useEffect } from 'react';
import { Order, Product } from '../types';
import { REVIEWS } from '../data';
import { 
  X, Check, Clock, Truck, ShieldCheck, Trash2, 
  Search, Calendar, ShoppingBag, Phone, MapPin, 
  DollarSign, Package, TrendingUp, AlertCircle, RefreshCw, 
  Settings, Sliders, LayoutGrid, Tag, Star, LogOut, 
  MessageSquare, Menu, Lock, Sparkles, FileText, Smartphone,
  Upload, Plus, Image as ImageIcon, Edit2
} from 'lucide-react';

interface AdminPanelProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  onClose: () => void;
  siteConfig: {
    headerPhone: string;
    buttonPhone: string;
    price1: number;
    price2: number;
    heroTitle: string;
    heroSubtitle: string;
    ml1?: number;
    ml2?: number;
    deliveryInsideDhaka?: number;
    deliveryOutsideDhaka?: number;
    productTitle?: string;
    productDescription?: string;
    productImages?: string[];
    products?: Product[];
  };
  onUpdateSiteConfig: (newConfig: AdminPanelProps['siteConfig']) => void;
  reviews: { id: string; name: string; text: string; rating: number; date: string; avatar?: string }[];
  onUpdateReviews: (newReviews: { id: string; name: string; text: string; rating: number; date: string; avatar?: string }[]) => void;
}

type AdminTab = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'phones' 
  | 'special' 
  | 'offers' 
  | 'reviews' 
  | 'content' 
  | 'settings';

export default function AdminPanel({ 
  orders, 
  onUpdateStatus, 
  onDeleteOrder, 
  onClose,
  siteConfig,
  onUpdateSiteConfig,
  reviews,
  onUpdateReviews
}: AdminPanelProps) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form States
  const [headerPhoneState, setHeaderPhoneState] = useState(siteConfig.headerPhone);
  const [buttonPhoneState, setButtonPhoneState] = useState(siteConfig.buttonPhone);
  const [price1State, setPrice1State] = useState(siteConfig.price1);
  const [price2State, setPrice2State] = useState(siteConfig.price2);
  const [heroTitleState, setHeroTitleState] = useState(siteConfig.heroTitle);
  const [heroSubtitleState, setHeroSubtitleState] = useState(siteConfig.heroSubtitle);
  const [ml1State, setMl1State] = useState(siteConfig.ml1 !== undefined ? siteConfig.ml1 : 100);
  const [ml2State, setMl2State] = useState(siteConfig.ml2 !== undefined ? siteConfig.ml2 : 200);
  const [deliveryInsideDhakaState, setDeliveryInsideDhakaState] = useState(siteConfig.deliveryInsideDhaka !== undefined ? siteConfig.deliveryInsideDhaka : 70);
  const [deliveryOutsideDhakaState, setDeliveryOutsideDhakaState] = useState(siteConfig.deliveryOutsideDhaka !== undefined ? siteConfig.deliveryOutsideDhaka : 130);
  
  // Custom Product Form States
  const [productTitleState, setProductTitleState] = useState(siteConfig.productTitle || 'আহফি পারফিউম');
  const [productDescriptionState, setProductDescriptionState] = useState(siteConfig.productDescription || 'আহফি প্রিমিয়াম এক্সট্রেট ডি পারফিউম একটি অসাধারণ ও দীর্ঘস্থায়ী সুবাসের সমাহার। এটি আপনার ব্যক্তিত্বকে আরও মার্জিত এবং সুচারু করে তোলে। ত্বক-বান্ধব এবং উন্নত কোয়ালিটির এই সুগন্ধি যেকোনো অনুষ্ঠানে ব্যবহারযোগ্য।');
  const [productImagesState, setProductImagesState] = useState<string[]>(siteConfig.productImages || []);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [productsState, setProductsState] = useState<Product[]>(siteConfig.products || []);

  // Variant editing state
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [variantTitle, setVariantTitle] = useState('');
  const [variantMl, setVariantMl] = useState<number>(50);
  const [variantPrice, setVariantPrice] = useState<number>(1290);
  const [variantOriginalPrice, setVariantOriginalPrice] = useState<number>(1650);
  const [variantDesc, setVariantDesc] = useState('');
  const [variantBadge, setVariantBadge] = useState('');
  const [variantImage, setVariantImage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Custom Reviews Form States
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewDate, setNewReviewDate] = useState(() => {
    return new Date().toLocaleDateString('bn-BD');
  });
  const [promoBanner, setPromoBanner] = useState('অর্ডার করলেই পাচ্ছেন ফ্রি হোম ডেলিভারি!');

  // Status Alerts
  const [alertMsg, setAlertMsg] = useState('');

  // Sync state if siteConfig updates externally
  useEffect(() => {
    setHeaderPhoneState(siteConfig.headerPhone);
    setButtonPhoneState(siteConfig.buttonPhone);
    setPrice1State(siteConfig.price1);
    setPrice2State(siteConfig.price2);
    setHeroTitleState(siteConfig.heroTitle);
    setHeroSubtitleState(siteConfig.heroSubtitle);
    setMl1State(siteConfig.ml1 !== undefined ? siteConfig.ml1 : 100);
    setMl2State(siteConfig.ml2 !== undefined ? siteConfig.ml2 : 200);
    setDeliveryInsideDhakaState(siteConfig.deliveryInsideDhaka !== undefined ? siteConfig.deliveryInsideDhaka : 70);
    setDeliveryOutsideDhakaState(siteConfig.deliveryOutsideDhaka !== undefined ? siteConfig.deliveryOutsideDhaka : 130);
    setProductTitleState(siteConfig.productTitle || 'আহফি পারফিউম');
    setProductDescriptionState(siteConfig.productDescription || 'আহফি প্রিমিয়াম এক্সট্রেট ডি পারফিউম একটি অসাধারণ ও দীর্ঘস্থায়ী সুবাসের সমাহার। এটি আপনার ব্যক্তিত্বকে আরও মার্জিত এবং সুচারু করে তোলে। ত্বক-বান্ধব এবং উন্নত কোয়ালিটির এই সুগন্ধি যেকোনো অনুষ্ঠানে ব্যবহারযোগ্য।');
    setProductImagesState(siteConfig.productImages || []);
    setProductsState(siteConfig.products || []);
  }, [siteConfig]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '78907890') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('ভুল পিন কোড! পুনরায় চেষ্টা করুন।');
    }
  };

  const handleSavePhones = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteConfig({
      ...siteConfig,
      headerPhone: headerPhoneState.trim(),
      buttonPhone: buttonPhoneState.trim()
    });
    triggerAlert('ক্রেতা নাম্বার সফলভাবে পরিবর্তন করা হয়েছে!');
  };

  const handleSaveOffers = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteConfig({
      ...siteConfig,
      price1: Number(price1State),
      price2: Number(price2State),
      ml1: Number(ml1State),
      ml2: Number(ml2State),
      deliveryInsideDhaka: Number(deliveryInsideDhakaState),
      deliveryOutsideDhaka: Number(deliveryOutsideDhakaState)
    });
    triggerAlert('অফার মূল্য, বোতলের সাইজ (ML) এবং ডেলিভারি চার্জ সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteConfig({
      ...siteConfig,
      heroTitle: heroTitleState.trim(),
      heroSubtitle: heroSubtitleState.trim()
    });
    triggerAlert('ওয়েবসাইট কন্টেন্ট সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleSaveProducts = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteConfig({
      ...siteConfig,
      productTitle: productTitleState.trim(),
      productDescription: productDescriptionState.trim(),
      productImages: productImagesState,
      products: productsState
    });
    triggerAlert('প্রোডাক্ট বিবরণ, ছবিসমূহ ও অফারসমূহ সফলভাবে সংরক্ষণ করা হয়েছে!');
  };

  const handleSaveSpecial = (e: React.FormEvent) => {
    e.preventDefault();
    triggerAlert('স্পেশাল সেটিংস আপডেট করা হয়েছে!');
  };

  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantTitle.trim()) {
      triggerAlert('দয়া করে প্যাকেজের নাম দিন!');
      return;
    }
    const newVariant: Product = {
      id: `prod-${Date.now()}`,
      title: variantTitle.trim(),
      ml: Number(variantMl),
      price: Number(variantPrice),
      originalPrice: Number(variantOriginalPrice),
      description: variantDesc.trim(),
      badge: variantBadge.trim(),
      image: variantImage
    };
    setProductsState([...productsState, newVariant]);
    // Clear inputs
    setVariantTitle('');
    setVariantMl(50);
    setVariantPrice(1290);
    setVariantOriginalPrice(1650);
    setVariantDesc('');
    setVariantBadge('');
    setVariantImage('');
    setShowAddForm(false);
    triggerAlert('নতুন প্যাকেজ তালিকায় যোগ করা হয়েছে! এটি চিরস্থায়ী করতে নিচে "প্রোডাক্ট সেটিংস ও ছবিসমূহ সংরক্ষণ করুন" বাটনে ক্লিক করুন।');
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProdId(prod.id);
    setVariantTitle(prod.title);
    setVariantMl(prod.ml);
    setVariantPrice(prod.price);
    setVariantOriginalPrice(prod.originalPrice);
    setVariantDesc(prod.description);
    setVariantBadge(prod.badge || '');
    setVariantImage(prod.image || '');
    setShowAddForm(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantTitle.trim()) {
      triggerAlert('দয়া করে প্যাকেজের নাম দিন!');
      return;
    }
    const updated = productsState.map(p => {
      if (p.id === editingProdId) {
        return {
          ...p,
          title: variantTitle.trim(),
          ml: Number(variantMl),
          price: Number(variantPrice),
          originalPrice: Number(variantOriginalPrice),
          description: variantDesc.trim(),
          badge: variantBadge.trim(),
          image: variantImage
        };
      }
      return p;
    });
    setProductsState(updated);
    // Clear
    setEditingProdId(null);
    setVariantTitle('');
    setVariantMl(50);
    setVariantPrice(1290);
    setVariantOriginalPrice(1650);
    setVariantDesc('');
    setVariantBadge('');
    setVariantImage('');
    triggerAlert('প্যাকেজটি আপডেট করা হয়েছে! এটি চিরস্থায়ী করতে নিচে "প্রোডাক্ট সেটিংস ও ছবিসমূহ সংরক্ষণ করুন" বাটনে ক্লিক করুন।');
  };

  const handleDeleteVariant = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে এই প্যাকেজটি ডিলিট করতে চান?')) {
      const updated = productsState.filter(p => p.id !== id);
      setProductsState(updated);
      triggerAlert('প্যাকেজটি তালিকা থেকে বাদ দেওয়া হয়েছে! এটি চিরস্থায়ী করতে নিচে "প্রোডাক্ট সেটিংস ও ছবিসমূহ সংরক্ষণ করুন" বাটনে ক্লিক করুন।');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) {
      triggerAlert('দয়া করে নাম এবং মন্তব্য পূরণ করুন!');
      return;
    }

    const newRev = {
      id: `REV-${Date.now()}`,
      name: newReviewName.trim(),
      text: newReviewText.trim(),
      rating: newReviewRating,
      date: newReviewDate || new Date().toLocaleDateString('bn-BD'),
      avatar: "" // No avatar is used or displayed!
    };

    onUpdateReviews([newRev, ...reviews]);
    setNewReviewName('');
    setNewReviewText('');
    setNewReviewRating(5);
    triggerAlert('রিভিউটি সফলভাবে যোগ করা হয়েছে!');
  };

  const handleDeleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    onUpdateReviews(updated);
    triggerAlert('রিভিউটি ডিলিট করা হয়েছে!');
  };

  const triggerAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 4000);
  };

  // Calculations for dashboard
  const totalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const approvedCount = orders.filter(o => o.status === 'Approved').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const completedCount = orders.filter(o => o.status === 'Completed').length;

  // Filter orders based on query and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate today's orders
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todaysOrders = orders.filter(o => new Date(o.createdAt) >= todayStart);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit"><Clock className="w-3.5 h-3.5" /> অপেক্ষমাণ</span>;
      case 'Approved':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit"><Check className="w-3.5 h-3.5" /> অনুমোদিত</span>;
      case 'Shipped':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit"><Truck className="w-3.5 h-3.5" /> শিপড</span>;
      case 'Completed':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit"><ShieldCheck className="w-3.5 h-3.5" /> সফল</span>;
      case 'Cancelled':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit"><X className="w-3.5 h-3.5" /> বাতিল</span>;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutGrid },
    { id: 'products', label: 'প্রোডাক্ট ম্যানেজ করুন', icon: Package },
    { id: 'orders', label: 'অর্ডার ম্যানেজ করুন', icon: ShoppingBag, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'phones', label: 'ক্রেতা নাম্বার পরিবর্তন', icon: Smartphone },
    { id: 'special', label: 'স্পেশাল সেটিংস', icon: Sparkles },
    { id: 'offers', label: 'অফার সেটিংস', icon: Tag },
    { id: 'reviews', label: 'রিভিউ ম্যানেজ করুন', icon: Star },
    { id: 'content', label: 'পেজ কন্টেন্ট ম্যানেজ', icon: FileText },
    { id: 'settings', label: 'সেটিংস', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4">
      <div className="bg-[#f8fafc] w-full max-w-7xl h-full md:h-[92vh] flex flex-col md:flex-row md:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {!isAuthenticated ? (
          /* Authentication Screen with exact mockup login credentials */
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-red-950/40 via-slate-950 to-slate-950 z-0" />
            
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center relative z-10 backdrop-blur-sm">
              <div className="bg-red-500/10 text-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-500/20">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">আহফি পারফিউম অ্যাডমিন</h3>
              <p className="text-xs text-slate-400 mb-8">অর্ডার ম্যানেজমেন্ট ও সাইট কন্ট্রোল সিস্টেম</p>
              
              <form onSubmit={handleLogin} className="space-y-5 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">অ্যাডমিন পিন কোড</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full text-center tracking-widest text-xl font-bold bg-slate-950 border border-slate-800 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs text-rose-500 mt-2 flex items-center gap-1.5 justify-center">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {pinError}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-white font-extrabold py-3.5 rounded-xl transition duration-300 shadow-lg cursor-pointer"
                >
                  প্রবেশ করুন
                </button>
              </form>

              {/* Credentials help text removed for security */}
            </div>
          </div>
        ) : (
          /* Main Dashboard with left sidebar and tab systems */
          <>
            {/* Sidebar Left */}
            <aside className={`w-72 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-transform md:translate-x-0 ${
              isSidebarOpen ? 'translate-x-0 fixed inset-y-0 left-0 z-50 shadow-2xl' : '-translate-x-full absolute md:relative'
            } md:flex h-full`}>
              {/* Sidebar Header */}
              <div className="p-5 border-b border-slate-800/80 bg-slate-950/50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-red-800 to-amber-600 flex items-center justify-center font-black text-white text-lg">A</div>
                  <div>
                    <h1 className="font-extrabold text-sm text-white tracking-wide uppercase">AHFI PERFUME</h1>
                    <p className="text-[10px] text-amber-400/90 font-bold font-mono tracking-widest">ADMIN WORKSPACE</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as AdminTab);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-sm transition duration-200 cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-r from-red-800 to-amber-700/80 text-white shadow-md' 
                          : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 shrink-0 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>কন্ট্রোল প্যানেল অনলাইন</span>
                </div>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="w-full bg-slate-800/50 hover:bg-red-950/30 hover:text-red-400 text-slate-400 font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-slate-800/40"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  লগআউট (Logout)
                </button>
              </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
              <div 
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs"
              />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Header */}
              <header className="bg-white border-b border-slate-200/80 h-16 px-4 md:px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition text-slate-600"
                  >
                    <Menu className="w-5.5 h-5.5" />
                  </button>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    {activeTab === 'dashboard' && 'ড্যাশবোর্ড ওভারভিউ'}
                    {activeTab === 'products' && 'প্রোডাক্ট ম্যানেজ করুন'}
                    {activeTab === 'orders' && 'অর্ডার ম্যানেজ করুন'}
                    {activeTab === 'phones' && 'ক্রেতা ফোন নাম্বার পরিবর্তন'}
                    {activeTab === 'special' && 'স্পেশাল ব্যানার ও প্রমোশন'}
                    {activeTab === 'offers' && 'অফার সেটিংস (মূল্য নির্ধারণ)'}
                    {activeTab === 'reviews' && 'রিভিউ ও কাস্টমার ফিডব্যাক'}
                    {activeTab === 'content' && 'ল্যান্ডিং পেজ কন্টেন্ট'}
                    {activeTab === 'settings' && 'অ্যাডমিন সেটিংস'}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 border border-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> বন্ধ করুন
                  </button>
                </div>
              </header>

              {/* Central Area Scroll Container */}
              <div className="flex-1 overflow-y-auto bg-slate-50">
                
                {alertMsg && (
                  <div className="m-4 md:mx-6 md:mt-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{alertMsg}</span>
                  </div>
                )}

                {/* TAB CONTENT: DASHBOARD */}
                {activeTab === 'dashboard' && (
                  <div className="p-4 md:p-6 space-y-6">
                    {/* Quick Metrics from the Mockup */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Stat 1 */}
                      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">মোট অর্ডার</span>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              <TrendingUp className="w-2.5 h-2.5" /> +12%
                            </span>
                          </div>
                          <p className="text-2xl md:text-3xl font-black text-slate-900 mt-2">{orders.length}টি</p>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-3 font-medium">লাইফটাইম সফল ও পেন্ডিং অর্ডার</p>
                      </div>

                      {/* Stat 2 */}
                      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">মোট প্রোডাক্ট</span>
                            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              +0%
                            </span>
                          </div>
                          <p className="text-2xl md:text-3xl font-black text-slate-900 mt-2">২টি</p>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-3 font-medium">১ বোতল ও ২ বোতল অফার প্যাকেজ</p>
                      </div>

                      {/* Stat 3 */}
                      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">মোট রিভিউ</span>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              <TrendingUp className="w-2.5 h-2.5" /> +8%
                            </span>
                          </div>
                          <p className="text-2xl md:text-3xl font-black text-slate-900 mt-2">৩৫৬টি</p>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-3 font-medium">কাস্টমারদের দেওয়া রেটিং ও রিভিউ</p>
                      </div>

                      {/* Stat 4 */}
                      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">আজকের অর্ডার</span>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              <TrendingUp className="w-2.5 h-2.5" /> +15%
                            </span>
                          </div>
                          <p className="text-2xl md:text-3xl font-black text-slate-900 mt-2">{todaysOrders.length || 2}টি</p>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-3 font-medium">আজকের দিনে সংগৃহীত নতুন অর্ডার</p>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6">
                      {/* Left: Quick Actions Table */}
                      <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-red-800" /> সাম্প্রতিক অর্ডার সমূহ (সর্বশেষ ৪টি)
                          </h3>
                          <button 
                            onClick={() => setActiveTab('orders')}
                            className="text-xs text-red-800 hover:text-red-900 font-bold transition hover:underline"
                          >
                            সকল অর্ডার দেখুন →
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-600 border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                                <th className="pb-3 text-center">তারিখ</th>
                                <th className="pb-3 pl-4">কাস্টমার তথ্য</th>
                                <th className="pb-3 text-center">পরিমাণ</th>
                                <th className="pb-3 text-right">বিল</th>
                                <th className="pb-3 text-center">স্ট্যাটাস</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {orders.slice(0, 4).map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/40">
                                  <td className="py-3 text-center text-slate-500 whitespace-nowrap">
                                    {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                                  </td>
                                  <td className="py-3 pl-4">
                                    <span className="font-bold text-slate-800 block">{order.name}</span>
                                    <span className="text-[10px] text-slate-400 font-mono block">{order.phone}</span>
                                  </td>
                                  <td className="py-3 text-center font-bold text-slate-700">
                                    {order.quantity}টি ({order.packageType === '1bottle' ? '১ বোতল' : '২ বোতল'})
                                  </td>
                                  <td className="py-3 text-right font-black text-red-800">
                                    ৳ {order.total}
                                  </td>
                                  <td className="py-3 text-center">
                                    {getStatusBadge(order.status)}
                                  </td>
                                </tr>
                              ))}
                              {orders.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="py-8 text-center text-slate-400">কোনো অর্ডার নেই</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Right Side Info widgets from diagram */}
                      <div className="lg:col-span-4 space-y-6">
                        {/* Admin Panel Credentials Widget */}
                        <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 text-slate-800 font-black text-6xl select-none pointer-events-none opacity-20">🔑</div>
                          
                          <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                            <Lock className="w-4.5 h-4.5 text-amber-400" /> অ্যাডমিন প্যানেল অ্যাক্সেস
                          </h4>
                          
                          <div className="space-y-2 text-xs font-medium">
                            <div className="flex justify-between py-1 border-b border-slate-800/60">
                              <span className="text-slate-400">অ্যাডমিন লগইন পেজ:</span>
                              <span className="font-mono text-white">yourwebsite.com/admin</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-800/60">
                              <span className="text-slate-400">ইউজারনেম:</span>
                              <span className="font-mono text-amber-400 font-bold">admin</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-800/60">
                              <span className="text-slate-400">পাসওয়ার্ড:</span>
                              <span className="font-mono text-amber-400 font-bold">78907890</span>
                            </div>
                          </div>
                          
                          <p className="text-[10px] text-amber-200/70 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/10 leading-normal">
                            * এই পাসওয়ার্ডটি নিরাপদ রাখুন এবং কাউকে শেয়ার করবেন না। এটি আপনার সাইটের কন্টেন্ট ও অর্ডার ডেটা সুরক্ষিত রাখে।
                          </p>
                        </div>

                        {/* What Admin Panel controls widget */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                          <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" /> অ্যাডমিন প্যানেলে কি কি থাকবে?
                          </h4>
                          <ul className="text-xs text-slate-500 space-y-1.5 font-bold pl-4 list-disc">
                            <li>ড্যাশবোর্ড - রিয়েল টাইম মেট্রিকেস বিশ্লেষণ</li>
                            <li>প্রোডাক্ট ম্যানেজ - রেগুলার ও অফার প্রাইস পরিবর্তন</li>
                            <li>অর্ডার ম্যানেজ - কাস্টমার অর্ডার অনুমোদন ও বাতিল</li>
                            <li>ফোন নাম্বার পরিবর্তন - ইনস্ট্যান্ট আপডেট</li>
                            <li>অফার সেটিংস - দাম ও বুস্টার সেটিংস</li>
                            <li>রিভিউ ম্যানেজ - কাস্টমার মতামত রিভিউ লিস্ট</li>
                            <li>কন্টেন্ট ম্যানেজ - ল্যান্ডিং পেজ শিরোনাম ও সাবটাইটেল</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: PRODUCTS MANAGE */}
                {activeTab === 'products' && (
                  <div className="p-4 md:p-6 space-y-6">
                    <form onSubmit={handleSaveProducts} className="space-y-6">
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* Left Side: Product Text Customizer */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-5">
                          <div className="pb-3 border-b border-slate-100">
                            <h3 className="font-extrabold text-slate-800 text-md flex items-center gap-2">
                              <Package className="w-5 h-5 text-red-800" /> প্রোডাক্ট বিবরণ পরিবর্তন
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">আপনার পারফিউমের নাম ও কাস্টম বিবরণ এখান থেকে নির্ধারণ করুন</p>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide">পারফিউমের নাম (Product Title)</label>
                              <input
                                type="text"
                                value={productTitleState}
                                onChange={(e) => setProductTitleState(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 font-bold"
                                placeholder="যেমন: AHFI Premium Luxury Perfume"
                                required
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide">পারফিউমের বিবরণ (Product Description)</label>
                              <textarea
                                value={productDescriptionState}
                                onChange={(e) => setProductDescriptionState(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 text-sm leading-relaxed"
                                placeholder="যেমন: আহফি প্রিমিয়াম এক্সট্রেট ডি পারফিউম একটি অসাধারণ ও দীর্ঘস্থায়ী সুবাসের সমাহার..."
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right Side: Multiple Product Image Uploader */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-5">
                          <div className="pb-3 border-b border-slate-100">
                            <h3 className="font-extrabold text-slate-800 text-md flex items-center gap-2">
                              <ImageIcon className="w-5 h-5 text-red-800" /> প্রোডাক্ট ছবি গ্যালারি (যত খুশি তত!)
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">আপনার প্রোডাক্টের একাধিক ছবি আপলোড করুন। এগুলো স্লাইডার আকারে ল্যান্ডিং পেজে দেখাবে।</p>
                          </div>

                          <div className="space-y-4">
                            {/* Drag and Drop Upload Area */}
                            <div className="border-2 border-dashed border-slate-200 hover:border-red-800/40 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-50/50 transition relative group">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  const files = e.target.files;
                                  if (!files) return;
                                  Array.from(files).forEach((file: any) => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === 'string') {
                                        setProductImagesState(prev => [...prev, reader.result as string]);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  });
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div className="space-y-2 pointer-events-none">
                                <div className="mx-auto w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 group-hover:scale-110 transition">
                                  <Upload className="w-5 h-5 text-slate-500" />
                                </div>
                                <div className="text-xs text-slate-600 font-bold">
                                  ক্লিক করুন অথবা ছবি এখানে ড্র্যাগ করুন
                                </div>
                                <p className="text-[10px] text-slate-400">JPG, PNG বা WEBP (একাধিক একসাথে আপলোড সম্ভব)</p>
                              </div>
                            </div>

                            {/* Or Paste URL */}
                            <div className="space-y-2">
                              <label className="block text-xs font-extrabold text-slate-500 uppercase">অথবা ছবির লিংক দিন (Image URL)</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={imageUrlInput}
                                  onChange={(e) => setImageUrlInput(e.target.value)}
                                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 text-xs"
                                  placeholder="https://example.com/perfume.jpg"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (imageUrlInput.trim()) {
                                      setProductImagesState(prev => [...prev, imageUrlInput.trim()]);
                                      setImageUrlInput('');
                                    }
                                  }}
                                  className="bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                                >
                                  যোগ করুন
                                </button>
                              </div>
                            </div>

                            {/* Images Grid */}
                            <div className="space-y-2.5">
                              <h4 className="text-xs font-extrabold text-slate-700">বর্তমান ছবিসমূহ ({productImagesState.length} টি)</h4>
                              {productImagesState.length === 0 ? (
                                <div className="p-4 bg-slate-50 text-center rounded-xl border border-slate-100 text-xs text-slate-400 font-medium">
                                  কোনো আপলোড করা ছবি নেই। ল্যান্ডিং পেজে ডিফল্ট ছবি প্রদর্শিত হবে।
                                </div>
                              ) : (
                                <div className="grid grid-cols-4 gap-3 max-h-[220px] overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                  {productImagesState.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden bg-white shadow-xs group">
                                      <img
                                        src={img}
                                        alt={`Product ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setProductImagesState(prev => prev.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md hover:scale-110 transition duration-150 cursor-pointer z-10"
                                        title="ছবি মুছুন"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                      <span className="absolute bottom-0 left-0 right-0 bg-slate-950/60 text-white text-[9px] text-center font-bold py-0.5">
                                        ছবি {idx + 1}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                          </div>
                        </div>

                      </div>

                      {/* Section: Product Variants / Package Offers */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-6 mt-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-3 border-b border-slate-100">
                          <div>
                            <h3 className="font-extrabold text-slate-800 text-md flex items-center gap-2 text-left">
                              <Tag className="w-5 h-5 text-red-800" /> প্রোডাক্ট প্যাকেজ/অফার সমূহ
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5 text-left">ল্যান্ডিং পেজে প্রদর্শিত প্যাকেজ, সাইজ (ML) ও অফার মূল্য নিয়ন্ত্রণ করুন। আপনি যত খুশি তত অফার যোগ করতে পারবেন।</p>
                          </div>
                          
                          {!showAddForm && !editingProdId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProdId(null);
                                setVariantTitle('');
                                setVariantMl(50);
                                setVariantPrice(1290);
                                setVariantOriginalPrice(1650);
                                setVariantDesc('');
                                setVariantBadge('');
                                setShowAddForm(true);
                              }}
                              className="bg-red-800 hover:bg-red-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition duration-150 flex items-center gap-1.5 self-start cursor-pointer shadow-xs"
                            >
                              <Plus className="w-4 h-4" /> নতুন প্যাকেজ যোগ করুন
                            </button>
                          )}
                        </div>

                        {/* Add/Edit Variant Form Block */}
                        {(showAddForm || editingProdId) && (
                          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4 animate-in slide-in-from-top-4 duration-200 text-left">
                            <h4 className="font-extrabold text-sm text-red-800 flex items-center gap-1.5">
                              {editingProdId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                              {editingProdId ? 'প্যাকেজটি সংশোধন করুন' : 'নতুন অফার/প্যাকেজ যোগ করুন'}
                            </h4>

                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700">প্যাকেজের নাম (যেমন: ২টি পারফিউম (ডাবল ধামাকা)) *</label>
                                <input
                                  type="text"
                                  value={variantTitle}
                                  onChange={(e) => setVariantTitle(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800"
                                  placeholder="যেমন: ৩টি পারফিউম (সুপার ধামাকা)"
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700">সাইজ (ML) *</label>
                                  <input
                                    type="number"
                                    value={variantMl}
                                    onChange={(e) => setVariantMl(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 font-mono font-bold"
                                    required
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700">অফার মূল্য *</label>
                                  <input
                                    type="number"
                                    value={variantPrice}
                                    onChange={(e) => setVariantPrice(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 font-mono font-bold"
                                    required
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700">আসল মূল্য *</label>
                                  <input
                                    type="number"
                                    value={variantOriginalPrice}
                                    onChange={(e) => setVariantOriginalPrice(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 font-mono font-bold"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700">সংক্ষিপ্ত বিবরণ (যেমন: ৩টি লাক্সারি আহফি পারফিউম বোতল)</label>
                                <input
                                  type="text"
                                  value={variantDesc}
                                  onChange={(e) => setVariantDesc(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800"
                                  placeholder="যেমন: ৩টি লাক্সারি প্রিমিয়াম বোতল ও ফ্রি উপহার"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700">স্পেশাল ব্যাজ (যেমন: বেস্ট সেলার, ৫০% ছাড় - ঐচ্ছিক)</label>
                                <input
                                  type="text"
                                  value={variantBadge}
                                  onChange={(e) => setVariantBadge(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800"
                                  placeholder="যেমন: বেস্ট সেলার"
                                />
                              </div>

                              <div className="sm:col-span-2 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                                <label className="block text-xs font-bold text-slate-700">প্যাকেজ ছবি (Package Image - ঐচ্ছিক)</label>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                  {variantImage ? (
                                    <div className="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 mx-auto sm:mx-0">
                                      <img src={variantImage} className="w-full h-full object-cover" alt="Package preview" />
                                      <button
                                        type="button"
                                        onClick={() => setVariantImage('')}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition shadow-md"
                                        title="ছবি মুছুন"
                                      >
                                        <X className="w-3.5 h-3.5 stroke-[3]" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-100 shrink-0 text-slate-400 mx-auto sm:mx-0">
                                      <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                                    </div>
                                  )}
                                  <div className="flex-1 relative text-center sm:text-left">
                                    <div className="relative inline-block">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                              if (typeof reader.result === 'string') {
                                                setVariantImage(reader.result);
                                              }
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                      />
                                      <div className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-lg transition flex items-center gap-1.5 justify-center cursor-pointer shadow-xs">
                                        <Upload className="w-3.5 h-3.5" />
                                        প্যাকেজ ছবি আপলোড করুন
                                      </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1.5">এই নির্দিষ্ট প্যাকেজ/অফারটির জন্য আলাদা একটি ছবি আপলোড করুন (ছবি আপলোড করা ঐচ্ছিক)</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddForm(false);
                                  setEditingProdId(null);
                                }}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
                              >
                                বাতিল
                              </button>
                              <button
                                type="button"
                                onClick={editingProdId ? handleSaveEdit : handleAddVariant}
                                className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white font-extrabold text-xs rounded-lg transition cursor-pointer"
                              >
                                {editingProdId ? 'হালনাগাদ করুন' : 'তালিকায় যোগ করুন'}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* List of Dynamic Variants */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          {productsState.map((prod) => (
                            <div 
                              key={prod.id}
                              className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-red-800/20 transition relative flex flex-col justify-between text-left animate-in fade-in duration-200"
                            >
                              {prod.badge && (
                                <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase">
                                  {prod.badge}
                                </span>
                              )}
                              <div className="flex gap-3">
                                {prod.image && (
                                  <div className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0 shadow-xs">
                                    <img src={prod.image} className="w-full h-full object-cover" alt={prod.title} />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h4 className="font-extrabold text-slate-800 text-sm">{prod.title}</h4>
                                  <p className="text-[10px] font-bold text-red-800 mt-0.5">সাইজ: {prod.ml} মিলি (ml)</p>
                                  <div className="flex items-center gap-1.5 mt-2">
                                    <span className="text-md font-black text-slate-800">৳ {prod.price}</span>
                                    {prod.originalPrice > prod.price && (
                                      <span className="text-xs text-slate-400 line-through font-mono">৳ {prod.originalPrice}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-400 font-medium mt-2">{prod.description}</p>

                              <div className="flex justify-end gap-1.5 mt-4 pt-3 border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(prod)}
                                  className="text-slate-500 hover:text-slate-800 p-1.5 rounded hover:bg-slate-200/50 transition cursor-pointer"
                                  title="সম্পাদনা"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteVariant(prod.id)}
                                  className="text-red-600 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition cursor-pointer"
                                  title="মুছুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          {productsState.length === 0 && (
                            <div className="col-span-2 p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 font-medium">
                              কোনো অফার/প্যাকেজ যোগ করা নেই। দয়া করে একটি অফার বা প্যাকেজ যোগ করুন।
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Save Button */}
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold py-4 px-6 rounded-2xl shadow-md transition duration-200 cursor-pointer text-md text-center flex items-center justify-center gap-2 mt-6"
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                        প্রোডাক্ট সেটিংস ও ছবিসমূহ সংরক্ষণ করুন
                      </button>

                    </form>
                  </div>
                )}

                {/* TAB CONTENT: ORDER MANAGE */}
                {activeTab === 'orders' && (
                  <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                      
                      {/* Search and Filters */}
                      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                        <div className="relative flex-1">
                          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="নাম, মোবাইল ফোন বা ঠিকানা দিয়ে অর্ডার খুঁজুন..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal bg-slate-50"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 font-bold shrink-0">
                          <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer ${
                              statusFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            সব ({orders.length})
                          </button>
                          <button
                            onClick={() => setStatusFilter('Pending')}
                            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer ${
                              statusFilter === 'Pending' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                          >
                            অপেক্ষমাণ ({orders.filter(o=>o.status === 'Pending').length})
                          </button>
                          <button
                            onClick={() => setStatusFilter('Approved')}
                            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer ${
                              statusFilter === 'Approved' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                          >
                            অনুমোদিত ({orders.filter(o=>o.status === 'Approved').length})
                          </button>
                          <button
                            onClick={() => setStatusFilter('Shipped')}
                            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer ${
                              statusFilter === 'Shipped' ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                            }`}
                          >
                            শিপড ({orders.filter(o=>o.status === 'Shipped').length})
                          </button>
                          <button
                            onClick={() => setStatusFilter('Completed')}
                            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer ${
                              statusFilter === 'Completed' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            সফল ({orders.filter(o=>o.status === 'Completed').length})
                          </button>
                        </div>
                      </div>

                      {/* Orders Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 border-collapse">
                          <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                            <tr>
                              <th className="py-3 px-4 text-center">অর্ডার ID ও তারিখ</th>
                              <th className="py-3 px-4">কাস্টমার তথ্য</th>
                              <th className="py-3 px-4">প্যাকেজ ও পরিমাণ</th>
                              <th className="py-3 px-4 text-center">ডেলিভারি এরিয়া</th>
                              <th className="py-3 px-4 text-right">মোট বিল</th>
                              <th className="py-3 px-4">স্ট্যাটাস</th>
                              <th className="py-3 px-4 text-center">অ্যাকশন</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                            {filteredOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-slate-50/50 transition">
                                <td className="py-4 px-4 text-center whitespace-nowrap">
                                  <div className="text-xs text-slate-900 font-black">{order.id}</div>
                                  <div className="text-[10px] text-slate-400 mt-1">
                                    {new Date(order.createdAt).toLocaleDateString('bn-BD')} {new Date(order.createdAt).toLocaleTimeString('bn-BD')}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="text-slate-900 text-sm font-black">{order.name}</div>
                                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-mono">
                                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>{order.phone}</span>
                                  </div>
                                  <div className="text-xs text-slate-500 flex items-start gap-1 mt-1 max-w-xs">
                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                                    <span className="line-clamp-2 font-medium">{order.address}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                  <div className="text-slate-800 text-xs">
                                    {order.packageType === '1bottle' ? '১টি পারফিউম (৳' + siteConfig.price1 + ')' : 'দুটি পারফিউম (৳' + siteConfig.price2 + ')'}
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-1 font-medium">
                                    পরিমাণ: <span className="font-bold text-slate-700">{order.quantity}টি</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-center whitespace-nowrap">
                                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                                    order.deliveryArea === 'inside_dhaka' 
                                      ? 'bg-sky-50 text-sky-700 border-sky-100' 
                                      : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                  }`}>
                                    {order.deliveryArea === 'inside_dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-right whitespace-nowrap text-red-800 font-black text-md">
                                  ৳ {order.total}
                                  <div className="text-[9px] text-slate-400 font-normal mt-0.5">ডেলিভারি চার্জ: ৳ {order.deliveryCharge}</div>
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                  {getStatusBadge(order.status)}
                                </td>
                                <td className="py-4 px-4 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-2">
                                    <select
                                      value={order.status}
                                      onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                                      className="text-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none font-bold text-slate-700 cursor-pointer"
                                    >
                                      <option value="Pending">অপেক্ষমাণ</option>
                                      <option value="Approved">অনুমোদিত</option>
                                      <option value="Shipped">পাঠানো হয়েছে</option>
                                      <option value="Completed">সফল</option>
                                      <option value="Cancelled">বাতিল</option>
                                    </select>
                                    <button
                                      onClick={() => {
                                        if (confirm('আপনি কি এই অর্ডারটি স্থায়ীভাবে ডিলিট করতে চান?')) {
                                          onDeleteOrder(order.id);
                                          triggerAlert('অর্ডারটি স্থায়ীভাবে বাতিল/ডিলিট করা হয়েছে।');
                                        }
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                      title="ডিলিট করুন"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                              <tr>
                                <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">কোনো অর্ডার পাওয়া যায়নি।</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: CHANGE PHONE NUMBERS */}
                {activeTab === 'phones' && (
                  <div className="p-4 md:p-6 max-w-2xl mx-auto w-full">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                        <Smartphone className="w-5.5 h-5.5 text-red-800" />
                        <div>
                          <h3 className="font-extrabold text-slate-800 text-sm">ক্রেতা ও কন্টাক্ট নাম্বার পরিবর্তন</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">সাইটের বিভিন্ন বাটন ও লিংকের মোবাইল নাম্বারসমূহ পরিবর্তন করুন</p>
                        </div>
                      </div>

                      <form onSubmit={handleSavePhones} className="space-y-4 font-bold text-slate-700 text-sm">
                        <div className="space-y-1.5">
                          <label className="block">হেডার ও ফুটার ফোন নাম্বার</label>
                          <input
                            type="text"
                            value={headerPhoneState}
                            onChange={(e) => setHeaderPhoneState(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 font-mono"
                            placeholder="যেমন: 01864444414"
                            required
                          />
                          <p className="text-[10px] text-slate-400 font-medium">* এটি হেডার ও ফুটারে বাংলায় প্রদর্শিত কন্টাক্ট নাম্বার হিসেবে দেখাবে।</p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block">অর্ডার বোতাম ও ওয়াটসঅ্যাপ লিংক নাম্বার</label>
                          <input
                            type="text"
                            value={buttonPhoneState}
                            onChange={(e) => setButtonPhoneState(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 font-mono"
                            placeholder="যেমন: 01864444414"
                            required
                          />
                          <p className="text-[10px] text-slate-400 font-medium">* কাস্টমারদের অর্ডার বাটন ক্লিক করতে বা সরাসরি WhatsApp-এ বার্তা পাঠাতে এই নাম্বার ব্যবহার করা হবে।</p>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-xs transition duration-200 mt-4 cursor-pointer"
                        >
                          সংরক্ষণ করুন
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: SPECIAL SETTINGS */}
                {activeTab === 'special' && (
                  <div className="p-4 md:p-6 max-w-2xl mx-auto w-full">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                        <Sparkles className="w-5.5 h-5.5 text-amber-500" />
                        <div>
                          <h3 className="font-extrabold text-slate-800 text-sm">স্পেশাল ব্যানার ও প্রমোশন সেটিংস</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">অফার ব্যানার ও আকর্ষণীয় প্রমোশন বিজ্ঞপ্তি লেখা পরিবর্তন করুন</p>
                        </div>
                      </div>

                      <form onSubmit={handleSaveSpecial} className="space-y-4 font-bold text-slate-700 text-sm">
                        <div className="space-y-1.5">
                          <label className="block">ডেলিভারি অফার টেক্সট</label>
                          <input
                            type="text"
                            value={promoBanner}
                            onChange={(e) => setPromoBanner(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800"
                            placeholder="যেমন: অর্ডার করলেই পাচ্ছেন ফ্রি হোম ডেলিভারি!"
                          />
                          <p className="text-[10px] text-slate-400 font-medium">* এই প্রমোশনাল ব্যানারটি সাইটে কাস্টমারের আগ্রহ বৃদ্ধি করবে।</p>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-xs transition duration-200 mt-4 cursor-pointer"
                        >
                          সংরক্ষণ করুন
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: OFFER SETTINGS */}
                {activeTab === 'offers' && (
                  <div className="p-4 md:p-6 max-w-2xl mx-auto w-full">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                        <Tag className="w-5.5 h-5.5 text-red-800" />
                        <div>
                          <h3 className="font-extrabold text-slate-800 text-sm">অফার সেটিংস (প্রোডাক্ট মূল্য)</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">ল্যান্ডিং পেজের অফার প্যাকেজের মূল্য ও ছাড়ের হার নিয়ন্ত্রণ করুন</p>
                        </div>
                      </div>

                      <form onSubmit={handleSaveOffers} className="space-y-6 font-bold text-slate-700 text-sm">
                        {/* Perfume ML & Pricing Configuration */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-4">
                          <h4 className="font-extrabold text-xs text-red-800 uppercase tracking-wider">📦 পারফিউম প্যাকেজ সাইজ ও মূল্য নির্ধারণ</h4>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block">১ বোতল সাইজ (মিলি/ML)</label>
                              <input
                                type="number"
                                value={ml1State}
                                onChange={(e) => setMl1State(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 font-mono font-bold"
                                placeholder="যেমন: 100"
                                required
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="block">১ বোতল অফার মূল্য (৳)</label>
                              <input
                                type="number"
                                value={price1State}
                                onChange={(e) => setPrice1State(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 font-mono font-bold"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block">২ বোতল সাইজ (মিলি/ML)</label>
                              <input
                                type="number"
                                value={ml2State}
                                onChange={(e) => setMl2State(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 font-mono font-bold"
                                placeholder="যেমন: 200"
                                required
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="block">২ বোতল অফার মূল্য (৳)</label>
                              <input
                                type="number"
                                value={price2State}
                                onChange={(e) => setPrice2State(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 font-mono font-bold"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Delivery Charge Configuration */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-4">
                          <h4 className="font-extrabold text-xs text-red-800 uppercase tracking-wider">🚚 ডেলিভারি চার্জ সেটিংস</h4>
                          <p className="text-[11px] text-slate-400 font-medium leading-normal -mt-2">
                            * ফ্রি ডেলিভারি দিতে চাইলে চার্জের ঘরে <span className="font-bold text-red-700">0</span> (শূন্য) লিখুন।
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block">ঢাকার ভেতরে চার্জ (৳)</label>
                              <input
                                type="number"
                                value={deliveryInsideDhakaState}
                                onChange={(e) => setDeliveryInsideDhakaState(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 font-mono font-bold"
                                required
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="block">ঢাকার বাইরে চার্জ (৳)</label>
                              <input
                                type="number"
                                value={deliveryOutsideDhakaState}
                                onChange={(e) => setDeliveryOutsideDhakaState(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 font-mono font-bold"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-xs transition duration-200 cursor-pointer"
                        >
                          সংরক্ষণ করুন
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: REVIEWS MANAGE */}
                {activeTab === 'reviews' && (
                  <div className="p-4 md:p-6 space-y-6">
                    {/* Add Review Form */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="font-extrabold text-slate-800 text-sm">নতুন কাস্টমার রিভিউ যোগ করুন</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">ম্যানুয়ালি কোনো নতুন গ্রাহকের রিভিউ সাইটে যোগ করতে নিচের ফর্মটি ব্যবহার করুন</p>
                      </div>

                      <form onSubmit={handleAddReview} className="space-y-4 font-bold text-slate-700 text-sm">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="block">গ্রাহকের নাম</label>
                            <input
                              type="text"
                              value={newReviewName}
                              onChange={(e) => setNewReviewName(e.target.value)}
                              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800"
                              placeholder="যেমন: আহসান হাবিব"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block">তারিখ</label>
                            <input
                              type="text"
                              value={newReviewDate}
                              onChange={(e) => setNewReviewDate(e.target.value)}
                              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800"
                              placeholder="যেমন: ২ জুলাই, ২০২৬"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block">রেটিং স্টার</label>
                            <select
                              value={newReviewRating}
                              onChange={(e) => setNewReviewRating(Number(e.target.value))}
                              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800"
                            >
                              <option value={5}>⭐⭐⭐⭐⭐ (৫ স্টার)</option>
                              <option value={4}>⭐⭐⭐⭐ (৪ স্টার)</option>
                              <option value={3}>⭐⭐⭐ (৩ স্টার)</option>
                              <option value={2}>⭐⭐ (২ স্টার)</option>
                              <option value={1}>⭐ (১ স্টার)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block">রিভিউ মন্তব্য</label>
                          <textarea
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 min-h-[80px]"
                            placeholder="গ্রাহকের সুন্দর মন্তব্যটি এখানে লিখুন..."
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="bg-red-800 hover:bg-red-900 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md transition"
                        >
                          রিভিউ যোগ করুন
                        </button>
                      </form>
                    </div>

                    {/* Existing Reviews List with Delete options */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <div>
                          <h3 className="font-extrabold text-slate-800 text-md">বিদ্যমান কাস্টমার রিভিউসমূহ</h3>
                          <p className="text-xs text-slate-400 mt-0.5">ল্যান্ডিং পেজে প্রদর্শিত সব কাস্টমার রিভিউসমূহের তালিকা</p>
                        </div>
                        <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-1 rounded-full font-bold">মোট: {reviews.length} টি</span>
                      </div>

                      <div className="space-y-4">
                        {reviews.length === 0 ? (
                          <div className="text-center py-8 text-slate-400">কোনো রিভিউ নেই। নতুন রিভিউ যোগ করুন!</div>
                        ) : (
                          reviews.map((rev) => (
                            <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col md:flex-row gap-4 justify-between items-start">
                              <div className="flex gap-3 items-start">
                                {/* Letter Avatar instead of picture */}
                                <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-extrabold flex items-center justify-center shrink-0 border border-slate-300">
                                  {rev.name ? rev.name.charAt(0) : 'U'}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-800 text-sm">{rev.name}</h4>
                                  <div className="flex items-center gap-1 my-1 text-amber-500">
                                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                  </div>
                                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1 max-w-2xl">{rev.text}</p>
                                </div>
                              </div>
                              <div className="flex flex-row md:flex-col gap-2 items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                                <span className="text-[10px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">{rev.date}</span>
                                <button
                                  onClick={() => handleDeleteReview(rev.id)}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg border border-red-100 transition flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> ডিলিট
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}


                {/* TAB CONTENT: CONTENT MANAGE */}
                {activeTab === 'content' && (
                  <div className="p-4 md:p-6 max-w-3xl mx-auto w-full">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                        <FileText className="w-5.5 h-5.5 text-red-800" />
                        <div>
                          <h3 className="font-extrabold text-slate-800 text-sm">ওয়েবসাইট শিরোনাম ও কন্টেন্ট ম্যানেজ করুন</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">হিরো সেকশনের প্রধান লেখা ও ইউএসপি সাবটাইটেল পরিবর্তন করুন</p>
                        </div>
                      </div>

                      <form onSubmit={handleSaveContent} className="space-y-4 font-bold text-slate-700 text-sm">
                        <div className="space-y-1.5">
                          <label className="block">হিরো সেকশন শিরোনাম (Hero Title)</label>
                          <input
                            type="text"
                            value={heroTitleState}
                            onChange={(e) => setHeroTitleState(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800"
                            placeholder="যেমন: এক ফোটাতেই ছড়িয়ে পড়ুক আপনার ব্যক্তিত্ব"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block">হিরো সেকশন সাবটাইটেল (Hero Subtitle)</label>
                          <textarea
                            value={heroSubtitleState}
                            onChange={(e) => setHeroSubtitleState(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 min-h-[100px]"
                            placeholder="যেমন: দীর্ঘস্থায়ী সুগন্ধ • প্রিমিয়াম কোয়ালিটি • স্কিন ফ্রেন্ডলি"
                            required
                          />
                          <p className="text-[10px] text-slate-400 font-medium">
                            * প্রতিটি বৈশিষ্ট্য আলাদা করতে বুলেট বা মধ্যবিন্দু (<span className="font-black text-slate-700">•</span>) ব্যবহার করুন। এগুলো স্বয়ংক্রিয়ভাবে ছোট ব্যাজে রূপান্তর হবে।
                          </p>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-xs transition duration-200 mt-4 cursor-pointer"
                        >
                          সংরক্ষণ করুন
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: GENERAL SETTINGS */}
                {activeTab === 'settings' && (
                  <div className="p-4 md:p-6 max-w-xl mx-auto w-full">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                        <Settings className="w-5.5 h-5.5 text-slate-700" />
                        <div>
                          <h3 className="font-extrabold text-slate-800 text-sm">সাধারণ অ্যাডমিন সেটিংস</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">ক্রেডেনশিয়াল এবং পিন কোড তথ্য</p>
                        </div>
                      </div>

                      <div className="space-y-4 text-xs font-bold text-slate-600">
                        <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-150">
                          <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5"><Lock className="w-4 h-4 text-amber-500" /> অ্যাডমিন লগইন বিবরণ</h4>
                          <p>বর্তমান ইউজারনেম: <span className="font-mono text-slate-800 font-black">admin</span></p>
                          <p>বর্তমান লগইন পিন: <span className="font-mono text-slate-800 font-black">78907890</span></p>
                        </div>

                        <p className="text-[10px] text-slate-400 font-medium leading-normal">
                          * আপনি যদি পিন কোড পরিবর্তন করতে চান, তবে দয়া করে `/src/components/AdminPanel.tsx` সোর্স কোডের `handleLogin` মেথডটি লক্ষ্য করুন। নিরাপত্তার স্বার্থে পিন পরিবর্তন ডিরেক্টরি কোড থেকেই করা ভালো।
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
