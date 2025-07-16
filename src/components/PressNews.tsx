"use client";

import { motion } from "framer-motion";
import { ExternalLink, Calendar, Clock } from "lucide-react";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  source: string;
  publishedDate: string;
  readTime: string;
  url: string;
  category: "press" | "news";
}

const articles: Article[] = [
  {
    id: "1",
    title: "Blue Scorpion Venom: What Doesn't Kill You Can Heal You",
    excerpt: "As a single mom dealing with daily pain and inflammation, I've spent seven years chasing natural remedies. Blue Scorpion Pain & Inflammation Relief feels like healing bottled up—a homeopathic formula that targets pain and inflammation naturally.",
    imageUrl: "/blue-scorpion-venom-lifestyle.png",
    source: "Biohack Yourself",
    publishedDate: "2024-01-01",
    readTime: "4 min read",
    url: "https://www.biohackyourself.com/peer-reviewed/blue-scorpion-venom",
    category: "press"
  },
  {
    id: "2",
    title: "Blue Scorpion Under Review: Non-Toxic Homeopathic Oral Liquid Venom for Natural Pain & Inflammation Relief",
    excerpt: "A cutting-edge homeopathic formula featuring diluted Blue Scorpion venom (Heteroctenus princeps), Apis Mellifica, and Rhus Toxicodendron—positioned as a non-toxic, drug-free innovation for natural pain and inflammation support.",
    imageUrl: "/yahoo-image.webp",
    source: "Yahoo Finance",
    publishedDate: "2025-05-15",
    readTime: "29 min read",
    url: "https://finance.yahoo.com/news/blue-scorpion-under-review-non-000000305.html",
    category: "news"
  }
];

function ArticleCard({ article }: { article: Article }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Use stable delay based on article id hash
  const delay = Math.abs(article.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 150 / 1000;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      viewport={{ once: true, margin: "-10%" }}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-gray-300 group"
    >
      <a href={article.url} className="block">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink size={16} className="text-white" />
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="font-medium text-brand-primary">{article.source}</span>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(article.publishedDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{article.readTime}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>
      </a>
    </motion.article>
  );
}

export default function PressNews() {
  return (
    <section id="press-news" className="pt-20 lg:pt-32 pb-8 bg-white">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            Press & News
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news and press coverage about Blue Scorpion
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

      </div>
    </section>
  );
}