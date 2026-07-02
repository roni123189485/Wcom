import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Phone, MapPin, CheckCircle2, ShieldCheck, 
  ChevronDown, MessageSquare, Menu, Award, Clock, Truck, 
  ArrowRight, Undo, Sparkles, Heart, Star, Database, Check,
  User, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, Product } from './types';
import { FAQS, REVIEWS, ADVANTAGES } from './data';
import AdminPanel from './components/AdminPanel';
import { supabase } from './supabase';

// Import the generated premium perfume image
const perfumeImage = "/src/assets/images/ahfi_perfume_1782975193030.jpg";

const DELIVERY_CHARGES = {
  inside_dhaka: 70,
  outside_dhaka: 130
};

const toBengaliNumber = (numStr: string) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return numStr.replace(/\d/g, (d) => bnDigits[parseInt(d)]);
};

export default function App() {
  // Site content configuration persisted in localStorage
  const [siteConfig, setSiteConfig] = useState(() => {
    const saved = localStorage.getItem('ahfi_perfume_site_config');
    const defaultData = {
      headerPhone: '01864444414',
      buttonPhone: '01864444414',
      price1: 1290,
      price2: 2400,
      ml1: 50,
      ml2: 100,
      deliveryInsideDhaka: 70,
      deliveryOutsideDhaka: 130,
      heroTitle: 'এক ফোটাতেই ছড়িয়ে পড়ুক আপনার ব্যক্তিত্ব',
      heroSubtitle: 'দীর্ঘস্থায়ী সুগন্ধ • প্রিমিয়াম কোয়ালিটি • স্কিন ফ্রেন্ডলি • ইউনিসেক্স পারফিউম',
      productTitle: 'আহফি পারফিউম',
      productDescription: 'আহফি প্রিমিয়াম এক্সট্রেট ডি পারফিউম একটি অসাধারণ ও দীর্ঘস্থায়ী সুবাসের সমাহার। এটি আপনার ব্যক্তিত্বকে আরও মার্জিত এবং সুচারু করে তোলে। ত্বক-বান্ধব এবং উন্নত কোয়ালিটির এই সুগন্ধি যেকোনো অনুষ্ঠানে ব্যবহারযোগ্য।',
      productImages: [
        "/src/assets/images/ahfi_perfume_1782975193030.jpg"
      ],
      products: [
        {
          id: 'prod-1',
          title: '১টি পারফিউম',
          ml: 50,
          price: 1290,
          originalPrice: 1650,
          description: '১টি লাক্সারি সিগনেচার আহফি পারফিউম বোতল',
          badge: ''
        },
        {
          id: 'prod-2',
          title: '২টি পারফিউম (ডাবল ধামাকা)',
          ml: 100,
          price: 2400,
          originalPrice: 3300,
          description: '২টি লাক্সারি আহফি পারফিউম বোতল (ডাবল ধামাকা)',
          badge: 'বেস্ট সেলার'
        }
      ] as Product[]
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrating old configs to dynamic products array if not already present
        if (!parsed.products || parsed.products.length === 0) {
          parsed.products = [
            {
              id: 'prod-1',
              title: '১টি পারফিউম',
              ml: parsed.ml1 || 50,
              price: parsed.price1 || 1290,
              originalPrice: (parsed.price1 || 1290) + 360,
              description: '১টি লাক্সারি সিগনেচার আহফি পারফিউম বোতল',
              badge: ''
            },
            {
              id: 'prod-2',
              title: '২টি পারফিউম (ডাবল ধামাকা)',
              ml: parsed.ml2 || 100,
              price: parsed.price2 || 2400,
              originalPrice: (parsed.price2 || 2400) + 900,
              description: '২টি লাক্সারি আহফি পারফিউম বোতল (ডাবল ধামাকা)',
              badge: 'বেস্ট সেলার'
            }
          ];
        }
        return {
          ...defaultData,
          ...parsed
        };
      } catch (e) {
        // Fallback below
      }
    }
    return defaultData;
  });

  const handleUpdateSiteConfig = async (newConfig: typeof siteConfig) => {
    setSiteConfig(newConfig);
    localStorage.setItem('ahfi_perfume_site_config', JSON.stringify(newConfig));
    try {
      await supabase.from('site_config').upsert([{ id: 1, config: newConfig }]);
    } catch (err) {
      console.error("Error saving site config to Supabase:", err);
    }
  };

  const imagesToDisplay = siteConfig.productImages && siteConfig.productImages.length > 0 
    ? siteConfig.productImages 
    : [perfumeImage];

  const productsList: Product[] = siteConfig.products && siteConfig.products.length > 0
    ? siteConfig.products
    : [];

  // Local persistence for customer reviews
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('ahfi_perfume_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return REVIEWS; // From './data'
  });

  const handleUpdateReviews = async (newReviews: typeof REVIEWS) => {
    setReviews(newReviews);
    localStorage.setItem('ahfi_perfume_reviews', JSON.stringify(newReviews));
    try {
      await supabase.from('reviews').delete().neq('id', 'dummy_clearing_id');
      const insertData = newReviews.map((r, i) => ({
        id: r.id || `rev-${Date.now()}-${i}`,
        name: r.name,
        rating: r.rating,
        text: r.text,
        date: r.date,
        avatar: r.avatar || '',
        created_at: new Date().toISOString()
      }));
      await supabase.from('reviews').insert(insertData);
    } catch (err) {
      console.error("Error saving reviews to Supabase:", err);
    }
  };

  // Local persistence for orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  // Checkout Form State
  const [selectedOffer, setSelectedOffer] = useState<string>(() => {
    const saved = localStorage.getItem('ahfi_perfume_site_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.products && parsed.products.length > 0) {
          return parsed.products[0].id;
        }
      } catch (e) {}
    }
    return 'prod-1';
  });
  const [deliveryArea, setDeliveryArea] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Form errors & submission states
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Floating notifications
  const [notification, setNotification] = useState<string | null>(null);

  // Active slide/image index for hero product images
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Load and synchronize data with Supabase on mount
  useEffect(() => {
    // 1. Initial local load for instant UI response
    const savedOrders = localStorage.getItem('ahfi_perfume_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Error parsing saved orders", e);
      }
    } else {
      // Seed initial dummy orders locally first
      const initialOrders: Order[] = [
        {
          id: 'AHFI-2026-001',
          name: 'তানজিমুল ইসলাম',
          phone: '01712345678',
          address: 'হাউস ১২, রোড ৪, ধানমন্ডি, ঢাকা',
          packageType: 'prod-1',
          quantity: 1,
          deliveryArea: 'inside_dhaka',
          subtotal: 1290,
          deliveryCharge: 70,
          total: 1360,
          status: 'Completed',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 3).toISOString()
        },
        {
          id: 'AHFI-2026-002',
          name: 'নাসরিন সুলতানা',
          phone: '01998765432',
          address: 'সবুজবাগ, ট্রাংক রোড, ফেনী সদর, ফেনী',
          packageType: 'prod-2',
          quantity: 1,
          deliveryArea: 'outside_dhaka',
          subtotal: 2400,
          deliveryCharge: 130,
          total: 2530,
          status: 'Shipped',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setOrders(initialOrders);
      localStorage.setItem('ahfi_perfume_orders', JSON.stringify(initialOrders));
    }

    // 2. Fetch fresh data from Supabase in the background
    const syncDataWithSupabase = async () => {
      try {
        // Fetch Site Config
        const { data: configData, error: configErr } = await supabase.from('site_config').select('config').eq('id', 1).maybeSingle();
        if (!configErr && configData && configData.config) {
          setSiteConfig(configData.config);
          localStorage.setItem('ahfi_perfume_site_config', JSON.stringify(configData.config));
        } else if (!configErr) {
          // If connection works but table is empty, seed it
          await supabase.from('site_config').upsert([{ id: 1, config: siteConfig }]);
        }

        // Fetch Reviews
        const { data: revData, error: revErr } = await supabase.from('reviews').select('*').order('created_at', { ascending: true });
        if (!revErr && revData && revData.length > 0) {
          const mappedReviews = revData.map(r => ({
            id: r.id,
            name: r.name,
            rating: r.rating,
            text: r.text,
            date: r.date,
            avatar: r.avatar || ''
          }));
          setReviews(mappedReviews);
          localStorage.setItem('ahfi_perfume_reviews', JSON.stringify(mappedReviews));
        } else if (!revErr) {
          // Seed reviews
          const seedData = reviews.map((r, i) => ({
            id: r.id || `rev-${i}`,
            name: r.name,
            rating: r.rating,
            text: r.text,
            date: r.date,
            avatar: r.avatar || '',
            created_at: new Date().toISOString()
          }));
          await supabase.from('reviews').insert(seedData);
        }

        // Fetch Orders
        const { data: orderData, error: orderErr } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!orderErr && orderData) {
          const mappedOrders: Order[] = orderData.map(o => ({
            id: o.id,
            name: o.name,
            phone: o.phone,
            address: o.address,
            packageType: o.package_type,
            quantity: o.quantity,
            deliveryArea: o.delivery_area as 'inside_dhaka' | 'outside_dhaka',
            subtotal: Number(o.subtotal),
            deliveryCharge: Number(o.delivery_charge),
            total: Number(o.total),
            status: o.status as Order['status'],
            createdAt: o.created_at
          }));
          setOrders(mappedOrders);
          localStorage.setItem('ahfi_perfume_orders', JSON.stringify(mappedOrders));
        } else if (!orderErr && (!orderData || orderData.length === 0)) {
          // Seed database with current local orders if empty
          const seedOrders = (savedOrders ? JSON.parse(savedOrders) : []) as Order[];
          if (seedOrders.length > 0) {
            const insertData = seedOrders.map(o => ({
              id: o.id,
              name: o.name,
              phone: o.phone,
              address: o.address,
              package_type: o.packageType,
              quantity: o.quantity,
              delivery_area: o.deliveryArea,
              subtotal: o.subtotal,
              delivery_charge: o.deliveryCharge,
              total: o.total,
              status: o.status,
              created_at: o.createdAt
            }));
            await supabase.from('orders').insert(insertData);
          }
        }
      } catch (err) {
        console.error("Supabase sync error:", err);
      }
    };

    syncDataWithSupabase();
  }, []);

  // Save orders to local storage when updated
  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('ahfi_perfume_orders', JSON.stringify(updatedOrders));
  };

  // Order Calculations
  const selectedProduct = productsList.find((p) => p.id === selectedOffer) || productsList[0] || { price: 1290, ml: 50, title: '১টি পারফিউম', id: 'prod-1' };
  const unitPrice = selectedProduct.price;
  const subtotal = unitPrice * quantity;
  const deliveryCharge = deliveryArea === 'inside_dhaka'
    ? (siteConfig.deliveryInsideDhaka !== undefined ? Number(siteConfig.deliveryInsideDhaka) : 70)
    : (siteConfig.deliveryOutsideDhaka !== undefined ? Number(siteConfig.deliveryOutsideDhaka) : 130);
  const total = subtotal + deliveryCharge;

  // Handle Order Submit
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!customerName.trim()) {
      errors.name = 'আপনার নাম দিন';
    }
    if (!customerPhone.trim()) {
      errors.phone = 'মোবাইল নাম্বার দিন';
    } else if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(customerPhone.trim())) {
      errors.phone = 'একটি সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নাম্বার দিন';
    }
    if (!customerAddress.trim()) {
      errors.address = 'ডেলিভারির সম্পূর্ণ ঠিকানা দিন';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to error
      const formElement = document.getElementById('checkout-form-section');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    // Simulate small backend delay for realistic, high-quality feel
    setTimeout(async () => {
      const orderId = `AHFI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: orderId,
        name: customerName.trim(),
        phone: customerPhone.trim(),
        address: customerAddress.trim(),
        packageType: selectedOffer,
        quantity,
        deliveryArea,
        subtotal,
        deliveryCharge,
        total,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      const updated = [newOrder, ...orders];
      saveOrders(updated);

      try {
        await supabase.from('orders').insert([{
          id: newOrder.id,
          name: newOrder.name,
          phone: newOrder.phone,
          address: newOrder.address,
          package_type: newOrder.packageType,
          quantity: newOrder.quantity,
          delivery_area: newOrder.deliveryArea,
          subtotal: newOrder.subtotal,
          delivery_charge: newOrder.deliveryCharge,
          total: newOrder.total,
          status: newOrder.status,
          created_at: newOrder.createdAt
        }]);
      } catch (err) {
        console.error("Error saving order to Supabase:", err);
      }

      setLastCreatedOrder(newOrder);
      setIsSuccessModalOpen(true);
      setIsSubmitting(false);

      // Clear Form
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setQuantity(1);

      // Show float toast
      triggerNotification('আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!');
    }, 1200);
  };

  // Helper to trigger notification toast
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Admin Actions
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    const updated = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    saveOrders(updated);
    triggerNotification(`অর্ডার স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!`);
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    } catch (err) {
      console.error("Error updating order status in Supabase:", err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const updated = orders.filter(order => order.id !== orderId);
    saveOrders(updated);
    triggerNotification(`অর্ডারটি ডিলিট করা হয়েছে।`);
    try {
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (err) {
      console.error("Error deleting order from Supabase:", err);
    }
  };

  // Scroll to element helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Quick select package inside pricing buttons
  const selectPackageAndScroll = (productId: string) => {
    setSelectedOffer(productId);
    scrollToSection('order-form-container');
    const matched = productsList.find(p => p.id === productId);
    const title = matched ? matched.title : 'প্যাকেজ';
    triggerNotification(`${title} অফারটি সিলেক্ট করা হয়েছে!`);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 relative antialiased flex flex-col font-sans">
      
      {/* Top Banner Accent */}
      <div className="bg-amber-500 text-amber-950 text-center py-1.5 px-4 text-xs font-bold tracking-wider z-10 shrink-0">
        ✨ ফ্রি ডেলিভারি ও আকর্ষণীয় ধামাকা অফার উপভোগ করুন!
      </div>

      {/* Hero Header Area */}
      <header className="relative bg-gradient-to-b from-red-950 via-red-900 to-amber-950 text-white overflow-hidden py-10 md:py-16 px-4 shrink-0 shadow-xl border-b border-amber-900/40">
        {/* Subtle decorative bokeh background particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0,transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Logo / Brand Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-3"
          >
            <span className="inline-block bg-amber-500/15 border border-amber-400/30 rounded-full px-4 py-1 text-xs md:text-sm font-semibold tracking-wide text-amber-300">
              👑 লাক্সারি সিগনেচার পারফিউম কালেকশন
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-amber-400 tracking-tight drop-shadow-md mb-4"
          >
            {siteConfig.productTitle || 'আহফি পারফিউম'}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-100 font-medium tracking-wide mb-6 max-w-2xl mx-auto leading-relaxed"
          >
            "{siteConfig.heroTitle}"
          </motion.p>

          {/* Core USP Badges derived dynamically from heroSubtitle */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-xs md:text-sm text-amber-200/90 font-medium mb-8 max-w-2xl mx-auto"
          >
            {siteConfig.heroSubtitle.split('•').map((item, idx) => {
              const trimmed = item.trim();
              if (!trimmed) return null;
              const icons = [
                <Sparkles key="1" className="w-3.5 h-3.5 text-amber-400" />,
                <Award key="2" className="w-3.5 h-3.5 text-amber-400" />,
                <Heart key="3" className="w-3.5 h-3.5 text-amber-400" />,
                <Star key="4" className="w-3.5 h-3.5 text-amber-400" />
              ];
              const icon = icons[idx % icons.length];
              return (
                <span key={idx} className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5 flex items-center gap-1">
                  {icon} {trimmed}
                </span>
              );
            })}
          </motion.div>

          {/* Main Hero Product Frame with interactive slideshow */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative inline-block my-2 w-full max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-amber-400/10 blur-xl rounded-2xl pointer-events-none" />
            <div className="p-2 bg-gradient-to-br from-amber-400/40 via-transparent to-amber-600/40 rounded-2xl shadow-2xl relative group/slider">
              <div className="border border-dashed border-amber-400/60 p-2 rounded-xl bg-black/40 relative overflow-hidden aspect-[4/3] flex items-center justify-center min-h-[250px] md:min-h-[320px]">
                
                {/* Active Image with motion transition */}
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImgIndex}
                    src={imagesToDisplay[activeImgIndex % imagesToDisplay.length]} 
                    alt={`${siteConfig.productTitle || 'আহফি পারফিউম'} showcase`}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg w-full h-full object-cover transform hover:scale-[1.01] transition duration-500 shadow-inner max-h-[330px]"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400&h=300";
                    }}
                  />
                </AnimatePresence>

                {/* Left/Right Arrows for multiple images */}
                {imagesToDisplay.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImgIndex(prev => (prev - 1 + imagesToDisplay.length) % imagesToDisplay.length);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/10 transition opacity-0 group-hover/slider:opacity-100 cursor-pointer z-10 font-bold"
                      aria-label="Previous image"
                    >
                      ❮
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImgIndex(prev => (prev + 1) % imagesToDisplay.length);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/10 transition opacity-0 group-hover/slider:opacity-100 cursor-pointer z-10 font-bold"
                      aria-label="Next image"
                    >
                      ❯
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                      {imagesToDisplay.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImgIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                            i === (activeImgIndex % imagesToDisplay.length) 
                              ? 'bg-amber-400 scale-125' 
                              : 'bg-white/40 hover:bg-white/60'
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
              </div>
            </div>
            {/* Elegant overlay badge */}
            <div className="absolute -bottom-3 right-4 bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg border border-amber-400/50 flex items-center gap-1 animate-float z-10">
              <Sparkles className="w-3 h-3 text-amber-400" /> ১০০% আসল আমদানিকৃত
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto"
          >
            <button 
              onClick={() => scrollToSection('order-form-container')}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-extrabold py-4 px-8 rounded-xl shadow-[0_4px_20px_rgba(234,179,8,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-lg border-b-4 border-amber-600 cursor-pointer"
            >
              <ShoppingBag className="w-5.5 h-5.5 text-slate-950" />
              এখনই অর্ডার করুন
            </button>
            
            <a 
              href={`tel:${siteConfig.buttonPhone}`}
              className="w-full bg-slate-950/80 hover:bg-slate-950 text-white font-extrabold py-4 px-8 rounded-xl border border-slate-700 hover:border-amber-400/50 shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg"
            >
              <Phone className="w-5 h-5 text-amber-400" />
              {siteConfig.buttonPhone}
            </a>
          </motion.div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 space-y-16">

        {/* Section 2: Why Choose Ahfi (আহফি পারফিউম কেন সবার পছন্দ?) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid md:grid-cols-12 gap-0">
          
          <div className="md:col-span-7 p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">বিশেষত্বসমূহ</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-red-800 leading-tight">
                {siteConfig.productTitle || 'আহফি পারফিউম'} কেন সবার পছন্দ?
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full" />
            </div>

            {siteConfig.productDescription && (
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold bg-slate-50 p-4 rounded-xl border border-slate-100">
                {siteConfig.productDescription}
              </p>
            )}

            <ul className="space-y-3.5">
              {ADVANTAGES.map((adv, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="flex items-start gap-3 text-slate-700"
                >
                  <div className="bg-red-50 text-red-700 rounded-full p-1 mt-0.5 shrink-0 border border-red-100">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm md:text-base font-semibold text-slate-700 leading-snug">{adv}</span>
                </motion.li>
              ))}
            </ul>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => scrollToSection('order-form-container')}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold py-3 px-6 rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                এখনই অর্ডার করুন
              </button>
              <a 
                href={`tel:${siteConfig.buttonPhone}`}
                className="bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-3 px-6 rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                {siteConfig.buttonPhone}
              </a>
            </div>
          </div>

          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-red-950 p-6 flex items-center justify-center relative min-h-[300px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0,transparent_100%)] pointer-events-none" />
            <div className="text-center relative z-10 w-full">
              <div className="border border-amber-400/30 p-2 rounded-xl bg-black/30 backdrop-blur-sm max-w-xs mx-auto">
                <img 
                  src={imagesToDisplay[0]} 
                  alt={siteConfig.productTitle || 'Ahfi Premium'} 
                  referrerPolicy="no-referrer"
                  className="rounded-lg shadow-lg w-full aspect-square object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400&h=400";
                  }}
                />
              </div>
              <p className="text-amber-300 font-bold text-sm mt-4 font-mono">Premium Extrait de Parfum ({siteConfig.ml1}ml / {siteConfig.ml2}ml)</p>
            </div>
          </div>

        </section>

        {/* Section 3: FAQ Section (সাধারণ জিজ্ঞাসা) */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-red-800 tracking-tight">
              সাধারণ জিজ্ঞাসা (FAQs)
            </h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full" />
            <p className="text-slate-500 text-xs md:text-sm">
              কাস্টমারদের সচরাচর জিজ্ঞাসিত কিছু প্রশ্নের উত্তর এখানে দেওয়া হলো:
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden max-w-3xl mx-auto">
            {FAQS.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div key={faq.id} className="transition-colors duration-200">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full text-left py-4 px-5 flex items-center justify-between gap-4 font-bold text-slate-800 hover:bg-slate-50/80 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-700 text-xs shrink-0 font-bold">
                        ?
                      </span>
                      <span className="text-sm md:text-base leading-normal">{faq.question}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-500' : ''}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 bg-slate-50/50 text-slate-600 text-xs md:text-sm leading-relaxed border-t border-slate-100 pl-14">
                          {faq.answer.replace('01864444414', siteConfig.buttonPhone)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3">
            <button 
              onClick={() => scrollToSection('order-form-container')}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold py-3 px-6 rounded-lg shadow-sm transition cursor-pointer text-sm md:text-base"
            >
              এখনই অর্ডার করুন
            </button>
            <a 
              href={`tel:${siteConfig.buttonPhone}`}
              className="bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-3 px-6 rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              {siteConfig.buttonPhone}
            </a>
          </div>
        </section>

        {/* Section 4: Why Trust Us (কেন আমাদের উপর ভরসা করবেন?) */}
        <section className="bg-amber-500/5 rounded-2xl border border-amber-500/10 p-6 md:p-8 space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-red-800">
              কেন আমাদের উপর ভরসা করবেন?
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="bg-red-50 text-red-700 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-xs md:text-sm">১০০% অরজিনাল</h3>
              <p className="text-[10px] text-slate-400 mt-1">সরাসরি ইমপোর্টেড প্রিমিয়াম ইনগ্রেডিয়েন্টস</p>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="bg-amber-50 text-amber-700 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-xs md:text-sm">হাতে পেয়ে পেমেন্ট</h3>
              <p className="text-[10px] text-slate-400 mt-1">পণ্য বুঝে পেয়ে মূল্য পরিশোধ করুন</p>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="bg-rose-50 text-rose-700 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-xs md:text-sm">দীর্ঘস্থায়ী সুবাস</h3>
              <p className="text-[10px] text-slate-400 mt-1">১২ থেকে ২৪ ঘণ্টা পর্যন্ত স্থায়ী ঘ্রাণ</p>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="bg-blue-50 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-xs md:text-sm">দ্রুত ডেলিভারি</h3>
              <p className="text-[10px] text-slate-400 mt-1">সারাদেশে নিরাপদ ও দ্রুততম ডেলিভারি</p>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex flex-col items-center text-center col-span-2 md:col-span-1">
              <div className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <Undo className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-xs md:text-sm">সহজ রিটার্ন</h3>
              <p className="text-[10px] text-slate-400 mt-1">পণ্য ত্রুটিপূর্ণ হলে ৭ দিনে পরিবর্তনযোগ্য</p>
            </div>

          </div>
        </section>

        {/* Section 5: Dynamic Pricing Offer (প্যাকেজ সমূহ) */}
        <section className="bg-gradient-to-r from-red-900 to-red-950 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden text-center space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.1)_0,transparent_70%)] pointer-events-none" />
          
          <div className="space-y-1">
            <span className="bg-amber-400 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block">স্পেশাল প্রোমোショナル অফার</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-amber-300">আকর্ষণীয় মূল্য ধামাকা!</h2>
            <p className="text-slate-300 text-xs md:text-sm">আপনার পছন্দের যেকোনো অফারটি সিলেক্ট করে সরাসরি নিচে অর্ডার ফরম পূরণ করুন।</p>
          </div>

          <div className={`grid gap-4 max-w-2xl mx-auto pt-2 ${
            productsList.length === 1 ? 'grid-cols-1 max-w-md' :
            productsList.length === 2 ? 'sm:grid-cols-2' :
            'sm:grid-cols-3'
          }`}>
            {productsList.map((prod: Product) => (
              <div 
                key={prod.id}
                onClick={() => selectPackageAndScroll(prod.id)}
                className={`p-5 rounded-xl border text-center transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedOffer === prod.id
                    ? 'bg-white/10 border-amber-400 ring-2 ring-amber-400'
                    : 'bg-black/20 border-white/10 hover:border-white/30'
                }`}
              >
                {prod.badge && (
                  <div className="absolute -top-3 right-3 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {prod.badge}
                  </div>
                )}
                {selectedOffer === prod.id && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    সিলেক্টেড
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-slate-100">{prod.title} ({prod.ml} মিলি)</h3>
                  <div className="my-3 flex items-center justify-center gap-1.5">
                    <span className="text-3xl font-extrabold text-amber-300">৳ {prod.price}</span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-slate-400 line-through text-xs font-mono">৳ {prod.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300">{prod.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
            <button 
              onClick={() => scrollToSection('order-form-container')}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold py-3.5 px-8 rounded-lg shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 text-md border-b-2 border-amber-600 cursor-pointer w-full sm:w-auto"
            >
              এখনই অর্ডার করুন
            </button>
            <a 
              href={`tel:${siteConfig.buttonPhone}`}
              className="bg-slate-950/60 hover:bg-slate-950 text-white font-extrabold py-3.5 px-8 rounded-lg border border-slate-700 hover:border-amber-400/50 shadow-md transition flex items-center justify-center gap-2 text-md w-full sm:w-auto"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              {siteConfig.buttonPhone}
            </a>
          </div>

          <div className="text-xs text-amber-200/80 flex items-center justify-center gap-2 pt-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <span>ডেলিভারি চার্জ: ঢাকার ভিতরে {siteConfig.deliveryInsideDhaka === 0 ? 'ফ্রি' : 'মাত্র ৳' + siteConfig.deliveryInsideDhaka}, ঢাকার বাইরে {siteConfig.deliveryOutsideDhaka === 0 ? 'ফ্রি' : '৳' + siteConfig.deliveryOutsideDhaka}</span>
          </div>
        </section>

        {/* Section 6: Checkout Order Form (অর্ডার করতে নিচের ফরমটি পূরণ করুন) */}
        <section id="order-form-container" className="scroll-mt-6">
          <div className="bg-red-800 text-white py-3.5 px-6 rounded-t-2xl font-extrabold text-center text-lg md:text-xl shadow-md border-b border-red-900 flex items-center justify-center gap-2">
            <ShoppingBag className="w-5.5 h-5.5 text-amber-300 animate-bounce" />
            অর্ডার করতে নিচের ফরমটি পূরণ করুন
          </div>

          <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl p-5 md:p-8 shadow-md">
            
            <form onSubmit={handleCheckoutSubmit} className="grid md:grid-cols-12 gap-8">
              
              {/* Left Side: Customer Info Form */}
              <div className="md:col-span-7 space-y-5">
                <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-red-700" />
                  আপনার তথ্য
                </h3>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">
                    আপনার নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition ${
                      formErrors.name 
                        ? 'border-red-500 ring-1 ring-red-100 bg-red-50/10' 
                        : 'border-slate-300 focus:ring-2 focus:ring-red-800/20 focus:border-red-800'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-600 font-semibold">{formErrors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">
                    মোবাইল নাম্বার <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="১১ ডিজিটের মোবাইল নাম্বার লিখুন (যেমন: 017xxxxxxxx)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm font-mono focus:outline-none transition ${
                      formErrors.phone 
                        ? 'border-red-500 ring-1 ring-red-100 bg-red-50/10' 
                        : 'border-slate-300 focus:ring-2 focus:ring-red-800/20 focus:border-red-800'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-red-600 font-semibold">{formErrors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">
                    ডেলিভারির সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="গ্রাম/রোড, পোস্ট অফিস, থানা, জেলা উল্লেখ করুন..."
                    value={customerAddress}
                    rows={3}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition ${
                      formErrors.address 
                        ? 'border-red-500 ring-1 ring-red-100 bg-red-50/10' 
                        : 'border-slate-300 focus:ring-2 focus:ring-red-800/20 focus:border-red-800'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-xs text-red-600 font-semibold">{formErrors.address}</p>
                  )}
                </div>

                {/* Area Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">ডেলিভারি এরিয়া সিলেক্ট করুন</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                      deliveryArea === 'inside_dhaka'
                        ? 'border-red-700 bg-red-50/20 ring-1 ring-red-700/30'
                        : 'border-slate-300 hover:border-slate-400 bg-white'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="deliveryArea"
                          checked={deliveryArea === 'inside_dhaka'}
                          onChange={() => setDeliveryArea('inside_dhaka')}
                          className="text-red-800 focus:ring-red-800"
                        />
                        <span className="text-xs md:text-sm font-semibold text-slate-700">ঢাকার ভিতরে</span>
                      </div>
                      <span className="text-xs font-bold text-red-800">{siteConfig.deliveryInsideDhaka === 0 ? 'ফ্রি' : '৳' + siteConfig.deliveryInsideDhaka}</span>
                    </label>

                    <label className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                      deliveryArea === 'outside_dhaka'
                        ? 'border-red-700 bg-red-50/20 ring-1 ring-red-700/30'
                        : 'border-slate-300 hover:border-slate-400 bg-white'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="deliveryArea"
                          checked={deliveryArea === 'outside_dhaka'}
                          onChange={() => setDeliveryArea('outside_dhaka')}
                          className="text-red-800 focus:ring-red-800"
                        />
                        <span className="text-xs md:text-sm font-semibold text-slate-700">ঢাকার বাইরে</span>
                      </div>
                      <span className="text-xs font-bold text-red-800">{siteConfig.deliveryOutsideDhaka === 0 ? 'ফ্রি' : '৳' + siteConfig.deliveryOutsideDhaka}</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Right Side: Order Summary */}
              <div className="md:col-span-5 bg-slate-50 border border-slate-200/80 p-5 rounded-xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-red-700" />
                    অর্ডার সামারি
                  </h3>

                  {/* Package Quick Selector (Form Level Sync) */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-500">প্যাকেজ পরিবর্তন করুন:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {productsList.map((prod) => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => setSelectedOffer(prod.id)}
                          className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold transition truncate ${
                            selectedOffer === prod.id
                              ? 'bg-red-800 text-white border-red-800'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                          title={prod.title}
                        >
                          {prod.title} (৳{prod.price})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Mini Preview */}
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
                    <img 
                      src={imagesToDisplay[0]} 
                      alt="Mini perfume" 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-md border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-xs md:text-sm truncate">
                        {siteConfig.productTitle || 'আহফি পারফিউম'} ({selectedProduct.ml}ml)
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        প্যাকেজ: <span className="font-bold text-slate-600">{selectedProduct.title}</span>
                      </div>
                    </div>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-300 rounded overflow-hidden bg-white shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-2.5 font-bold text-xs text-slate-700">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 border-t border-slate-200 pt-3 text-xs md:text-sm font-semibold">
                    <div className="flex justify-between text-slate-600">
                      <span>পণ্যের মূল্য</span>
                      <span>৳ {subtotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>ডেলিভারি চার্জ</span>
                      <span>৳ {deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between text-slate-800 font-bold text-sm md:text-base border-t border-dashed border-slate-300 pt-2">
                      <span>মোট পরিশোধ</span>
                      <span className="text-red-800">৳ {total}</span>
                    </div>
                  </div>

                  {/* Payment Method Option */}
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-800 flex items-center justify-center text-[8px] text-white font-bold font-mono">
                        ✓
                      </div>
                      <span className="text-xs md:text-sm font-bold text-slate-800">ক্যাশ অন ডেলিভারি (পণ্য পেয়ে পেমেন্ট)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                      পণ্য হাতে পেয়ে চেক করে সম্পূর্ণ সন্তুষ্ট হয়ে তারপর ডেলিভারি ম্যানের কাছে টাকা পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                    </p>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-800 hover:bg-red-900 text-white font-black py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 active:translate-y-0 text-md md:text-lg flex items-center justify-center gap-2 border-b-4 border-red-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      অর্ডার পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5.5 h-5.5 text-amber-300" />
                      অর্ডার নিশ্চিত করুন
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Quick Note below form */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-2">
              <span className="flex items-center gap-1.5 font-semibold">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                ঢাকার ভিতরে ১-২ দিন, ঢাকার বাইরে ২-৪ দিন নিশ্চিত ডেলিভারি।
              </span>
              <span className="flex items-center gap-1">
                🛡️ সম্পূর্ণ সিকিউর ক্যাশ অন ডেলিভারি গেটওয়ে
              </span>
            </div>

          </div>
        </section>

        {/* Section 7: Live Reviews Showcase */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 flex items-center justify-center gap-1">
              কাস্টমারদের মতামত
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
            <p className="text-slate-500 text-xs md:text-sm">আমাদের থেকে পারফিউম কিনেছেন এমন কয়েকজন গ্রাহকের সৎ রিভিউ:</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-semibold italic">"{rev.text}"</p>
                </div>
                
                <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center shrink-0 border border-slate-200 text-xs uppercase">
                    {rev.name ? rev.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs md:text-sm">{rev.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{rev.date} • ভেরিফাইড পারচেজ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer Area */}
      <footer className="bg-slate-900 text-slate-300 py-10 px-4 mt-16 border-t-2 border-amber-500/20 shrink-0">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-8 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-amber-400 tracking-wide">আহফি পারফিউম (AHFI Perfume)</h2>
              <p className="text-xs text-slate-500 mt-1">সবচেয়ে সেরা ও দীর্ঘস্থায়ী এক্সট্রেট ডি পারফাম সুগন্ধি</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold">
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition py-1 px-3 bg-slate-800 rounded border border-slate-700 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                অ্যাডমিন প্যানেল
              </button>
              
              <a href={`tel:${siteConfig.headerPhone}`} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded transition flex items-center gap-1 font-mono">
                📞 {toBengaliNumber(siteConfig.headerPhone)}
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} AHFI PERFUME. সর্বস্বত্ব সংরক্ষিত।</p>
            <div className="flex items-center gap-4 font-semibold">
              <span className="hover:text-amber-400 transition cursor-pointer">গোপনীয়তা নীতি</span>
              <span>|</span>
              <span className="hover:text-amber-400 transition cursor-pointer">শর্তাবলী</span>
              <span>|</span>
              <span className="hover:text-amber-400 transition cursor-pointer">যোগাযোগ</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Success / Invoice Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && lastCreatedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100"
            >
              {/* Green Success Header */}
              <div className="bg-emerald-600 text-white p-6 text-center space-y-2">
                <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</h3>
                <p className="text-emerald-100 text-xs">আমাদের প্রতিনিধি দ্রুতই আপনার সাথে মোবাইলে যোগাযোগ করবেন।</p>
              </div>

              {/* Order Invoice Details */}
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 font-bold">
                    <span>অর্ডার আইডি:</span>
                    <span className="font-mono text-slate-800">{lastCreatedOrder.id}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>তারিখ ও সময়:</span>
                    <span className="text-slate-800">{new Date(lastCreatedOrder.createdAt).toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>গ্রাহকের নাম:</span>
                    <span className="font-bold text-slate-800">{lastCreatedOrder.name}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>মোবাইল নাম্বার:</span>
                    <span className="font-bold text-slate-800 font-mono">{lastCreatedOrder.phone}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>ডেলিভারি এরিয়া:</span>
                    <span className="font-bold text-slate-800">{lastCreatedOrder.deliveryArea === 'inside_dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 border-t border-dashed border-slate-200 pt-2 font-bold">
                    <span className="text-slate-800">মোট বিল (COD):</span>
                    <span className="text-red-800 text-sm">৳ {lastCreatedOrder.total}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 font-medium leading-normal">
                  <p className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    আপনার অর্ডারটি সুনিশ্চিত করার জন্য আমাদের কাস্টমার কেয়ার প্রতিনিধি আপনার নাম্বারে কল করবেন। দয়া করে ফোনটি সাথে রাখুন।
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    ঢাকার ভিতরে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ২-৪ দিনের মধ্যে ডেলিভারি পেয়ে যাবেন।
                  </p>
                </div>

                <button
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-3 px-6 rounded-xl shadow-md transition"
                >
                  ঠিক আছে, ধন্যবাদ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Panel Modal Overlay */}
      {isAdminOpen && (
        <AdminPanel
          orders={orders}
          onUpdateStatus={handleUpdateStatus}
          onDeleteOrder={handleDeleteOrder}
          onClose={() => setIsAdminOpen(false)}
          siteConfig={siteConfig}
          onUpdateSiteConfig={handleUpdateSiteConfig}
          reviews={reviews}
          onUpdateReviews={handleUpdateReviews}
        />
      )}

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 bg-slate-900/95 backdrop-blur text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 max-w-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs md:text-sm font-semibold">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/88${siteConfig.buttonPhone}?text=Hello,%20I%20want%20to%20know%20more%20about%20Ahfi%20Perfume`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl hover:shadow-emerald-500/20 hover:scale-110 transition duration-300 flex items-center justify-center animate-bounce"
        title="WhatsApp-এ যোগাযোগ করুন"
      >
        {/* Customized WhatsApp Icon */}
        <svg 
          className="w-6.5 h-6.5 fill-current" 
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 12.008 0c3.237.001 6.278 1.261 8.567 3.551 2.289 2.289 3.548 5.33 3.549 8.566-.002 6.677-5.327 12.001-12.007 12.001-1.992-.001-3.951-.493-5.688-1.429L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.858.002-2.634-1.023-5.11-2.885-6.973C16.486 1.95 14.015 1.155 11.4 1.155 5.968 1.155 1.543 5.58 1.54 11.018c0 1.719.475 3.393 1.373 4.877L1.85 20.312l4.797-1.158zM17.842 14.5c-.328-.164-1.942-.958-2.242-1.069-.3-.109-.519-.164-.737.164-.219.328-.847 1.069-1.038 1.288-.19.219-.382.246-.71.082-.328-.164-1.386-.51-2.64-1.627-.977-.872-1.637-1.95-1.828-2.279-.19-.328-.02-.505.144-.668.148-.147.328-.383.492-.574.164-.19.219-.328.328-.546.109-.219.055-.41-.027-.574-.082-.164-.737-1.777-1.01-2.433-.266-.641-.54-.553-.738-.563-.19-.01-.41-.01-.628-.01-.219 0-.573.082-.873.41-.3.328-1.147 1.12-1.147 2.733s1.174 3.171 1.338 3.39c.164.219 2.31 3.528 5.596 4.945.781.337 1.391.539 1.866.69.785.249 1.5.214 2.065.13.63-.094 1.943-.794 2.216-1.52.273-.727.273-1.35.19-1.479-.082-.128-.3-.219-.628-.382z" />
        </svg>
      </a>

    </div>
  );
}
