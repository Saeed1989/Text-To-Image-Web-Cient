'use client';
import Head from 'next/head';
import { blogPost } from '@/data/blog-post-data';

export default function Blog() {
  return (
    <>
      <Head>
        <title>EasyAIArt Blog: Easy AI Art, Image Generation & More</title>
        <meta name="description" content="Discover the latest news, trends, and insights in AI art and image generation. Learn how to use EasyAIArt to create stunning images" />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="flex flex-col items-center justify-start min-h-screen bg-secondary p-4">
        <h1 className="text-2xl font-bold mb-4 text-primary">Welcome to the ImaginAI Blog</h1>
        <p className="text-muted-foreground">Stay updated with the latest news and tips in the world of AI Art!</p>
        <h2 className="text-xl font-semibold mt-8 mb-4 text-primary">{blogPost.title}</h2>
        <p className="text-muted-foreground">{blogPost.content}</p>
      </div>
    </>
  );
}