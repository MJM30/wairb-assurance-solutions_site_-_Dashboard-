"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MultiStepForm from "@/components/MultiStepForm";
import { actualites } from "@/data/actualites";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ActualiteDetailPage(props: Props) {
  const { id } = use(props.params);
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);

  const article = actualites.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
        <Button onClick={() => router.push("/actualites")}>Retour aux actualités</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onRequestClick={() => setFormOpen(true)} />

      <main className="pt-32 pb-24">
        <div className="container max-w-4xl">
          <Link href="/actualites" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-semibold mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux actualités
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="badge-primary flex items-center gap-1">
                <Tag className="w-3 h-3" /> {article.category}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" /> {article.date}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">{article.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-5">{article.excerpt}</p>
          </header>

          <div className="aspect-[16/6] rounded-2xl overflow-hidden mb-12 shadow-lg">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-lg max-w-none text-foreground leading-relaxed">
            {article.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-6 text-base md:text-lg leading-loose">{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t flex items-center justify-between flex-wrap gap-4">
            <Button variant="outline" className="rounded-full" onClick={() => router.push('/actualites')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voir tous les articles
            </Button>
            <Button className="rounded-full" onClick={() => setFormOpen(true)}>
              <Share2 className="w-4 h-4 mr-2" /> Soumettre une demande
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <MultiStepForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
