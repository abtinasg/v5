import Link from "next/link";
import { MessageSquare, Image, Video, Music, Users, TrendingUp, Sparkles, ArrowLeft } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "چت‌بات هوشمند",
    description: "۵ مدل مختلف هوش مصنوعی",
    href: "/chat",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Image,
    title: "ساخت عکس",
    description: "تولید تصاویر با DALL-E",
    href: "/images",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Video,
    title: "ساخت ویدیو",
    description: "تولید ویدیو با هوش مصنوعی",
    href: "/videos",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: Music,
    title: "ساخت موسیقی",
    description: "تولید موسیقی اختصاصی",
    href: "/music",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: Users,
    title: "ایجنت‌های تخصصی",
    description: "دستیارهای هوشمند متنوع",
    href: "/agents",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: TrendingUp,
    title: "تحلیل مالی",
    description: "داده‌های لحظه‌ای بازار ایران",
    href: "/financial",
    color: "from-amber-500 to-yellow-500",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 dark:from-blue-600/10 dark:to-purple-600/10" />
        <div className="relative px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              پلتفرم جامع هوش مصنوعی
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              AI Hub{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Iran
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8">
              قدرتمندترین ابزارهای هوش مصنوعی در یک پلتفرم
              <br />
              چت، عکس، ویدیو، موسیقی و تحلیل مالی
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200"
            >
              شروع کنید
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            امکانات
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-3`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© ۱۴۰۳ AI Hub Iran - تمامی حقوق محفوظ است</p>
      </footer>
    </div>
  );
}
