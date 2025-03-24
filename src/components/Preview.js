// src/components/Preview.js
import React from 'react';
import { Brain, Heart, Dumbbell, Salad, Smile, CheckCircle } from 'lucide-react';

const Preview = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">ASCEND</h1>
          <p className="text-xl">Yaşamınızı Dönüştüren AI Destekli Kişisel Koçunuz</p>
        </div>
      </div>

      {/* Main Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div key={feature.title} className="p-6 rounded-lg bg-white shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              {feature.icon}
              <h3 className="text-lg font-semibold">{feature.title}</h3>
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
          <h3 className="text-xl font-bold mb-4">Basic Plan</h3>
          <div className="text-3xl font-bold mb-4">₺149<span className="text-base font-normal">/ay</span></div>
          <ul className="space-y-2">
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Temel egzersiz planları</li>
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Günlük meditasyon</li>
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Beslenme takibi</li>
          </ul>
        </div>
        
        <div className="p-6 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <h3 className="text-xl font-bold mb-4">Premium Plan</h3>
          <div className="text-3xl font-bold mb-4">₺299<span className="text-base font-normal">/ay</span></div>
          <ul className="space-y-2">
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-2" /> Kişiselleştirilmiş AI koçluk</li>
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-2" /> İleri seviye antrenman planları</li>
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-2" /> Profesyonel beslenme danışmanlığı</li>
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-2" /> Sınırsız içerik erişimi</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: <Brain className="w-8 h-8 text-indigo-600" />,
    title: "Bilinç Gelişimi",
    description: "AI destekli meditasyon ve farkındalık egzersizleri"
  },
  {
    icon: <Dumbbell className="w-8 h-8 text-indigo-600" />,
    title: "Fitness Optimizasyonu",
    description: "Kişiselleştirilmiş antrenman programları"
  },
  {
    icon: <Heart className="w-8 h-8 text-indigo-600" />,
    title: "Sağlık Geliştirme",
    description: "Biyometrik takip ve sağlık önerileri"
  },
  {
    icon: <Smile className="w-8 h-8 text-indigo-600" />,
    title: "Zihinsel Gelişim",
    description: "Bilişsel geliştirme ve odaklanma teknikleri"
  },
  {
    icon: <Salad className="w-8 h-8 text-indigo-600" />,
    title: "Beslenme Danışmanlığı",
    description: "Kişiselleştirilmiş beslenme planları ve öneriler"
  }
];

export default Preview;