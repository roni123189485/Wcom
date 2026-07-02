import { Ingredient, FAQ, Review } from './types';

export const INGREDIENTS: Ingredient[] = [
  {
    id: '1',
    name: 'বার্গামট',
    englishName: 'Bergamot',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: '2',
    name: 'ল্যাভেন্ডার',
    englishName: 'Lavender',
    imageUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: '3',
    name: 'চন্দন',
    englishName: 'Sandalwood',
    imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: '4',
    name: 'আম্বর',
    englishName: 'Amber',
    imageUrl: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: '5',
    name: 'ভ্যানিলা',
    englishName: 'Vanilla',
    imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: '6',
    name: 'মাস্ক',
    englishName: 'Musk',
    imageUrl: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: '7',
    name: 'প্যাচৌলি',
    englishName: 'Patchouli',
    imageUrl: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: '8',
    name: 'রোজ',
    englishName: 'Rose',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=300&h=300'
  }
];

export const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'পারফিউম কতক্ষণ স্থায়ী হয়?',
    answer: 'আমাদের প্রিমিয়াম আহফি পারফিউম মূলত এক্সট্রেট ডি পারফাম (Extrait de Parfum) গ্রেডের, যা কাপড়ে ১২ থেকে ২৪ ঘণ্টা এবং স্কিনে ৮ থেকে ১২ ঘণ্টা পর্যন্ত দীর্ঘস্থায়ী সুবাস ছড়ায়।'
  },
  {
    id: 'faq-2',
    question: 'স্কিনে অ্যালার্জি হবে কি?',
    answer: 'জী না, আমাদের পারফিউম সম্পূর্ণ স্কিন-ফ্রেন্ডলি উপাদান এবং ডার্মাটোলজিক্যালি নিরাপদ ফর্মুলায় তৈরি। এটি সরাসরি ত্বকে বা কাপড়ে নিরাপদে ব্যবহার করা যায়।'
  },
  {
    id: 'faq-3',
    question: 'পুরুষ এবং মহিলা উভয়েই কি ব্যবহার করতে পারবে?',
    answer: 'জী হ্যাঁ! আহফি পারফিউম একটি চমৎকার ইউনিসেক্স (Unisex) সুগন্ধি। এর ব্লেন্ডিংটি এমনভাবে করা হয়েছে যা পুরুষ এবং নারী উভয়ের ব্যক্তিত্বের সাথেই চমৎকার মানিয়ে যায়।'
  },
  {
    id: 'faq-4',
    question: 'কত দিনের মধ্যে ডেলিভারি পাবো?',
    answer: 'ঢাকার ভিতরে আমরা ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি দিয়ে থাকি। ঢাকার বাইরে ২ থেকে ৪ দিনের মধ্যে আপনার ঠিকানায় ক্যাশ অন ডেলিভারি করা হবে।'
  },
  {
    id: 'faq-5',
    question: 'অর্ডার কিভাবে করবো?',
    answer: 'নিচের অর্ডারের ফরমে আপনার নাম, মোবাইল নম্বর এবং সঠিক ঠিকানা লিখে "অর্ডার নিশ্চিত করুন" বোতামে ক্লিক করুন। অথবা যেকোনো প্রয়োজনে সরাসরি কল করুন 01864444414 নম্বরে।'
  },
  {
    id: 'faq-6',
    question: 'পেমেন্ট করার পদ্ধতি কি কি?',
    answer: 'আমরা সম্পূর্ণ "ক্যাশ অন ডেলিভারি" (Cash on Delivery) সুবিধা দিচ্ছি। অর্থাৎ, ডেলিভারি ম্যানের কাছ থেকে পারফিউম হাতে পেয়ে সুগন্ধ দেখে ও বুঝে তারপর টাকা পরিশোধ করবেন।'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'মোঃ তানভীর হাসান',
    rating: 5,
    text: 'অসাধারণ সুগন্ধ! সত্যি বলতে আমি ১২ ঘণ্টারও বেশি সময় ধরে কাপড়ে এর ঘ্রাণ পাচ্ছিলাম। প্যাকেজিং চমৎকার ছিল।',
    date: '২ দিন আগে',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'
  },
  {
    id: 'rev-2',
    name: 'ফারজানা আক্তার লিজা',
    rating: 5,
    text: 'এটি একটি নিখুঁত ইউনিসেক্স সুগন্ধি। আমি এবং আমার হাসব্যান্ড দুজনেই ব্যবহার করছি। সবাই খুব প্রশংসা করছে। রিকমেন্ডেড!',
    date: '৫ দিন আগে',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
  },
  {
    id: 'rev-3',
    name: 'রাশেদুল বারী',
    rating: 5,
    text: 'ডেলিভারি অনেক ফাস্ট ছিল। ঢাকার বাইরে ২ দিনে পেয়েছি। গন্ধটা অনেক বেশি এলিগেন্ট এবং শান্ত অনুভূতি দেয়।',
    date: '১ সপ্তাহ আগে',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
  }
];

export const ADVANTAGES = [
  'দীর্ঘস্থায়ী সুগন্ধ - ১২-২৪ ঘণ্টা পর্যন্ত ফ্রেশ অনুভূতি।',
  'প্রিমিয়াম কোয়ালিটি - সেরা ইমপোর্টেড এসেন্স ব্যবহার।',
  'স্কিন ফ্রেন্ডলি - ত্বকে কোন রকম ক্ষতি করে না।',
  'আকর্ষণীয় ডিজাইন - প্রিমিয়াম লুক, যেকোনো সময় উপহার হিসেবে উপযুক্ত।',
  'ইউনিক ফ্লেভারস - ভিড়ের মধ্যে আপনাকে আলাদা করে চিনিয়ে দেয়।',
  'পুরুষ ও মহিলাদের জন্য উপযোগী (Unisex)।',
  'দৈনন্দিন ব্যবহার ও বিশেষ অনুষ্ঠানের জন্য পারফেক্ট।',
  'বাংলাদেশের আবহাওয়ার সাথে ১০০% উপযোগী।'
];
