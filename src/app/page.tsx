'use client';
import Head from 'next/head';
import Link from 'next/link';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {generateImageFromText} from '@/ai/flows/generate-image-from-text';
import {improvePromptQuality} from '@/ai/flows/improve-prompt-quality';
import {Download, RefreshCw} from 'lucide-react';
import {Skeleton} from "@/components/ui/skeleton";
import {useToast} from "@/hooks/use-toast";

export default function Home() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    setIsLoading(true);
    try {
      let prompt = text;
      // Improve the prompt quality using Genkit
      // const improvedPromptResult = await improvePromptQuality({initialPrompt: text});
      // prompt = improvedPromptResult.refinedPrompt;

      // Generate the image using Genkit
      //const imageResult = await generateImageFromText({prompt: prompt});
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast({
        title: 'Error generating image',
        description: error.message,
        variant: "destructive"
      });
      setImageUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl, {
          mode: 'cors', // Add this line
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'generated_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error: any) {
        console.error('Error downloading image:', error);
        toast({ title: 'Download failed', description: error.message, variant: 'destructive' });
      }
    } else {
      toast({ title: 'No image to download', description: 'Generate an image first.' });
    }
  };

  const handleNewImage = () => {
    setImageUrl(null);
    setText('');
  };

  return (
    <>
      <Head>
        <title>EasyAIArt: Easy Free AI Text to Image | Create AI Art</title>
        <meta name="description" content="EasyAIArt: Create stunning AI art for free! Our advanced AI Image Generator turns your text prompts into unique images. Try our easy and free Text-to-Image AI now!" />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="flex flex-col items-center justify-start min-h-screen bg-secondary p-4">
        <h1 className="text-2xl font-bold mb-4 text-primary">Create Amazing AI-Powered Images for Free</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-primary">How to use our AI Image Generator</h2>
          <p className="text-muted-foreground">Simply enter a text prompt describing the image you want to create, and our AI will generate a unique image based on your input.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-primary">Use Cases</h2>
          <p className="text-muted-foreground">Generate images for various purposes, including social media content, website visuals, illustrations, concept art, and more. Let your imagination run wild!</p>
        </section>

      <div className="flex flex-col md:flex-row w-full max-w-3xl space-y-4 md:space-x-4 md:space-y-0">
        <div className="flex flex-col w-full relative">
          <Textarea
            placeholder="Enter text to convert to image"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mb-2"
          />
          <Button
            onClick={handleGenerateImage}
            disabled={isLoading}
            className="bg-accent text-primary rounded-md shadow-sm hover:bg-accent-foreground disabled:bg-muted"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </Button>
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-secondary bg-opacity-75 rounded-md">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          )}
        </div>


        <div className="flex flex-col items-center w-full">
          {isLoading ? (
            <Skeleton className="w-full h-64 rounded-md"/>
          ) : imageUrl ? (
            <>
              <img src={imageUrl} alt="Generated Image" className="max-w-full rounded-md shadow-md mb-4"/>
              <div className="flex space-x-2">
                <Button onClick={handleDownloadImage} className="bg-primary text-secondary rounded-md shadow-sm hover:bg-primary-foreground">
                  <Download className="mr-2 h-4 w-4"/>
                  Download Image
                </Button>
                <Button onClick={handleNewImage} disabled={isLoading} className="bg-accent text-primary rounded-md shadow-sm hover:bg-accent-foreground disabled:bg-muted">
                  <RefreshCw className="mr-2 h-4 w-4"/>
                  New Image
                </Button>
              </div>
            </>
          ) : null}

        <p className="mt-4 text-muted-foreground">
          <Link href="/blog">Visit our Blog</Link>
        </p>
            </div>
          </div>
      </div>
    </>
  );
}
