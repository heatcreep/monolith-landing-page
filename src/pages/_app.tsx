import type { AppProps } from 'next/app'
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <main
            className="relative min-h-screen grid grid-cols-1 content-center bg-center bg-cover w-full"
            style={{ backgroundImage: `url("/landing-bg.png")` }}
        >
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="bg-stone-900 text-amber-50 p-16 rounded-lg z-10 relative flex space-y-4 flex-col items-center justify-center text-center">
                <Toaster position="bottom-center" />
                <Component {...pageProps} />
            </div>
        </main>

    )
}